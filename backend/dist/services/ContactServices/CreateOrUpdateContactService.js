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
const socketEmit_1 = __importDefault(require("../../helpers/socketEmit"));
const Contact_1 = __importDefault(require("../../models/Contact"));
const CreateOrUpdateContactService = ({ name, number: rawNumber, profilePicUrl, isGroup, tenantId, pushname, isUser, isWAContact, email = "", telegramId, instagramPK, messengerId, extraInfo = [], origem = "whatsapp" }) => __awaiter(void 0, void 0, void 0, function* () {
    const number = isGroup ? rawNumber : rawNumber.replace(/[^0-9]/g, "");
    let contact = null;
    if (origem === "whatsapp") {
        contact = yield Contact_1.default.findOne({ where: { number, tenantId } });
    }
    if (origem === "telegram" && telegramId) {
        contact = yield Contact_1.default.findOne({ where: { telegramId, tenantId } });
    }
    if (origem === "instagram" && instagramPK) {
        contact = yield Contact_1.default.findOne({ where: { instagramPK, tenantId } });
    }
    if (origem === "messenger" && messengerId) {
        contact = yield Contact_1.default.findOne({ where: { messengerId, tenantId } });
    }
    if (contact) {
        contact.update({
            profilePicUrl,
            pushname,
            isUser,
            isWAContact,
            telegramId,
            instagramPK,
            messengerId
        });
    }
    else {
        contact = yield Contact_1.default.create({
            name,
            number,
            profilePicUrl,
            email,
            isGroup,
            pushname,
            isUser,
            isWAContact,
            tenantId,
            extraInfo,
            telegramId,
            instagramPK,
            messengerId
        });
    }
    (0, socketEmit_1.default)({
        tenantId,
        type: "contact:update",
        payload: contact
    });
    return contact;
});
exports.default = CreateOrUpdateContactService;
//# sourceMappingURL=CreateOrUpdateContactService.js.map