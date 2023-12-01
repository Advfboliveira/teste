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
// import AppError from "../../errors/AppError";
const date_fns_1 = require("date-fns");
const logger_1 = require("../../utils/logger");
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const CreateCampaignService = ({ campaign, medias }) => __awaiter(void 0, void 0, void 0, function* () {
    let mediaData;
    if (medias) {
        yield Promise.all(medias.map((media) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!media.filename) {
                    const ext = media.mimetype.split("/")[1].split(";")[0];
                    media.filename = `${new Date().getTime()}.${ext}`;
                }
                mediaData = media;
            }
            catch (err) {
                logger_1.logger.error(err);
            }
        })));
    }
    const data = {
        name: campaign.name,
        start: (0, date_fns_1.setHours)((0, date_fns_1.setMinutes)((0, date_fns_1.parseISO)(campaign.start), 0), 8),
        message1: campaign.message1,
        message2: campaign.message2,
        message3: campaign.message3,
        userId: campaign.userId,
        mediaUrl: mediaData === null || mediaData === void 0 ? void 0 : mediaData.filename,
        mediaType: mediaData === null || mediaData === void 0 ? void 0 : mediaData.mimetype.substr(0, mediaData.mimetype.indexOf("/")),
        sessionId: campaign.sessionId,
        tenantId: campaign.tenantId
    };
    const campaignData = yield Campaign_1.default.create(data);
    return campaignData;
});
exports.default = CreateCampaignService;
//# sourceMappingURL=CreateCampaignService.js.map