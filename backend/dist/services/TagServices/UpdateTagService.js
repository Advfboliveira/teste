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
const Tag_1 = __importDefault(require("../../models/Tag"));
const UpdateTagService = ({ tagData, tagId }) => __awaiter(void 0, void 0, void 0, function* () {
    const { tag, color, isActive, userId, tenantId } = tagData;
    const tagModel = yield Tag_1.default.findOne({
        where: { id: tagId, tenantId },
        attributes: ["id", "tag", "color", "isActive", "userId"]
    });
    if (!tagModel) {
        throw new AppError_1.default("ERR_NO_TAG_FOUND", 404);
    }
    yield tagModel.update({
        tag,
        color,
        isActive,
        userId
    });
    yield tagModel.reload({
        attributes: ["id", "tag", "color", "isActive", "userId"]
    });
    return tagModel;
});
exports.default = UpdateTagService;
//# sourceMappingURL=UpdateTagService.js.map