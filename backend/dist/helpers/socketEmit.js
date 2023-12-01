"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../libs/socket");
const emitEvent = ({ tenantId, type, payload }) => {
    const io = (0, socket_1.getIO)();
    let eventChannel = `${tenantId}:ticketList`;
    if (type.indexOf("contact:") !== -1) {
        eventChannel = `${tenantId}:contactList`;
    }
    io.to(tenantId.toString()).emit(eventChannel, {
        type,
        payload
    });
};
exports.default = emitEvent;
//# sourceMappingURL=socketEmit.js.map