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
const CreateOrUpdateContactService_1 = __importDefault(require("../ContactServices/CreateOrUpdateContactService"));
// _profilePicExpired(user: { profilePic: string }): boolean {
//   try {
//     // Facebook CDN returns expiration time in the key `ext` in URL params like:
//     // https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=11111111111111&width=1024&ext=1543379908&hash=xxxxxxxxxxxx
//     const ext = new URL(user.profilePic).searchParams.get('ext');
//     if (!ext) return true;
//     const timestamp = +ext * 1000;
//     const expireTime = new Date(timestamp);
//     return !(isValid(expireTime) && isAfter(expireTime, new Date()));
//   } catch (e) {
//     return true;
//   }
// }
const MessengerVerifyContact = (contact, messagerBot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    const senderUser = yield messagerBot.getPersona(contact.id);
    const profilePicUrl = (senderUser === null || senderUser === void 0 ? void 0 : senderUser.profilePictureUrl) || (senderUser === null || senderUser === void 0 ? void 0 : senderUser.profilePic) || undefined;
    const contactName = senderUser.name || `${senderUser.firstName} ${senderUser.lastName}` || "";
    const contactData = {
        name: contactName,
        number: senderUser.id,
        messengerId: senderUser.id,
        profilePicUrl,
        tenantId,
        pushname: contactName,
        isUser: false,
        isWAContact: true,
        isGroup: false,
        origem: "messenger"
    };
    const newContact = yield (0, CreateOrUpdateContactService_1.default)(contactData);
    return newContact;
});
exports.default = MessengerVerifyContact;
//# sourceMappingURL=MessengerVerifyContact.js.map