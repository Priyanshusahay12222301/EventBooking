const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const db = require('./config/database');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session configuration
const sessionStore = new MySQLStore({}, db);
app.use(session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Routes
app.use('/api/chat', chatRoutes);

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
            
            // Save message to database
            const [result] = await db.execute(
                'INSERT INTO messages (group_id, user_id, content, is_anonymous, message_type) VALUES (?, ?, ?, ?, ?)',
                [groupId, userId, content, isAnonymous, messageType]
            );

            // Get user info if not anonymous
            let senderInfo = { username: 'Anonymous', avatar: null };
            if (!isAnonymous && userId) {
                const [userRows] = await db.execute('SELECT username FROM users WHERE id = ?', [userId]);
                if (userRows.length > 0) {
                    senderInfo.username = userRows[0].username;
                }
            }

            const messageData = {
                id: result.insertId,
                groupId,
                userId: isAnonymous ? null : userId,
                content,
                isAnonymous,
                messageType,
                sender: senderInfo,
                timestamp: new Date(),
                isOwn: false
            };

            // Broadcast message to all users in the group
            io.to(`group_${groupId}`).emit('new-message', messageData);
            
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
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
    console.log(`Server running on port ${PORT}`);
});