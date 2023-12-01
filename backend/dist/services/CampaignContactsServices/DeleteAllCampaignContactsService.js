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
const DeleteAllCampaignContactsService = ({ campaignId, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield Campaign_1.default.findOne({
            where: {
                id: campaignId,
                tenantId
            }
        });
        if (campaign === null || campaign === void 0 ? void 0 : campaign.id) {
            yield CampaignContacts_1.default.destroy({
                where: {
                    campaignId
                }
            });
        }
        else {
            throw new AppError_1.default("ERR_CAMPAIGN_CONTACTS_NOT_EXISTS_OR_NOT_ACESSIBLE", 404);
        }
    }
    catch (error) {
        throw new AppError_1.default("ERR_CAMPAIGN_CONTACTS", 404);
    }
});
exports.default = DeleteAllCampaignContactsService;
//# sourceMappingURL=DeleteAllCampaignContactsService.js.map