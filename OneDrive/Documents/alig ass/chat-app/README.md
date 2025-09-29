# Fun Friday Group Chat 🎉

A real-time chat application with anonymous messaging capabilities, built with Node.js, Express, Socket.IO, and MySQL. The interface is designed to match modern mobile chat applications with a sleek dark theme.

![Chat Interface](https://via.placeholder.com/375x812/000000/ffffff?text=Chat+Interface)

## Features ✨

- **Real-time messaging** using Socket.IO
- **Anonymous chat mode** with toggle
- **Group chat functionality**
- **Mobile-responsive design** matching iOS-style interface
- **MySQL database** for persistent message storage
- **Session management** for user authentication
- **Typing indicators** (real-time feedback)
- **Message timestamps** with smart formatting
- **Dark theme UI** with modern styling

## Screenshots 📱

The application mimics the interface shown in your provided screenshot with:
- Dark theme with red message bubbles for sent messages
- Anonymous user indicators
- Group chat header with Fun Friday Group
- Mobile-optimized layout
- Real-time message delivery

## Tech Stack 🛠️

- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Database**: MySQL
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Session Management**: Express-session with MySQL store
- **Security**: bcryptjs for password hashing

## Prerequisites 📋

Before running this application, make sure you have:

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- MySQL (v8.0 or higher)
- A MySQL server running locally or remotely

## Installation & Setup 🚀

### 1. Clone or Download the Project

```bash
# If you have the project files, navigate to the chat-app directory
cd "c:\Users\priya\OneDrive\Documents\alig ass\chat-app"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

**Option A: Using MySQL Command Line**
```bash
# Connect to MySQL as root
mysql -u root -p

# Run the database setup script
source config/database.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open and execute the `config/database.sql` file

**Option C: Using npm script**
```bash
npm run setup-db
```

### 4. Environment Configuration

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit the `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=chat_app
PORT=3000
SESSION_SECRET=your-super-secret-session-key
```

### 5. Start the Application

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### 6. Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## Usage 💬

### Getting Started
1. The application automatically creates an anonymous session when you visit
2. You'll join the "Fun Friday Group" by default
3. Toggle between anonymous and identified messaging using the switch at the bottom

### Sending Messages
1. Type your message in the input field at the bottom
2. Press Enter or click the send button
3. Messages appear in real-time for all connected users

### Anonymous Mode
- **ON**: Your messages appear as "Anonymous"
- **OFF**: Your messages show your username (if authenticated)

### Features Available
- Real-time messaging
- Message history loading
- Typing indicators
- Responsive mobile design
- Anonymous/identified messaging toggle

## Project Structure 📁

```
chat-app/
├── config/
│   ├── database.js         # Database connection configuration
│   └── database.sql        # MySQL schema and sample data
├── public/
│   ├── css/
│   │   └── style.css       # Application styling
│   ├── js/
│   │   └── chat.js         # Client-side JavaScript
│   └── index.html          # Main HTML file
├── routes/
│   └── chat.js             # API routes for chat functionality
├── .env.example            # Environment variables template
├── package.json            # Node.js dependencies and scripts
├── server.js               # Main server file
└── README.md               # This file
```

## API Endpoints 🔌

### Chat Routes (`/api/chat`)
- `GET /groups/:groupId/messages` - Fetch group messages
- `GET /groups/:groupId` - Get group information
- `POST /groups/:groupId/join` - Join a group
- `POST /anonymous-login` - Create anonymous session
- `GET /me` - Get current user session

### Socket.IO Events
- `join-group` - Join a chat group
- `send-message` - Send a new message
- `new-message` - Receive new messages
- `typing` - Typing indicators
- `user-typing` - Receive typing status

## Database Schema 🗄️

### Tables
- **users**: User accounts and anonymous sessions
- **groups**: Chat groups/rooms
- **group_members**: Group membership relationships
- **messages**: Chat messages with anonymous support

## Customization 🎨

### Changing Colors
Edit `public/css/style.css`:
- Message bubbles: `.message.sent .message-bubble { background: #B22222; }`
- Accent color: `#007AFF` (used for buttons and toggles)
- Background: `#000` (main background)

### Adding Features
- File attachments: Extend the `handleAttachment()` function
- User authentication: Add login/register routes
- Multiple groups: Modify the group selection logic
- Emoji support: Enhance the message display function

## Troubleshooting 🔧

### Common Issues

**MySQL Connection Error**
- Verify MySQL server is running
- Check database credentials in `.env`
- Ensure the `chat_app` database exists

**Port Already in Use**
- Change the PORT in `.env` file
- Kill any processes using port 3000: `netstat -ano | findstr :3000`

**Messages Not Appearing**
- Check browser console for JavaScript errors
- Verify Socket.IO connection in Network tab
- Ensure database tables were created properly

**Styling Issues**
- Clear browser cache
- Check if CSS file is loading properly
- Verify file paths are correct

### Logging
The application logs important events to the console:
- User connections/disconnections
- Message sending/receiving
- Database errors
- Socket.IO events

## Development 👨‍💻

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restart on file changes.

### Code Structure
- **server.js**: Main Express server with Socket.IO setup
- **routes/chat.js**: RESTful API endpoints
- **public/js/chat.js**: Client-side chat functionality
- **public/css/style.css**: Responsive mobile-first styling

## Production Deployment 🌐

For production deployment:

1. Set production environment variables
2. Use a process manager like PM2
3. Set up a reverse proxy (nginx)
4. Configure SSL certificates
5. Use a production MySQL database

```bash
# Example with PM2
npm install -g pm2
pm2 start server.js --name chat-app
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Notes 🔒

- Change the SESSION_SECRET in production
- Use environment variables for sensitive data
- Implement rate limiting for production use
- Sanitize user input (basic HTML escaping is implemented)
- Use HTTPS in production

## License 📄

This project is licensed under the MIT License - see the package.json file for details.

## Support 💪

If you encounter any issues:
1. Check the troubleshooting section
2. Review the browser console for errors
3. Verify database connection and setup
4. Ensure all dependencies are installed correctly

---

**Enjoy your Fun Friday Group Chat! 🎉**