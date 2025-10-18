import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = "http://192.168.1.37";
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on('join-room', (room) => {
            console.log(`User joined room: ${room}`);
            socket.join(room);
        });

        socket.on("message", ({ roomId, msg }) => {
        console.log(`Message to room ${roomId}:`, msg);
            // Broadcast the message to all connected clients in the same room
            socket.broadcast.to(roomId).emit("message", msg);
        });

        socket.on("new-measure", ({roomId, measure}) => {
            console.log(`New measure in room ${roomId}:`, measure);
            socket.broadcast.to(roomId).emit("new-measure", measure);
        });
        socket.on("disconnect", () => {
            console.log("A user disconnected");            
        });
    });

    httpServer.once("error", (err) => {
        console.error("Server error:", err);
        process.exit(1);
    }).listen(port, () => {
        console.log(`Server is running on ${hostname}:${port}`);
    });

    });