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
/* eslint-disable camelcase */
// import AppError from "../../errors/AppError";
const axios_1 = __importDefault(require("axios"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const SetLogoutLinkedPage_1 = __importDefault(require("./SetLogoutLinkedPage"));
const socket_1 = require("../../libs/socket");
const api_version = "v12.0";
const baseUrl = `https://graph.facebook.com/${api_version}`;
const app_id = process.env.FACEBOOK_APP_ID;
const app_secret = process.env.FACEBOOK_APP_SECRET_KEY;
const getLongLivedAccessToken = (short_lived_token) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default.get(`${baseUrl}/oauth/access_token?grant_type=fb_exchange_token&client_id=${app_id}&client_secret=${app_secret}&fb_exchange_token=${short_lived_token}`);
    return data.access_token;
});
const getPermanentPageAccessToken = (long_lived_access_token, account_id) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: { data } } = yield axios_1.default.get(`${baseUrl}/${account_id}/accounts?access_token=${long_lived_access_token}`);
    // const page_item = data.find((item: any) => item.name === page_name);
    return data.length && data[0]; // page_item.access_token;
});
const getPageInfo = (accountId, userToken) => __awaiter(void 0, void 0, void 0, function* () {
    const urlPageInfo = `${baseUrl}/${accountId}/accounts?limit=25&access_token=${userToken}`;
    // pegar informações das páginas
    const { data: { data } } = yield (0, axios_1.default)({
        method: "GET",
        url: urlPageInfo
    });
    return data;
});
const GetTokenAndLinkedPage = ({ whatsapp, accountId, userToken, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const io = (0, socket_1.getIO)();
        const pages = yield getPageInfo(accountId, userToken);
        if (pages.length > 1) {
            throw new AppError_1.default("Escolha apenas 1 página. Refaça o processo e selecione apenas 1 página.", 403);
        }
        // caso não existam pages vinculadas, limpar dados do FB.
        if (pages.length === 0) {
            yield (0, SetLogoutLinkedPage_1.default)({ whatsapp, tenantId });
            return;
        }
        // gerar token página
        const long_lived_access_token = yield getLongLivedAccessToken(userToken);
        const permanent_page_access_token = yield getPermanentPageAccessToken(long_lived_access_token, accountId);
        const dataUpdated = {
            status: "CONNECTED",
            fbPageId: permanent_page_access_token.id,
            fbObject: Object.assign(Object.assign({}, permanent_page_access_token), { accountId,
                long_lived_access_token }),
            tokenAPI: permanent_page_access_token.access_token
        };
        // vincular a pagina ao channel e salvar o objeto do facebook
        Whatsapp_1.default.update(dataUpdated, { where: { id: whatsapp.id, tenantId } });
        io.emit(`${tenantId}:whatsappSession`, {
            action: "update",
            session: Object.assign(Object.assign({}, whatsapp), dataUpdated)
        });
    }
    catch (error) {
        console.log(error);
        throw new AppError_1.default(error, 403);
    }
});
exports.default = GetTokenAndLinkedPage;
//# sourceMappingURL=GetTokenAndLinkedPage.js.map