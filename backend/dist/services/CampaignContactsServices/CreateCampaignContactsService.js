"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
/* eslint-disable array-callback-return */
// import AppError from "../../errors/AppError";
const Yup = __importStar(require("yup"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const CampaignContacts_1 = __importDefault(require("../../models/CampaignContacts"));
const CreateCampaignContactsService = ({ campaignContacts, campaignId }) => __awaiter(void 0, void 0, void 0, function* () {
    const randomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const isCreateds = yield CampaignContacts_1.default.findAll({
        where: {
            campaignId
        }
    });
    const data = campaignContacts.map((contact) => {
        return {
            contactId: contact.id,
            campaignId,
            messageRandom: `message${randomInteger(1, 3)}`
        };
    });
    // eslint-disable-next-line consistent-return
    const filterData = data.filter((d) => {
        const isExists = isCreateds === null || isCreateds === void 0 ? void 0 : isCreateds.findIndex((c) => d.contactId === c.contactId && +campaignId === c.campaignId);
        if (isExists === -1) {
            return d;
        }
    });
    const schema = Yup.array().of(Yup.object().shape({
        messageRandom: Yup.string().required(),
        campaignId: Yup.number().required(),
        contactId: Yup.number().required()
    }));
    try {
        yield schema.validate(filterData);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    try {
        yield CampaignContacts_1.default.bulkCreate(filterData);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
});
exports.default = CreateCampaignContactsService;
//# sourceMappingURL=CreateCampaignContactsService.js.map