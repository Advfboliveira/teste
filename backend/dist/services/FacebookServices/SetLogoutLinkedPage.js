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
const socket_1 = require("../../libs/socket");
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const SetLogoutLinkedPage = ({ whatsapp, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const io = (0, socket_1.getIO)();
    const dataUpdated = {
        fbPageId: null,
        fbObject: {},
        tokenAPI: null,
        status: "DISCONNECTED"
    };
    Whatsapp_1.default.update(dataUpdated, { where: { id: whatsapp.id, tenantId } });
    io.emit(`${tenantId}:whatsappSession`, {
        action: "update",
        session: Object.assign(Object.assign({}, whatsapp), dataUpdated)
    });
});
exports.default = SetLogoutLinkedPage;
//# sourceMappingURL=SetLogoutLinkedPage.js.map