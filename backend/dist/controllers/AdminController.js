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
exports.storeChannel = exports.indexChannels = exports.updateSettings = exports.indexSettings = exports.indexChatFlow = exports.indexTenants = exports.updateUser = exports.indexUsers = void 0;
const socket_1 = require("../libs/socket");
const AdminListChatFlowService_1 = __importDefault(require("../services/AdminServices/AdminListChatFlowService"));
const AdminListSettingsService_1 = __importDefault(require("../services/AdminServices/AdminListSettingsService"));
const AdminListTenantsService_1 = __importDefault(require("../services/AdminServices/AdminListTenantsService"));
const AdminListUsersService_1 = __importDefault(require("../services/AdminServices/AdminListUsersService"));
const AdminListChannelsService_1 = __importDefault(require("../services/AdminServices/AdminListChannelsService"));
const AdminUpdateUserService_1 = __importDefault(require("../services/AdminServices/AdminUpdateUserService"));
const UpdateSettingService_1 = __importDefault(require("../services/SettingServices/UpdateSettingService"));
const CreateWhatsAppService_1 = __importDefault(require("../services/WhatsappService/CreateWhatsAppService"));
const indexUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchParam, pageNumber } = req.query;
    const { users, count, hasMore } = yield (0, AdminListUsersService_1.default)({
        searchParam,
        pageNumber
    });
    return res.status(200).json({ users, count, hasMore });
});
exports.indexUsers = indexUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const { userId } = req.params;
    const user = yield (0, AdminUpdateUserService_1.default)({ userData, userId });
    const io = (0, socket_1.getIO)();
    if (user) {
        io.emit(`${user.tenantId}:user`, {
            action: "update",
            user
        });
    }
    return res.status(200).json(user);
});
exports.updateUser = updateUser;
const indexTenants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tenants = yield (0, AdminListTenantsService_1.default)();
    return res.status(200).json(tenants);
});
exports.indexTenants = indexTenants;
const indexChatFlow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.params;
    const chatFlow = yield (0, AdminListChatFlowService_1.default)({ tenantId });
    return res.status(200).json(chatFlow);
});
exports.indexChatFlow = indexChatFlow;
const indexSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.params;
    const settings = yield (0, AdminListSettingsService_1.default)(tenantId);
    return res.status(200).json(settings);
});
exports.indexSettings = indexSettings;
const updateSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.params;
    const { value, key } = req.body;
    const setting = yield (0, UpdateSettingService_1.default)({
        key,
        value,
        tenantId
    });
    const io = (0, socket_1.getIO)();
    io.emit(`${tenantId}:settings`, {
        action: "update",
        setting
    });
    return res.status(200).json(setting);
});
exports.updateSettings = updateSettings;
const indexChannels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.query;
    const channels = yield (0, AdminListChannelsService_1.default)({ tenantId });
    return res.status(200).json(channels);
});
exports.indexChannels = indexChannels;
const storeChannel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, tenantId, tokenTelegram, instagramUser, instagramKey, type, wabaBSP, tokenAPI } = req.body;
    const data = {
        name,
        status: "DISCONNECTED",
        tenantId,
        tokenTelegram,
        instagramUser,
        instagramKey,
        type,
        wabaBSP,
        tokenAPI
    };
    const channels = yield (0, CreateWhatsAppService_1.default)(data);
    return res.status(200).json(channels);
});
exports.storeChannel = storeChannel;
//# sourceMappingURL=AdminController.js.map