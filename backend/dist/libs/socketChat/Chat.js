"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const Utils_1 = require("./Utils");
const Index_1 = require("./Index");
const User_1 = __importDefault(require("../../models/User"));
const logger_1 = require("../../utils/logger");
const events = {};
const JoinChatServer = (socket) => {
    const { user } = socket.handshake.auth;
    logger_1.logger.info(`joinChatServer USER ${user.name}`);
    const { tenantId } = user;
    const socketDataTenant = `socketData_${tenantId}`;
    let dataTenant;
    // dataTenant = await getValue(socketDataTenant);
    dataTenant = Index_1.shared[socketDataTenant];
    if (dataTenant) {
        dataTenant.usersOnline[user.id] = {
            sockets: [socket.id],
            user
        };
        dataTenant.sockets.push(socket);
        (0, Utils_1.sendToSelf)(socket, "joinSuccessfully");
    }
    if (!dataTenant) {
        Index_1.shared[socketDataTenant] = {
            sockets: [],
            usersOnline: {},
            idleUsers: {}
        };
        dataTenant = Index_1.shared[socketDataTenant];
        dataTenant.usersOnline[user.id] = {
            sockets: [socket.id],
            user
        };
        dataTenant.sockets.push(socket);
        (0, Utils_1.sendToSelf)(socket, `${user.tenantId}:joinSuccessfully`);
    }
};
const UpdateUsers = (socket) => {
    const { user } = socket.handshake.auth;
    const socketDataTenant = `socketData_${user.tenantId}`;
    const dataTenant = Index_1.shared[socketDataTenant];
    const sortedUserList = (0, Utils_1.sortByKeys)(dataTenant.usersOnline);
    (0, lodash_1.forEach)(sortedUserList, v => {
        const userValue = v.user;
        const { sockets } = v;
        if (userValue && sockets.length > 0) {
            (0, lodash_1.forEach)(sockets, sock => {
                const socketFind = (0, lodash_1.find)(dataTenant.sockets, s => {
                    return s.id === sock;
                });
                if (socketFind) {
                    if (userValue.role.isAdmin || userValue.role.isAgent) {
                        socketFind.emit("updateUsers", sortedUserList);
                    }
                    // else {
                    //   const groupSchema = require("../models/group");
                    //   groupSchema.getAllGroupsOfUser(user._id, function (err, groups) {
                    //     if (!err) {
                    //       let usersOfGroups = _.map(groups, function (g) {
                    //         return _.map(g.members, function (m) {
                    //           return { user: m };
                    //         });
                    //       });
                    //       const agentsAndAdmins = chain(sortedUserList)
                    //         .filter(function (u) {
                    //           return u.user.role.isAdmin || u.user.role.isAgent;
                    //         })
                    //         .map(function (u) {
                    //           return u;
                    //         })
                    //         .value();
                    //       usersOfGroups = concat(usersOfGroups, agentsAndAdmins);
                    //       let onlineUsernames = map(sortedUserList, function (u) {
                    //         return u.user.username;
                    //       });
                    //       onlineUsernames = flattenDeep(onlineUsernames);
                    //       const sortedUsernames = chain(usersOfGroups)
                    //         .flattenDeep()
                    //         .map(function (u) {
                    //           return u.user.username;
                    //         })
                    //         .value();
                    //       const actual = intersection(onlineUsernames, sortedUsernames);
                    //       usersOfGroups = chain(usersOfGroups)
                    //         .flattenDeep()
                    //         .filter(function (i) {
                    //           return actual.indexOf(i.user.username) !== -1;
                    //         })
                    //         .uniqBy(function (i) {
                    //           return i.user._id;
                    //         })
                    //         .value();
                    //       const sortedKeys = map(usersOfGroups, function (m) {
                    //         return m.user.username;
                    //       });
                    //       const obj = zipObject(sortedKeys, usersOfGroups);
                    //       socket.emit("updateUsers", obj);
                    //     }
                    //   });
                    // }
                }
            });
        }
    });
    // utils.sendToAllConnectedClients(io, 'updateUsers', sortedUserList)
};
const UpdateOnlineBubbles = (socket) => {
    const { user } = socket.handshake.auth;
    const socketDataTenant = `socketData_${user.tenantId}`;
    const dataTenant = Index_1.shared[socketDataTenant];
    const sortedUserList = (0, lodash_1.fromPairs)((0, lodash_1.sortBy)((0, lodash_1.toPairs)(dataTenant.usersOnline), o => {
        return o[0];
    }));
    const sortedIdleList = (0, lodash_1.fromPairs)((0, lodash_1.sortBy)((0, lodash_1.toPairs)(dataTenant.idleUsers), o => {
        return o[0];
    }));
    (0, Utils_1.sendToAllConnectedClients)(socket, `${user.tenantId}:chat:updateOnlineBubbles`, {
        sortedUserList,
        sortedIdleList
    });
};
const SpawnOpenChatWindows = (socket) => {
    const { user } = socket.handshake.auth;
    const userSchema = User_1.default.findByPk(user.id);
    // const conversationSchema = require("../models/chat/conversation");
    // buscar e devolver a conversa
    (0, Utils_1.sendToSelf)(socket, "spawnChatWindow", userSchema);
};
const spawnChatWindow = (socket) => {
    socket.on("spawnChatWindow", (userId) => __awaiter(void 0, void 0, void 0, function* () {
        // Get user
        const user = yield User_1.default.findByPk(userId, {
            attributes: ["id", "name", "email", "profile"]
        });
        (0, Utils_1.sendToSelf)(socket, "spawnChatWindow", user);
    }));
};
const onSetUserIdle = (socket) => {
    const { user } = socket.handshake.auth;
    const socketDataTenant = `socketData_${user.tenantId}`;
    socket.on(`${user.tenantId}:setUserIdle`, () => {
        let dataTenant;
        dataTenant = Index_1.shared[socketDataTenant];
        if (dataTenant) {
            dataTenant.idleUsers[user.id] = {
                sockets: [socket.id],
                user
            };
        }
        if (!dataTenant) {
            Index_1.shared[socketDataTenant] = {
                sockets: [],
                usersOnline: {},
                idleUsers: {}
            };
            dataTenant = Index_1.shared[socketDataTenant];
            dataTenant.idleUsers.push(socket.id);
        }
        if (dataTenant === null || dataTenant === void 0 ? void 0 : dataTenant.usersOnline[user.id]) {
            dataTenant === null || dataTenant === void 0 ? true : delete dataTenant.usersOnline[user.id];
        }
        UpdateOnlineBubbles(socket);
    });
};
const onSetUserActive = (socket) => {
    const { user } = socket.handshake.auth;
    const socketDataTenant = `socketData_${user.tenantId}`;
    socket.on(`${user.tenantId}:setUserActive`, () => {
        let dataTenant = Index_1.shared[socketDataTenant];
        if (dataTenant === null || dataTenant === void 0 ? void 0 : dataTenant.idleUsers[user.id]) {
            dataTenant === null || dataTenant === void 0 ? true : delete dataTenant.idleUsers[user.id];
        }
        if (!dataTenant) {
            Index_1.shared[socketDataTenant] = {
                sockets: [],
                usersOnline: {},
                idleUsers: {}
            };
            dataTenant = Index_1.shared[socketDataTenant];
            dataTenant.usersOnline.push(socket.id);
        }
        if (dataTenant === null || dataTenant === void 0 ? void 0 : dataTenant.usersOnline) {
            dataTenant.usersOnline[user.id] = {
                sockets: [socket.id],
                user
            };
        }
        UpdateOnlineBubbles(socket);
    });
};
const onUpdateUsers = (socket) => {
    socket.on("updateUsers", UpdateUsers);
};
const onChatMessage = (socket) => {
    const { user } = socket.handshake.auth;
    const { tenantId } = user;
    const socketDataTenant = `socketData_${tenantId}`;
    socket.on("chatMessage", function (data) {
        const dataTenant = Index_1.shared[socketDataTenant];
        if (dataTenant) {
            const { to } = data;
            const { from } = data;
            console.log("TO", to);
            console.log("FROM", from);
            const od = data.type;
            if (data.type === "s") {
                data.type = "r";
            }
            else {
                data.type = "s";
            }
            // buscar o usuario para chat (to)
            // Buscar o usuario de (from)
            // se error
            // // return utils.sendToSelf(socket, "chatMessage", { message: err });
            (0, Utils_1.sendToUser)(dataTenant.sockets, dataTenant.usersOnline, data.toUser.username, "chatMessage", data);
            data.type = od;
            (0, Utils_1.sendToUser)(dataTenant.sockets, dataTenant.usersOnline, data.fromUser.username, "chatMessage", data);
        }
    });
};
const onChatTyping = (socket) => {
    const { user } = socket.handshake.auth;
    const { tenantId } = user;
    const socketDataTenant = `socketData_${tenantId}`;
    socket.on("chatTyping", data => {
        const dataTenant = Index_1.shared[socketDataTenant];
        if (dataTenant) {
            const { to } = data;
            const { from } = data;
            let toUser = null;
            let fromUser = null;
            (0, lodash_1.find)(dataTenant.usersOnline, function (v) {
                if (String(v.user.id) === String(to)) {
                    toUser = v.user;
                }
                if (String(v.user.id) === String(from)) {
                    fromUser = v.user;
                }
            });
            if ((0, lodash_1.isNull)(toUser) || (0, lodash_1.isNull)(fromUser)) {
                return;
            }
            data.toUser = toUser;
            data.fromUser = fromUser;
            (0, Utils_1.sendToUser)(dataTenant.sockets, dataTenant.usersOnline, toUser.name, "chatTyping", data);
        }
    });
};
const onChatStopTyping = (socket) => {
    const { user } = socket.handshake.auth;
    const { tenantId } = user;
    const socketDataTenant = `socketData_${tenantId}`;
    socket.on("chatStopTyping", data => {
        const dataTenant = Index_1.shared[socketDataTenant];
        if (dataTenant) {
            const { to } = data;
            let toUser = null;
            (0, lodash_1.find)(dataTenant.usersOnline, v => {
                if (String(v.user.id) === String(to)) {
                    toUser = v.user;
                }
            });
            if ((0, lodash_1.isNull)(toUser)) {
                return;
            }
            data.toUser = toUser;
            (0, Utils_1.sendToUser)(dataTenant.sockets, dataTenant.usersOnline, toUser.name, "chatStopTyping", data);
        }
    });
};
const saveChatWindow = (socket) => {
    socket.on("saveChatWindow", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = data;
        // const { convoId } = data;
        const { remove } = data;
        const userSchema = yield User_1.default.findByPk(userId);
        if (userSchema) {
            if (remove) {
                // remover o chat do usuário
                // user.removeOpenChatWindow(convoId)
            }
            else {
                // adiciona o chat ao usuario
                // user.addOpenChatWindow(convoId)
            }
        }
    }));
};
const onDisconnect = (socket) => {
    socket.on("disconnect", (reason) => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = socket.handshake.auth;
        const { tenantId } = user;
        const socketDataTenant = `socketData_${tenantId}`;
        const dataTenant = Index_1.shared[socketDataTenant];
        if (dataTenant === null || dataTenant === void 0 ? void 0 : dataTenant.usersOnline) {
            if (dataTenant.usersOnline[user.id]) {
                const userSockets = dataTenant.usersOnline[user.id].sockets;
                if ((0, lodash_1.size)(userSockets) < 2) {
                    delete dataTenant.usersOnline[user.id];
                }
                else {
                    dataTenant.usersOnline[user.id].sockets = (0, lodash_1.without)(userSockets, socket.id);
                }
            }
            const o = (0, lodash_1.findKey)(dataTenant.sockets, { id: socket.id });
            dataTenant.sockets = (0, lodash_1.without)(dataTenant.sockets, o);
        }
        if (dataTenant === null || dataTenant === void 0 ? void 0 : dataTenant.idleUsers) {
            if (dataTenant.idleUsers[user.id]) {
                const idleSockets = dataTenant.idleUsers[user.id].sockets;
                if ((0, lodash_1.size)(idleSockets) < 2) {
                    delete dataTenant.idleUsers[user.id];
                }
                else {
                    dataTenant.idleUsers[user.id].sockets = (0, lodash_1.without)(idleSockets, socket.id);
                }
            }
            const i = (0, lodash_1.findKey)(dataTenant.sockets, { id: socket.id });
            dataTenant.sockets = (0, lodash_1.without)(dataTenant.sockets, i);
        }
        // Save lastOnline Time
        const instance = yield User_1.default.findByPk(user.id);
        instance === null || instance === void 0 ? void 0 : instance.update({ status: "offline", lastOnline: new Date() });
        UpdateOnlineBubbles(socket);
        if (reason === "transport error") {
            reason = "client terminated";
        }
        logger_1.logger.debug(`User disconnected (${reason}): ${user.name} - ${socket.id}`);
    }));
};
events.onSetUserIdle = onSetUserIdle;
events.onSetUserActive = onSetUserActive;
events.onUpdateUsers = onUpdateUsers;
events.spawnChatWindow = spawnChatWindow;
events.onChatMessage = onChatMessage;
events.onChatTyping = onChatTyping;
events.onChatStopTyping = onChatStopTyping;
events.saveChatWindow = saveChatWindow;
events.onDisconnect = onDisconnect;
events.updateOnlineBubbles = (socket) => {
    const { user } = socket.handshake.auth;
    socket.on(`${user.tenantId}:chat:updateOnlineBubbles`, () => {
        UpdateOnlineBubbles(user.tenantId);
    });
};
events.getOpenChatWindows = (socket) => {
    socket.on("getOpenChatWindows", () => {
        SpawnOpenChatWindows(socket);
    });
};
function register(socket) {
    var _a, _b;
    if (!((_b = (_a = socket.handshake) === null || _a === void 0 ? void 0 : _a.auth) === null || _b === void 0 ? void 0 : _b.tenantId)) {
        return;
    }
    events.onSetUserIdle(socket);
    events.onSetUserActive(socket);
    events.onUpdateUsers(socket);
    events.updateOnlineBubbles(socket);
    // events.updateConversationsNotifications(socket);
    events.spawnChatWindow(socket);
    events.getOpenChatWindows(socket);
    events.onChatMessage(socket);
    events.onChatTyping(socket);
    events.onChatStopTyping(socket);
    events.saveChatWindow(socket);
    events.onDisconnect(socket);
    if (socket.handshake.auth.user.id) {
        JoinChatServer(socket);
    }
}
const eventLoop = (socket) => {
    UpdateUsers(socket);
    UpdateOnlineBubbles(socket);
    // updateConversationsNotifications()
};
const chat = {
    events,
    eventLoop,
    register
};
exports.default = chat;
//# sourceMappingURL=Chat.js.map