const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// In-memory storage for demo purposes
const messages = [];
const users = new Map();
const groups = new Map();

// Initialize sample data
groups.set(1, {
    id: 1,
    name: 'Fun Friday Group',
    description: 'Weekly fun group chat',
    isAnonymous: true
});

// Sample messages to match your screenshot
// Use a fixed historical date to ensure a single date separator appears (e.g. 8/20/2020)
messages.push(
    { id: 1, groupId: 1, content: 'Someone order Bornvital!', isAnonymous: true, timestamp: new Date('2020-08-20T11:35:00'), sender: { username: 'Anonymous' } },
    { id: 2, groupId: 1, content: 'hahahahah!!', isAnonymous: true, timestamp: new Date('2020-08-20T11:38:00'), sender: { username: 'Anonymous' } },
    { id: 3, groupId: 1, content: 'I\'m Excited For this Event! Ho-Ho', isAnonymous: true, timestamp: new Date('2020-08-20T11:56:00'), sender: { username: 'Anonymous' } },
    { id: 4, groupId: 1, content: 'Hi Guysss 👋', isAnonymous: false, timestamp: new Date('2020-08-20T12:31:00'), sender: { username: 'Abhay Shukla' } },
    { id: 5, groupId: 1, content: 'Hello!', isAnonymous: true, timestamp: new Date('2020-08-20T12:35:00'), sender: { username: 'Anonymous' } },
    { id: 6, groupId: 1, content: 'Yessss!!!!!!', isAnonymous: true, timestamp: new Date('2020-08-20T12:42:00'), sender: { username: 'Anonymous' } },
    { id: 7, groupId: 1, content: 'Maybe I am not attending this event!', isAnonymous: false, timestamp: new Date('2020-08-20T13:36:00'), sender: { username: 'You' } },
    { id: 8, groupId: 1, content: 'We have Surprise For you!!', isAnonymous: false, timestamp: new Date('2020-08-20T13:50:00'), sender: { username: 'Abhay Shukla' } }
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Simple session configuration (in-memory)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// API Routes
app.get('/api/chat/groups/:groupId/messages', (req, res) => {
    try {
        const { groupId } = req.params;
        const groupMessages = messages
            .filter(msg => msg.groupId === parseInt(groupId))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        res.json(groupMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.get('/api/chat/groups/:groupId', (req, res) => {
    try {
        const { groupId } = req.params;
        const group = groups.get(parseInt(groupId));
        
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        
        res.json({ ...group, member_count: 5 });
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ error: 'Failed to fetch group' });
    }
});

app.post('/api/chat/groups/:groupId/join', (req, res) => {
    try {
        const { groupId } = req.params;
        const { isAnonymous = true } = req.body;

        res.json({ 
            success: true, 
            message: 'Joined group successfully',
            groupId: parseInt(groupId),
            isAnonymous 
        });
    } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).json({ error: 'Failed to join group' });
    }
});

app.post('/api/chat/anonymous-login', (req, res) => {
    try {
        const anonymousId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        req.session.user = {
            id: anonymousId,
            username: 'Anonymous',
            isAnonymous: true
        };

        res.json({
            success: true,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error creating anonymous session:', error);
        res.status(500).json({ error: 'Failed to create anonymous session' });
    }
});

app.get('/api/chat/me', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a group
    socket.on('join-group', async (data) => {
        const { groupId, userId, isAnonymous } = data;
        socket.join(`group_${groupId}`);
        
        console.log(`User ${socket.id} joined group ${groupId} (anonymous: ${isAnonymous})`);
        
        // Notify others in the group
        socket.to(`group_${groupId}`).emit('user-joined', {
            message: isAnonymous ? 'Someone joined the group' : `User joined the group`,
            timestamp: new Date()
        });
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
        try {
            const { groupId, userId, content, isAnonymous, messageType = 'text' } = data;
            
            console.log('Received message:', { groupId, userId, content, isAnonymous });
            
            // Create new message
            const newMessage = {
                id: messages.length + 1,
                groupId: parseInt(groupId),
                userId: isAnonymous ? null : userId,
                content,
                isAnonymous,
                messageType,
                timestamp: new Date(),
                sender: {
                    username: isAnonymous ? 'Anonymous' : 'User'
                }
            };

            // Store message in memory
            messages.push(newMessage);

            console.log('Broadcasting message to group:', `group_${groupId}`);
            
            // Broadcast message to all users in the group
            io.to(`group_${groupId}`).emit('new-message', {
                ...newMessage,
                isOwn: false // The sender will handle their own message display
            });
            
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
        console.log('Typing event:', data);
        socket.to(`group_${data.groupId}`).emit('user-typing', {
            userId: data.userId,
            isAnonymous: data.isAnonymous,
            isTyping: data.isTyping
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to view the chat app`);
    console.log(`💬 Chat functionality: ✅ Ready (In-memory storage)`);
});