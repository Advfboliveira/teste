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
const date_fns_1 = require("date-fns");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const logger_1 = require("../../utils/logger");
const cArquivoName = (url) => {
    if (!url)
        return "";
    const split = url.split("/");
    const name = split[split.length - 1];
    return name;
};
const UpdateCampaignService = ({ campaignData, medias, campaignId, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    let mediaData;
    let data = Object.assign(Object.assign({}, campaignData), { mediaUrl: cArquivoName(campaignData.mediaUrl), start: (0, date_fns_1.setHours)((0, date_fns_1.setMinutes)((0, date_fns_1.parseISO)(campaignData.start), 0), 8) });
    const campaignModel = yield Campaign_1.default.findOne({
        where: { id: campaignId, tenantId }
    });
    if ((campaignModel === null || campaignModel === void 0 ? void 0 : campaignModel.status) !== "pending" &&
        (campaignModel === null || campaignModel === void 0 ? void 0 : campaignModel.status) !== "canceled") {
        throw new AppError_1.default("ERR_NO_UPDATE_CAMPAIGN_NOT_IN_CANCELED_PENDING", 404);
    }
    if (medias && Array.isArray(medias) && medias.length) {
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
        data = Object.assign(Object.assign({}, campaignData), { mediaUrl: mediaData === null || mediaData === void 0 ? void 0 : mediaData.filename, mediaType: mediaData === null || mediaData === void 0 ? void 0 : mediaData.mimetype.substr(0, mediaData.mimetype.indexOf("/")) });
    }
    else if (campaignData.mediaUrl === "null") {
        data = Object.assign(Object.assign({}, campaignData), { mediaUrl: "", mediaType: "" });
    }
    if (!campaignModel) {
        throw new AppError_1.default("ERR_NO_CAMPAIGN_FOUND", 404);
    }
    yield campaignModel.update(data);
    yield campaignModel.reload();
    return campaignModel;
});
exports.default = UpdateCampaignService;
//# sourceMappingURL=UpdateCampaignService.js.map