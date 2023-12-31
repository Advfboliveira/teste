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
const Tenant_1 = __importDefault(require("../../models/Tenant"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const ShowBusinessHoursAndMessageService = ({ tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const tenant = yield Tenant_1.default.findByPk(tenantId, {
        attributes: ["businessHours", "messageBusinessHours"]
    });
    if (!tenant) {
        throw new AppError_1.default("ERR_NO_TENANT_FOUND", 404);
    }
    return tenant;
});
exports.default = ShowBusinessHoursAndMessageService;
//# sourceMappingURL=ShowBusinessHoursAndMessageService.js.map