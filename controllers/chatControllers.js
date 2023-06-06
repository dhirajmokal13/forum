export const chatCode = io => {
    //let uname = {};
    const activeUsers = { 'programming': 0, 'cooking': 0, 'science-and-tech': 0, 'Politics': 0, 'Automobiles': 0 };
    io.on('connection', (socket) => {
        const roomType = new URL(socket.handshake.headers.referer).pathname.split('/')[2];
        activeUsers[roomType]++;
        //uname = {...uname, [socket.id] : socket.handshake.query.uname }
        socket.join(`chatroom-${roomType}`)
        io.sockets.in(`chatroom-${roomType}`).emit('userConnected', { uname: socket.handshake.query.uname, roomType, activeUsers: activeUsers[roomType] });
        socket.on('sendMsg', (data) => {
            io.sockets.in(`chatroom-${roomType}`).emit('userData', data);
        });
        //socket.broadcast.emit('userConnected', `You are connected ${roomType}`)
        socket.on('disconnect', () => {
            activeUsers[roomType]--;
            io.sockets.in(`chatroom-${roomType}`).emit('userDisconnected', { uname: socket.handshake.query.uname, roomType, activeUsers: activeUsers[roomType] });
        })
    })
}