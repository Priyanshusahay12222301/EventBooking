class ChatApp {
    constructor() {
        this.socket = null;
        this.currentUser = null;
        this.currentGroupId = 1; // Default to group 1
        this.isAnonymous = true;
        this.isTyping = false;
        this.typingTimeout = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeApp();
    }

    initializeElements() {
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.anonymousToggle = document.getElementById('anonymousToggle');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.anonymousIndicator = document.getElementById('anonymousIndicator');
        this.attachBtn = document.getElementById('attachBtn');
        this.cameraBtn = document.getElementById('cameraBtn');
    this.composerWrapper = document.querySelector('.composer-wrapper');
        this.indicatorEl = document.getElementById('anonymousIndicator');
    }

    initializeEventListeners() {
        // Send message events
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Typing indicators
        this.messageInput.addEventListener('input', () => this.handleTyping());
        this.messageInput.addEventListener('blur', () => this.stopTyping());

        // Anonymous toggle
        this.anonymousToggle.addEventListener('change', (e) => {
            this.isAnonymous = e.target.checked;
            this.updateAnonymousIndicator();
        });

        // Input validation
        this.messageInput.addEventListener('input', () => this.validateInput());

        // Attach and camera buttons (placeholder functionality)
        this.attachBtn.addEventListener('click', () => this.handleAttachment());
        this.cameraBtn.addEventListener('click', () => this.handleCamera());
    }

    async initializeApp() {
        try {
            // Show loading screen
            this.showLoading();

            // Create anonymous session
            await this.createAnonymousSession();

            // Initialize socket connection
            this.initializeSocket();

            // Load existing messages
            await this.loadMessages();

            // Hide loading screen
            this.hideLoading();

            // Update UI
            this.updateAnonymousIndicator();
            this.focusInput();
            this.adjustBottomPadding();
            this.updateIndicatorLength();

        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to connect to chat');
        }
    }

    async createAnonymousSession() {
        try {
            const response = await fetch('/api/chat/anonymous-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
            }
        } catch (error) {
            console.error('Failed to create anonymous session:', error);
        }
    }

    initializeSocket() {
        this.socket = io();

        // Connection events
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.joinGroup();
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Message events
        this.socket.on('new-message', (message) => {
            this.displayMessage(message);
            this.scrollToBottom();
        });

        // Typing events
        this.socket.on('user-typing', (data) => {
            this.handleUserTyping(data);
        });

        // Error handling
        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
            this.showError(error.message || 'Connection error');
        });
    }

    joinGroup() {
        if (this.socket && this.currentUser) {
            this.socket.emit('join-group', {
                groupId: this.currentGroupId,
                userId: this.currentUser.id,
                isAnonymous: this.isAnonymous
            });
        }
    }

    async loadMessages() {
        try {
            const response = await fetch(`/api/chat/groups/${this.currentGroupId}/messages`);
            
            if (response.ok) {
                const messages = await response.json();
                this.displayMessages(messages);
                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    }

    displayMessages(messages) {
        this.messagesContainer.innerHTML = '';
        let lastDateKey = '';
        let lastSenderKey = '';
        messages.forEach(message => {
            const dt = new Date(message.timestamp || message.created_at);
            const dateKey = dt.toDateString();
            if (dateKey !== lastDateKey) {
                this.insertDateSeparator(dt);
                lastDateKey = dateKey;
                lastSenderKey = '';
            }
            this.displayMessage(message, false, lastSenderKey);
            lastSenderKey = this.getSenderKey(message);
        });
    }

    getSenderKey(message) {
        const senderName = message.isAnonymous ? 'Anonymous' : (message.sender?.username || 'Unknown');
        return (this.isOwnMessage(message) ? 'SELF' : senderName);
    }

    insertDateSeparator(dateObj) {
        const sep = document.createElement('div');
        sep.className = 'date-separator';
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        sep.textContent = `${month}/${day}/${year}`;
        this.messagesContainer.appendChild(sep);
    }

    displayMessage(message, animate = true, prevSenderKey = '') {
        const isOwn = this.isOwnMessage(message);
        const senderName = message.isAnonymous ? 'Anonymous' : (message.sender?.username || 'Unknown');
        const senderKey = isOwn ? 'SELF' : senderName;
        const sameChain = senderKey === prevSenderKey;
        const timeStr = this.formatTime(message.timestamp || message.created_at, true);

        // Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = `message ${isOwn ? 'sent' : 'received'}`;
        if (animate) wrapper.style.animation = 'fadeIn 0.25s ease';

        // Avatar (hidden for own messages or chained messages)
        const avatarWrap = document.createElement('div');
        avatarWrap.className = `avatar-wrapper ${ (isOwn || sameChain) ? 'hidden' : ''}`;
        if (!isOwn && !sameChain) {
            const img = document.createElement('img');
            img.alt = 'avatar';
            // simple deterministic placeholder color
            const hash = senderName.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
            const hue = hash % 360;
            img.src = `https://placehold.co/64x64/ffffff/222?text=${encodeURIComponent(senderName.charAt(0))}`;
            avatarWrap.appendChild(img);
        }
        wrapper.appendChild(avatarWrap);

        // Inner
        const inner = document.createElement('div');
        inner.className = 'message-inner';

        // Sender label when new chain and not self & not anonymous chain collapse requirement (always show for named user, hide for self)
        if (!isOwn && !sameChain) {
            const senderEl = document.createElement('div');
            senderEl.className = 'message-sender';
            senderEl.textContent = senderName;
            inner.appendChild(senderEl);
        }

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        const contentP = document.createElement('div');
        contentP.className = 'content-line';
        contentP.innerHTML = this.escapeHtml(message.content);
        bubble.appendChild(contentP);
        inner.appendChild(bubble);

        const meta = document.createElement('div');
        meta.className = 'message-time';
        meta.innerHTML = `${timeStr}${isOwn ? ' <i class="fas fa-check check-mark"></i>' : ''}`;
        inner.appendChild(meta);

        wrapper.appendChild(inner);
        this.messagesContainer.appendChild(wrapper);
        this.scrollToBottom();
    }

    isOwnMessage(message) {
        if (!this.currentUser) return false;
        
        if (this.isAnonymous && message.isAnonymous) {
            // For anonymous messages, we can't reliably determine ownership
            // In a real app, you'd need to track this differently
            return false;
        }
        
        return message.userId === this.currentUser.id || message.sender?.id === this.currentUser.id;
    }

    sendMessage() {
        const content = this.messageInput.value.trim();
        
        if (!content || !this.socket) return;

        // Create message data
        const messageData = {
            groupId: this.currentGroupId,
            userId: this.isAnonymous ? null : this.currentUser?.id,
            content: content,
            isAnonymous: this.isAnonymous,
            messageType: 'text'
        };

        // Send message
        this.socket.emit('send-message', messageData);

        // Clear input
        this.messageInput.value = '';
        this.validateInput();
        this.stopTyping();

        // Focus back to input
        this.focusInput();
    }

    handleTyping() {
        if (!this.isTyping && this.socket) {
            this.isTyping = true;
            this.socket.emit('typing', {
                groupId: this.currentGroupId,
                userId: this.currentUser?.id,
                isAnonymous: this.isAnonymous,
                isTyping: true
            });
        }

        // Clear existing timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        // Set new timeout
        this.typingTimeout = setTimeout(() => {
            this.stopTyping();
        }, 1000);
    }

    stopTyping() {
        if (this.isTyping && this.socket) {
            this.isTyping = false;
            this.socket.emit('typing', {
                groupId: this.currentGroupId,
                userId: this.currentUser?.id,
                isAnonymous: this.isAnonymous,
                isTyping: false
            });
        }

        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
    }

    handleUserTyping(data) {
        // You can implement typing indicator UI here
        // For now, we'll just log it
        console.log('User typing:', data);
    }

    validateInput() {
        const content = this.messageInput.value.trim();
        this.sendBtn.disabled = !content;
        
        if (content) {
            this.sendBtn.style.background = '#B22222';
        } else {
            this.sendBtn.style.background = '#2c2c2e';
        }
    }

    updateAnonymousIndicator() {
        if (this.isAnonymous) {
            this.anonymousIndicator.classList.remove('hidden');
        } else {
            this.anonymousIndicator.classList.add('hidden');
        }
        this.adjustBottomPadding();
        this.updateIndicatorLength();
    }

    handleAttachment() {
        // Placeholder for file attachment
        alert('File attachment feature coming soon!');
    }

    handleCamera() {
        // Placeholder for camera feature
        alert('Camera feature coming soon!');
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    adjustBottomPadding() {
        // Ensure the last message isn't hidden behind composer/indicator
        const composerH = this.composerWrapper ? this.composerWrapper.offsetHeight : 0;
    const indicatorVisible = this.anonymousIndicator && !this.anonymousIndicator.classList.contains('hidden');
        const indicatorH = indicatorVisible ? this.anonymousIndicator.offsetHeight : 0;
        const reserve = composerH + indicatorH + 12; // extra breathing room
        this.messagesContainer.style.paddingBottom = reserve + 'px';
    }

    updateIndicatorLength() {
        if (!this.indicatorEl) return;
        const span = this.indicatorEl.querySelector('span');
        if (!span) return;
        // heuristic: if width is tight, use short label
        const available = this.composerWrapper.clientWidth;
        span.textContent = this.indicatorEl.dataset.short || 'Anon ON';
    }

    focusInput() {
        setTimeout(() => {
            this.messageInput.focus();
        }, 100);
    }

    showLoading() {
        this.loadingScreen.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingScreen.classList.add('hidden');
    }

    showError(message) {
        // Simple error display - you can enhance this
        alert(`Error: ${message}`);
    }

    formatTime(timestamp, timeOnly = false) {
        const date = new Date(timestamp);
        const now = new Date();
        if (timeOnly || date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the chat app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new ChatApp();
    window.addEventListener('resize', () => {
        if (window.chatApp) {
            window.chatApp.updateIndicatorLength();
            window.chatApp.adjustBottomPadding();
        }
    });
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.chatApp && window.chatApp.socket) {
        window.chatApp.socket.disconnect();
    }
});