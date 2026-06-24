import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import dotenv from 'dotenv';
import researchRoute from './routes/research.route.js';
import { setupSocket } from './socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use('/api/research', researchRoute);

setupSocket(io);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AlphaLens Backend' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`AlphaLens backend listening on port ${PORT}`);
});
