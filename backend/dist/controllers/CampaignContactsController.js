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
exports.removeAll = exports.remove = exports.index = exports.store = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const CreateCampaignContactsService_1 = __importDefault(require("../services/CampaignContactsServices/CreateCampaignContactsService"));
const ListCampaignContactsService_1 = __importDefault(require("../services/CampaignContactsServices/ListCampaignContactsService"));
const DeleteCampaignContactsService_1 = __importDefault(require("../services/CampaignContactsServices/DeleteCampaignContactsService"));
const DeleteAllCampaignContactsService_1 = __importDefault(require("../services/CampaignContactsServices/DeleteAllCampaignContactsService"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const contacts = [...req.body];
    const { campaignId } = req.params;
    const cc = yield (0, CreateCampaignContactsService_1.default)({
        campaignContacts: contacts,
        campaignId
    });
    return res.status(200).json(cc);
});
exports.store = store;
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const { campaignId } = req.params;
    const tags = yield (0, ListCampaignContactsService_1.default)({
        campaignId,
        tenantId
        // eslint-disable-next-line eqeqeq
    });
    return res.status(200).json(tags);
});
exports.index = index;
// export const update = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { tenantId } = req.user;
//   if (req.user.profile !== "admin") {
//     throw new AppError("ERR_NO_PERMISSION", 403);
//   }
//   const tagData: TagData = { ...req.body, userId: req.user.id, tenantId };
//   const schema = Yup.object().shape({
//     tag: Yup.string().required(),
//     color: Yup.string().required(),
//     isActive: Yup.boolean().required(),
//     userId: Yup.number().required()
//   });
//   try {
//     await schema.validate(tagData);
//   } catch (error) {
//     throw new AppError(error.message);
//   }
//   const { tagId } = req.params;
//   const tagObj = await UpdateTagService({
//     tagData,
//     tagId
//   });
//   return res.status(200).json(tagObj);
// };
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { campaignId, contactId } = req.params;
    yield (0, DeleteCampaignContactsService_1.default)({ campaignId, contactId, tenantId });
    return res.status(200).json({ message: "Campagin Contact deleted" });
});
exports.remove = remove;
const removeAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { campaignId } = req.params;
    yield (0, DeleteAllCampaignContactsService_1.default)({ campaignId, tenantId });
    return res.status(200).json({ message: "Campagin Contacts deleted" });
});
exports.removeAll = removeAll;
//# sourceMappingURL=CampaignContactsController.js.map