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
const InstagramVerifyContact = (threadData, instaBot, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let profilePicUrl;
    let user;
    try {
        user = (_a = threadData.thread) === null || _a === void 0 ? void 0 : _a.users[0];
        profilePicUrl = user.profile_pic_url;
    }
    catch (error) {
        profilePicUrl = undefined;
    }
    const contactData = {
        name: (user === null || user === void 0 ? void 0 : user.full_name) || user.username || "",
        number: "",
        profilePicUrl: profilePicUrl ? String(profilePicUrl) : undefined,
        tenantId,
        pushname: user.username || "",
        isUser: true,
        isWAContact: false,
        isGroup: false,
        origem: "instagram",
        instagramPK: user.pk
    };
    const contact = yield (0, CreateOrUpdateContactService_1.default)(contactData);
    return contact;
});
exports.default = InstagramVerifyContact;
//# sourceMappingURL=InstagramVerifyContact.js.map