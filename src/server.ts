import http from 'http';
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';

import env from '@/config/env';
import { setIO } from '@/config/socket';
import reservationRoutes from '@/interfaces/http/routes/reservation.routes';
import roomRoutes from '@/interfaces/http/routes/room.routes';
import authRoutes from '@/interfaces/http/routes/auth.routes';
import roleRoutes from '@/interfaces/http/routes/role.routes';
import permissionRoutes from '@/interfaces/http/routes/permission.routes';
import userRoutes from '@/interfaces/http/routes/user.routes';
import { SocketIOHandler } from '@/interfaces/ws/SocketIOHandler';

// import './jobs/waitlistJob';

const app = express();
const server = http.createServer(app);

// ─── Socket.io ───────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
});
setIO(io);
SocketIOHandler.init(io);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(cookieParser());

app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Static files (local storage) ────────────────────────────────────────────
if (env.STORAGE_DRIVER === 'local') {
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
}

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/rooms', roomRoutes);



// ─── Start ───────────────────────────────────────────────────────────────────
server.listen(env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${env.PORT} [${env.NODE_ENV}]`);
});

export { app, server };
