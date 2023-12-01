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
const CreateOrUpdateContactService_1 = __importDefault(require("../../ContactServices/CreateOrUpdateContactService"));
const VerifyContact = (msgContact, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    let profilePicUrl;
    try {
        profilePicUrl = yield msgContact.getProfilePicUrl();
    }
    catch (error) {
        profilePicUrl = undefined;
    }
    const contactData = {
        name: msgContact.name ||
            msgContact.pushname ||
            msgContact.shortName ||
            msgContact.id.user,
        number: msgContact.id.user,
        profilePicUrl,
        tenantId,
        pushname: msgContact.pushname,
        isUser: msgContact.isUser,
        isWAContact: msgContact.isWAContact,
        isGroup: msgContact.isGroup
    };
    const contact = yield (0, CreateOrUpdateContactService_1.default)(contactData);
    return contact;
});
exports.default = VerifyContact;
//# sourceMappingURL=VerifyContact.js.map