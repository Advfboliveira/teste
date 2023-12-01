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
const VerifyContactWaba360 = (contact, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    const profilePicUrl = undefined;
    const contactData = {
        name: contact.profile.name || "",
        number: contact.wa_id,
        profilePicUrl,
        tenantId,
        pushname: contact.profile.name || "",
        isUser: false,
        isWAContact: true,
        isGroup: false
    };
    const newContact = yield (0, CreateOrUpdateContactService_1.default)(contactData);
    return newContact;
});
exports.default = VerifyContactWaba360;
//# sourceMappingURL=VerifyContactWaba360.js.map