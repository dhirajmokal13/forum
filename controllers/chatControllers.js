const MAX_MESSAGE_LENGTH = 500;
const MIN_MESSAGE_INTERVAL_MS = 500;
const HISTORY_LIMIT = 50;

const sanitizeText = (value = "") => {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const normalizeRoomType = (value = "") => {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
};

const parseRoomFromReferer = (referer) => {
    if (!referer) return "";
    try {
        const pathname = new URL(referer).pathname || "";
        const [, root, roomtype] = pathname.split("/");
        if (root === "chatroom") return normalizeRoomType(roomtype);
    } catch (_) {
        return "";
    }
    return "";
};

export const chatCode = io => {
    const activeUsers = new Map();
    const roomHistory = new Map();
    const roomTypingUsers = new Map();

    const getRoomUsersCount = (roomType) => activeUsers.get(roomType) || 0;
    const emitActiveUsers = (roomName, roomType) => {
        const count = getRoomUsersCount(roomType);
        io.sockets.in(roomName).emit("chat:presence", { roomType, activeUsers: count });
        return count;
    };

    io.on("connection", (socket) => {
        const auth = socket.handshake.auth || {};
        const query = socket.handshake.query || {};

        const roomType = normalizeRoomType(auth.roomType || query.roomType || parseRoomFromReferer(socket.handshake.headers.referer));
        const userNameRaw = String(auth.uname || query.uname || "Anonymous");
        const uname = sanitizeText(userNameRaw.trim()).slice(0, 50) || `Guest-${socket.id.slice(0, 5)}`;

        if (!roomType) {
            socket.emit("chat:error", { message: "Invalid room." });
            socket.disconnect(true);
            return;
        }

        const roomName = `chatroom-${roomType}`;
        socket.data.roomType = roomType;
        socket.data.roomName = roomName;
        socket.data.uname = uname;
        socket.data.lastMessageAt = 0;

        socket.join(roomName);

        activeUsers.set(roomType, getRoomUsersCount(roomType) + 1);
        const updatedUsersOnConnect = emitActiveUsers(roomName, roomType);

        const existingHistory = roomHistory.get(roomType) || [];
        socket.emit("chat:history", existingHistory);

        io.sockets.in(roomName).emit("userConnected", {
            uname,
            roomType,
            activeUsers: updatedUsersOnConnect,
        });

        socket.on("sendMsg", (payload, ack) => {
            const now = Date.now();
            if (now - socket.data.lastMessageAt < MIN_MESSAGE_INTERVAL_MS) {
                if (typeof ack === "function") ack({ ok: false, message: "You are sending messages too fast." });
                return;
            }

            const rawMessage = typeof payload?.Msg === "string" ? payload.Msg : "";
            const message = sanitizeText(rawMessage.trim());

            if (!message.length) {
                if (typeof ack === "function") ack({ ok: false, message: "Message cannot be empty." });
                return;
            }

            if (message.length > MAX_MESSAGE_LENGTH) {
                if (typeof ack === "function") ack({ ok: false, message: `Message must be <= ${MAX_MESSAGE_LENGTH} characters.` });
                return;
            }

            socket.data.lastMessageAt = now;

            const chatPayload = {
                id: `${socket.id}-${now}`,
                Msg: message,
                PostedBy: socket.data.uname,
                roomType: socket.data.roomType,
                time: new Date(now).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
                createdAt: now,
            };

            const roomMessages = roomHistory.get(socket.data.roomType) || [];
            roomMessages.push(chatPayload);
            if (roomMessages.length > HISTORY_LIMIT) {
                roomMessages.shift();
            }
            roomHistory.set(socket.data.roomType, roomMessages);

            io.sockets.in(socket.data.roomName).emit("userData", chatPayload);
            io.sockets.in(socket.data.roomName).emit("chat:message", chatPayload);
            io.sockets.in(socket.data.roomName).emit("typing:stop", { uname: socket.data.uname });

            if (typeof ack === "function") ack({ ok: true });
        });

        socket.on("typing:start", () => {
            const roomTypeFromSocket = socket.data.roomType;
            const typingUsers = roomTypingUsers.get(roomTypeFromSocket) || new Set();
            typingUsers.add(socket.data.uname);
            roomTypingUsers.set(roomTypeFromSocket, typingUsers);
            socket.to(socket.data.roomName).emit("typing:start", { uname: socket.data.uname });
        });

        socket.on("typing:stop", () => {
            const roomTypeFromSocket = socket.data.roomType;
            const typingUsers = roomTypingUsers.get(roomTypeFromSocket) || new Set();
            typingUsers.delete(socket.data.uname);
            if (typingUsers.size === 0) {
                roomTypingUsers.delete(roomTypeFromSocket);
            } else {
                roomTypingUsers.set(roomTypeFromSocket, typingUsers);
            }
            socket.to(socket.data.roomName).emit("typing:stop", { uname: socket.data.uname });
        });

        socket.on("disconnect", () => {
            const roomTypeFromSocket = socket.data.roomType;
            const currentUsers = getRoomUsersCount(roomTypeFromSocket);
            const nextUsers = Math.max(currentUsers - 1, 0);

            if (nextUsers === 0) {
                activeUsers.delete(roomTypeFromSocket);
                roomTypingUsers.delete(roomTypeFromSocket);
            } else {
                activeUsers.set(roomTypeFromSocket, nextUsers);
                const typingUsers = roomTypingUsers.get(roomTypeFromSocket);
                if (typingUsers) {
                    typingUsers.delete(socket.data.uname);
                    if (typingUsers.size === 0) roomTypingUsers.delete(roomTypeFromSocket);
                }
            }

            const updatedUsersOnDisconnect = emitActiveUsers(socket.data.roomName, roomTypeFromSocket);
            io.sockets.in(socket.data.roomName).emit("typing:stop", { uname: socket.data.uname });
            io.sockets.in(socket.data.roomName).emit("userDisconnected", {
                uname: socket.data.uname,
                roomType: roomTypeFromSocket,
                activeUsers: updatedUsersOnDisconnect,
            });
        });
    });
};