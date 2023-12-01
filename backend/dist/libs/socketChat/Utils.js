"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectAllClients = exports.sendToAllExcept = exports.sendToUser = exports.sendToAllClientsInRoom = exports.sendToAllConnectedClients = exports._sendToSelf = exports.sendToSelf = exports.sortByKeys = void 0;
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const lodash_1 = require("lodash");
const sortByKeys = (obj) => {
    const keys = Object.keys(obj);
    const sortedKeys = (0, lodash_1.sortBy)(keys);
    return (0, lodash_1.fromPairs)((0, lodash_1.map)(sortedKeys, key => {
        return [key, obj[key]];
    }));
};
exports.sortByKeys = sortByKeys;
const sendToSelf = (socket, method, data = {}) => {
    socket.emit(method, data);
};
exports.sendToSelf = sendToSelf;
const _sendToSelf = (io, socketId, method, data) => {
    (0, lodash_1.each)(io.sockets.sockets, socket => {
        if (socket.id === socketId) {
            socket.emit(method, data);
        }
    });
};
exports._sendToSelf = _sendToSelf;
const sendToAllConnectedClients = (socket, method, data) => {
    socket.emit(method, data);
};
exports.sendToAllConnectedClients = sendToAllConnectedClients;
const sendToAllClientsInRoom = (io, room, method, data) => {
    io.sockets.in(room).emit(method, data);
};
exports.sendToAllClientsInRoom = sendToAllClientsInRoom;
const sendToUser = (socketList, userList, username, method, data) => {
    let userOnline = null;
    (0, lodash_1.forEach)(userList, (v, k) => {
        if (k.toLowerCase() === username.toLowerCase()) {
            userOnline = v;
            return true;
        }
    });
    if ((0, lodash_1.isNull)(userOnline))
        return true;
    (0, lodash_1.forEach)(userOnline === null || userOnline === void 0 ? void 0 : userOnline.sockets, socket => {
        const o = (0, lodash_1.findKey)(socketList, { id: socket });
        if (o) {
            const i = o ? socketList[o] : null;
            if ((0, lodash_1.isUndefined)(i))
                return true;
            i.emit(method, data);
        }
    });
};
exports.sendToUser = sendToUser;
const sendToAllExcept = (io, exceptSocketId, method, data) => {
    (0, lodash_1.each)(io.sockets.sockets, socket => {
        if (socket.id !== exceptSocketId) {
            socket.emit(method, data);
        }
    });
};
exports.sendToAllExcept = sendToAllExcept;
const disconnectAllClients = (io) => {
    Object.keys(io.sockets.sockets).forEach(sock => {
        io.sockets.sockets[sock].disconnect(true);
    });
};
exports.disconnectAllClients = disconnectAllClients;
//# sourceMappingURL=Utils.js.map