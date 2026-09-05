# SyncTube – YouTube Watch Party

SyncTube is a real-time YouTube Watch Party application that allows multiple users to watch and interact with the same YouTube video in a shared room.

## Live Demo

* **Frontend:** https://synctube-watchparty.netlify.app
* **Backend:** https://synctube-backend-von4.onrender.com
* **GitHub:** https://github.com/bhawnasingh89/SyncTube

## Architecture

```text
React + Vite (Netlify)
        │
        │ Socket.IO / WebSocket
        ▼
Node.js + Express + Socket.IO (Render)
        │
        ▼
RoomManager
        │
        ▼
MongoDB Atlas
```

The frontend communicates with the backend using Socket.IO for real-time updates. The backend manages rooms, participants, roles, and playback state. When the Host or Moderator performs a playback action, the backend validates the user's permissions and broadcasts the updated state to all participants in the room.

The YouTube IFrame API is used to embed and control the YouTube player.

## Key Features

* Create and join watch party rooms
* Real-time YouTube playback synchronization
* Play, pause, and seek synchronization
* Synchronized video changes
* Host, Moderator, and Participant roles
* Host can assign Moderator role
* Host can remove participants
* Backend-side permission validation
* Real-time participant updates
* Real-time room chat

## Tech Stack

**Frontend:** React, Vite, JavaScript, Socket.IO Client, React YouTube

**Backend:** Node.js, Express.js, Socket.IO, MongoDB, Mongoose

**Deployment:** Netlify, Render, MongoDB Atlas

## Project Structure

```text
SyncTube/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── services/
│   │   └── socket/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── socket/
│   │   └── utils/
│   └── package.json
│
└── README.md
```

## Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create the required `.env` files with your MongoDB connection string and frontend/backend URLs. **Do not commit `.env` files or secrets to GitHub.**
