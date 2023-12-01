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
const CampaignContacts_1 = __importDefault(require("../../models/CampaignContacts"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const DeleteCampaignContactsService = ({ campaignId, contactId, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const cc = yield CampaignContacts_1.default.findOne({
        where: { campaignId, contactId },
        include: [
            {
                model: Campaign_1.default,
                required: true,
                where: {
                    id: campaignId,
                    tenantId
                }
            }
        ]
    });
    if (!cc) {
        throw new AppError_1.default("ERR_NO_CAMPAIGN_CONTACTS_NOT_FOUND", 404);
    }
    try {
        yield cc.destroy();
    }
    catch (error) {
        throw new AppError_1.default("ERR_CAMPAIGN_CONTACTS_NOT_EXISTS", 404);
    }
});
exports.default = DeleteCampaignContactsService;
//# sourceMappingURL=DeleteCampaignContactsService.js.map