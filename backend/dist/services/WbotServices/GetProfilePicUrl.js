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
const GetDefaultWhatsApp_1 = __importDefault(require("../../helpers/GetDefaultWhatsApp"));
const wbot_1 = require("../../libs/wbot");
const logger_1 = require("../../utils/logger");
const GetProfilePicUrl = (number, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const defaultWhatsapp = yield (0, GetDefaultWhatsApp_1.default)(tenantId);
        const wbot = (0, wbot_1.getWbot)(defaultWhatsapp.id);
        const profilePicUrl = yield wbot.getProfilePicUrl(`${number}@c.us`);
        return profilePicUrl;
    }
    catch (error) {
        logger_1.logger.error(`GetProfilePicUrl - ${error}`);
        return "";
    }
});
exports.default = GetProfilePicUrl;
//# sourceMappingURL=GetProfilePicUrl.js.map