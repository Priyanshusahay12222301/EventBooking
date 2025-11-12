# 🚀 Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Priyanshusahay12222301/EventBooking)

## Manual Deployment Steps

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

## Environment Variables (Required)

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-refresh-token-secret-different-from-jwt-secret
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Project Structure for Vercel

```
├── api/
│   └── index.js          # Serverless function entry point
├── backend/              # Backend source code
├── frontend/             # React frontend
└── vercel.json          # Vercel configuration
```

## Features Included

✅ **Security**
- Input validation & sanitization
- Rate limiting (100 req/15min)
- CORS protection
- Security headers (Helmet)
- NoSQL injection prevention

✅ **Performance**
- Serverless architecture
- CDN distribution
- Automatic HTTPS

✅ **Monitoring**
- Health check endpoint: `/api/health`
- Error logging
- Request monitoring

## Post-Deployment

1. **Update CORS**: Set `FRONTEND_URL` to your Vercel domain
2. **Test API**: Visit `https://your-app.vercel.app/api/health`
3. **Monitor**: Check Vercel Functions tab for logs

## Local Development

```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Project Repository](https://github.com/Priyanshusahay12222301/EventBooking)