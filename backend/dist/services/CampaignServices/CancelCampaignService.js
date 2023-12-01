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
const bull_1 = __importDefault(require("bull"));
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CampaignContacts_1 = __importDefault(require("../../models/CampaignContacts"));
const CancelCampaignService = ({ campaignId, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const campaign = yield Campaign_1.default.findOne({
        where: { id: campaignId, tenantId }
    });
    if (!campaign) {
        throw new AppError_1.default("ERROR_CAMPAIGN_NOT_EXISTS", 404);
    }
    // jobId: `campaginId_${campaign.id}_contact_${campaignContact.contactId}_id_${campaignContact.id}`,
    try {
        yield (0, bull_1.default)("SendMessageWhatsappCampaign").removeJobs(`campaginId_${campaign.id}*`);
        yield CampaignContacts_1.default.update({
            body: null,
            mediaName: null,
            timestamp: null,
            ack: 0,
            messageId: null
        }, { where: { campaignId: campaign.id } });
        yield campaign.update({
            status: "canceled"
        });
    }
    catch (error) {
        throw new AppError_1.default(`ERROR: ${error}`, 404);
    }
});
exports.default = CancelCampaignService;
//# sourceMappingURL=CancelCampaignService.js.map