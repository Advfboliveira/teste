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
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const DeleteCampaignService = ({ id, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const campaign = yield Campaign_1.default.findOne({
        where: { id, tenantId }
    });
    if (!campaign) {
        throw new AppError_1.default("ERR_NO_CAMPAIGN_FOUND", 404);
    }
    if ((campaign === null || campaign === void 0 ? void 0 : campaign.status) !== "pending" && (campaign === null || campaign === void 0 ? void 0 : campaign.status) !== "canceled") {
        throw new AppError_1.default("ERR_NO_UPDATE_CAMPAIGN_NOT_IN_CANCELED_PENDING", 404);
    }
    try {
        yield campaign.destroy();
    }
    catch (error) {
        throw new AppError_1.default("ERROR_CAMPAIGN_NOT_EXISTS", 404);
    }
});
exports.default = DeleteCampaignService;
//# sourceMappingURL=DeleteCampaignService.js.map