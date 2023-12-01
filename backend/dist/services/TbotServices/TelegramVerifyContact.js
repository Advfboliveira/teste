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
// var getUserProfilePhotos = async (ctx: Context, photo) => {
//   const profile = await ctx.telegram.getUserProfilePhotos(ctx.chat?.id);
//   if (!profile || profile.total_count == 0)
//   ctx.telegram.getFileLink()
//     return ctx.reply(${ first_name(ctx) } ${ last_name(ctx) } \n\n${ messagewelcome(ctx) }, {
//       parse_mode: 'HTML',
//       reply_markup: {
//         inline_keyboard: inKey
//       }
//     })
//   ctx.replyWithPhoto(profile.photos[0][0].file_id, { caption: ${ first_name(ctx) } ${ last_name(ctx) } \n\n${ messagewelcome(ctx) },
//     parse_mode: 'HTML',
//     reply_markup: {
//     inline_keyboard: inKey
//   }
//                       })
// }
const VerifyContact = (ctx, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let profilePicUrl;
    const chatInfo = yield ctx.getChat();
    try {
        profilePicUrl = ((_a = chatInfo.photo) === null || _a === void 0 ? void 0 : _a.small_file_id)
            ? yield ctx.telegram.getFileLink((_b = chatInfo.photo) === null || _b === void 0 ? void 0 : _b.small_file_id)
            : undefined;
    }
    catch (error) {
        profilePicUrl = undefined;
    }
    const contactData = {
        name: `${chatInfo.first_name} ${chatInfo.last_name}` || chatInfo.username || "",
        number: "",
        profilePicUrl: profilePicUrl ? String(profilePicUrl) : undefined,
        tenantId,
        pushname: chatInfo.username || "",
        isUser: true,
        isWAContact: false,
        isGroup: false,
        origem: "telegram",
        telegramId: chatInfo.id
    };
    const contact = yield (0, CreateOrUpdateContactService_1.default)(contactData);
    return contact;
});
exports.default = VerifyContact;
//# sourceMappingURL=TelegramVerifyContact.js.map