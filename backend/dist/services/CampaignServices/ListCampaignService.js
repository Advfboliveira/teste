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
const sequelize_typescript_1 = require("sequelize-typescript");
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const CampaignContacts_1 = __importDefault(require("../../models/CampaignContacts"));
const ListCampaignService = ({ tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where = {
        tenantId
    };
    const campaignData = yield Campaign_1.default.findAll({
        where,
        attributes: {
            include: [
                [
                    sequelize_typescript_1.Sequelize.fn("COUNT", sequelize_typescript_1.Sequelize.col("campaignContacts.id")),
                    "contactsCount"
                ],
                [
                    sequelize_typescript_1.Sequelize.literal('(select count(1) from "CampaignContacts" as "w" where "w"."campaignId" = "Campaign"."id" and "w"."ack" = 0 )'),
                    "pendentesEnvio"
                ],
                [
                    sequelize_typescript_1.Sequelize.literal('(select count(1) from "CampaignContacts" as "w" where "w"."campaignId" = "Campaign"."id" and "w"."ack" = 1 )'),
                    "pendentesEntrega"
                ],
                [
                    sequelize_typescript_1.Sequelize.literal('(select count(1) from "CampaignContacts" as "w" where "w"."campaignId" = "Campaign"."id" and "w"."ack" = 2 )'),
                    "recebidas"
                ],
                [
                    sequelize_typescript_1.Sequelize.literal('(select count(1) from "CampaignContacts" as "w" where "w"."campaignId" = "Campaign"."id" and "w"."ack" = 3 )'),
                    "lidas"
                ]
            ]
        },
        include: [
            {
                model: CampaignContacts_1.default,
                attributes: []
            }
        ],
        group: ["Campaign.id"],
        order: [["start", "ASC"]]
    });
    return campaignData;
});
exports.default = ListCampaignService;
//# sourceMappingURL=ListCampaignService.js.map