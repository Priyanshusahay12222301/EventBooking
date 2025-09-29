const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get group messages
router.get('/groups/:groupId/messages', async (req, res) => {
    try {
        const { groupId } = req.params;
        const { limit = 50, offset = 0 } = req.query;

        const [messages] = await db.execute(`
            SELECT 
                m.id,
                m.content,
                m.message_type,
                m.is_anonymous,
                m.created_at,
                u.username,
                u.id as user_id
            FROM messages m
            LEFT JOIN users u ON m.user_id = u.id
            WHERE m.group_id = ?
            ORDER BY m.created_at ASC
            LIMIT ? OFFSET ?
        `, [groupId, parseInt(limit), parseInt(offset)]);

        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            messageType: msg.message_type,
            isAnonymous: msg.is_anonymous,
            timestamp: msg.created_at,
            sender: {
                id: msg.is_anonymous ? null : msg.user_id,
                username: msg.is_anonymous ? 'Anonymous' : msg.username
            }
        }));

        res.json(formattedMessages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Get group info
router.get('/groups/:groupId', async (req, res) => {
    try {
        const { groupId } = req.params;

        const [groups] = await db.execute(`
            SELECT 
                g.id,
                g.name,
                g.description,
                g.is_anonymous,
                g.created_at,
                COUNT(gm.user_id) as member_count
            FROM groups g
            LEFT JOIN group_members gm ON g.id = gm.group_id
            WHERE g.id = ?
            GROUP BY g.id
        `, [groupId]);

        if (groups.length === 0) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.json(groups[0]);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ error: 'Failed to fetch group' });
    }
});

// Join group (for anonymous users)
router.post('/groups/:groupId/join', async (req, res) => {
    try {
        const { groupId } = req.params;
        const { isAnonymous = true } = req.body;

        // For anonymous users, we don't need to add them to group_members table
        // They can just connect via socket.io
        
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

// Create anonymous user session
router.post('/anonymous-login', async (req, res) => {
    try {
        // Create a temporary anonymous user session
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

// Get current user session
router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

module.exports = router;