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
const axios_1 = __importDefault(require("axios"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const logger_1 = require("../../utils/logger");
// Use this endpoint to manage your profile photo.
const SetPhotoProfileInfo = ({ file, apiKey }) => __awaiter(void 0, void 0, void 0, function* () {
    const apiUrl360 = `${process.env.API_URL_360}/v1/settings/profile/photo`;
    try {
        yield (0, axios_1.default)({
            method: "post",
            url: apiUrl360,
            data: { file },
            headers: {
                "D360-API-KEY": apiKey,
                "Content-Type": "multipart/form-data"
            }
        });
        return true;
    }
    catch (error) {
        logger_1.logger.error(error);
        throw new AppError_1.default(`360_NOT_SET_PHOTO: ${error}`);
    }
});
exports.default = SetPhotoProfileInfo;
//# sourceMappingURL=SetPhotoProfileInfo.js.map