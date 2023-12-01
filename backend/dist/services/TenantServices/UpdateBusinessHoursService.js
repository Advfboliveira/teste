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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Tenant_1 = __importDefault(require("../../models/Tenant"));
const UpdateBusinessHoursService = ({ businessHours, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantModel = yield Tenant_1.default.findOne({
        where: { id: tenantId }
    });
    if (!tenantModel) {
        throw new AppError_1.default("ERR_NO_TENANT_FOUND", 404);
    }
    yield tenantModel.update({
        businessHours
    });
    yield tenantModel.reload({
        attributes: ["businessHours", "messageBusinessHours"]
    });
    return tenantModel;
});
exports.default = UpdateBusinessHoursService;
//# sourceMappingURL=UpdateBusinessHoursService.js.map