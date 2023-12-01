"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isValidMsg = (msg) => {
    if (msg.from === "status@broadcast")
        return false;
    if (msg.type === "chat" ||
        msg.type === "audio" ||
        msg.type === "ptt" ||
        msg.type === "video" ||
        msg.type === "image" ||
        msg.type === "document" ||
        msg.type === "vcard" ||
        msg.type === "sticker")
        return true;
    return false;
};
exports.default = isValidMsg;
//# sourceMappingURL=IsValidMsg.js.map