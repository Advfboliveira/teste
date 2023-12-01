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
exports.facebookLogout = exports.store = void 0;
const GetTokenAndLinkedPage_1 = __importDefault(require("../services/FacebookServices/GetTokenAndLinkedPage"));
const SetLogoutLinkedPage_1 = __importDefault(require("../services/FacebookServices/SetLogoutLinkedPage"));
const store = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { whatsapp, accountId, userToken } = req.body;
    yield (0, GetTokenAndLinkedPage_1.default)({
        whatsapp,
        accountId,
        userToken,
        tenantId: req.user.tenantId
    });
    return res.status(200).json();
});
exports.store = store;
const facebookLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const whatsapp = req.body;
    yield (0, SetLogoutLinkedPage_1.default)({
        whatsapp,
        tenantId: req.user.tenantId
    });
    return res.status(200).json();
});
exports.facebookLogout = facebookLogout;
//# sourceMappingURL=facebookController.js.map