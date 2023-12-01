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
exports.cancelCampaign = exports.startCampaign = exports.remove = exports.update = exports.index = exports.store = void 0;
const Yup = __importStar(require("yup"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const CreateCampaignService_1 = __importDefault(require("../services/CampaignServices/CreateCampaignService"));
const ListCampaignService_1 = __importDefault(require("../services/CampaignServices/ListCampaignService"));
const DeleteCampaignService_1 = __importDefault(require("../services/CampaignServices/DeleteCampaignService"));
const UpdateCampaignService_1 = __importDefault(require("../services/CampaignServices/UpdateCampaignService"));
const StartCampaignService_1 = __importDefault(require("../services/CampaignServices/StartCampaignService"));
const CancelCampaignService_1 = __importDefault(require("../services/CampaignServices/CancelCampaignService"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const medias = req.files;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const campaign = Object.assign(Object.assign({}, req.body), { userId: req.user.id, tenantId });
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        start: Yup.string().required(),
        message1: Yup.string().required(),
        message2: Yup.string().required(),
        message3: Yup.string().required(),
        userId: Yup.string().required(),
        sessionId: Yup.string().required(),
        tenantId: Yup.number().required()
    });
    try {
        yield schema.validate(campaign);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const newCampaign = yield (0, CreateCampaignService_1.default)({
        campaign,
        medias
    });
    return res.status(200).json(newCampaign);
});
exports.store = store;
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const tags = yield (0, ListCampaignService_1.default)({
        tenantId
    });
    return res.status(200).json(tags);
});
exports.index = index;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const medias = req.files;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const campaignData = Object.assign(Object.assign({}, req.body), { userId: req.user.id, tenantId });
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        start: Yup.string().required(),
        message1: Yup.string().required(),
        message2: Yup.string().required(),
        message3: Yup.string().required(),
        mediaUrl: Yup.string().required(),
        userId: Yup.string().required(),
        sessionId: Yup.string().required(),
        tenantId: Yup.number().required()
    });
    try {
        yield schema.validate(campaignData);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const { campaignId } = req.params;
    const campaignObj = yield (0, UpdateCampaignService_1.default)({
        campaignData,
        medias,
        campaignId,
        tenantId
    });
    return res.status(200).json(campaignObj);
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { campaignId } = req.params;
    yield (0, DeleteCampaignService_1.default)({ id: campaignId, tenantId });
    return res.status(200).json({ message: "Campaign deleted" });
});
exports.remove = remove;
const startCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { campaignId } = req.params;
    yield (0, StartCampaignService_1.default)({
        campaignId,
        tenantId,
        options: {
            delay: 2000
        }
    });
    return res.status(200).json({ message: "Campaign started" });
});
exports.startCampaign = startCampaign;
const cancelCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { campaignId } = req.params;
    yield (0, CancelCampaignService_1.default)({
        campaignId,
        tenantId
    });
    return res.status(200).json({ message: "Campaign canceled" });
});
exports.cancelCampaign = cancelCampaign;
//# sourceMappingURL=CampaignController.js.map