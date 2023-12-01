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
exports.showBusinessHoursAndMessage = exports.updateMessageBusinessHours = exports.updateBusinessHours = void 0;
const Yup = __importStar(require("yup"));
const date_fns_1 = require("date-fns");
const AppError_1 = __importDefault(require("../errors/AppError"));
const UpdateBusinessHoursService_1 = __importDefault(require("../services/TenantServices/UpdateBusinessHoursService"));
const ShowBusinessHoursAndMessageService_1 = __importDefault(require("../services/TenantServices/ShowBusinessHoursAndMessageService"));
const UpdateMessageBusinessHoursService_1 = __importDefault(require("../services/TenantServices/UpdateMessageBusinessHoursService"));
const updateBusinessHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const businessHours = req.body;
    const schema = Yup.array().of(Yup.object().shape({
        day: Yup.number().required().integer(),
        label: Yup.string().required(),
        type: Yup.string().required(),
        hr1: Yup.string()
            .required()
            // eslint-disable-next-line no-template-curly-in-string
            .test("isHoursValid", "${path} is not valid", value => (0, date_fns_1.isMatch)(value || "", "HH:mm")),
        hr2: Yup.string()
            .required()
            // eslint-disable-next-line no-template-curly-in-string
            .test("isHoursValid", "${path} is not valid", value => {
            return (0, date_fns_1.isMatch)(value || "", "HH:mm");
        }),
        hr3: Yup.string()
            .required()
            // eslint-disable-next-line no-template-curly-in-string
            .test("isHoursValid", "${path} is not valid", value => (0, date_fns_1.isMatch)(value || "", "HH:mm")),
        hr4: Yup.string()
            .required()
            // eslint-disable-next-line no-template-curly-in-string
            .test("isHoursValid", "${path} is not valid", value => (0, date_fns_1.isMatch)(value || "", "HH:mm"))
    }));
    try {
        yield schema.validate(businessHours);
    }
    catch (error) {
        throw new AppError_1.default(error.message);
    }
    const newBusinessHours = yield (0, UpdateBusinessHoursService_1.default)({
        businessHours,
        tenantId
    });
    return res.status(200).json(newBusinessHours);
});
exports.updateBusinessHours = updateBusinessHours;
const updateMessageBusinessHours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (req.user.profile !== "admin") {
        throw new AppError_1.default("ERR_NO_PERMISSION", 403);
    }
    const { messageBusinessHours } = req.body;
    if (!messageBusinessHours) {
        throw new AppError_1.default("ERR_NO_MESSAGE_INFORMATION", 404);
    }
    const newBusinessHours = yield (0, UpdateMessageBusinessHoursService_1.default)({
        messageBusinessHours,
        tenantId
    });
    return res.status(200).json(newBusinessHours);
});
exports.updateMessageBusinessHours = updateMessageBusinessHours;
const showBusinessHoursAndMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    const tenant = yield (0, ShowBusinessHoursAndMessageService_1.default)({ tenantId });
    return res.status(200).json(tenant);
});
exports.showBusinessHoursAndMessage = showBusinessHoursAndMessage;
//# sourceMappingURL=TenantController.js.map