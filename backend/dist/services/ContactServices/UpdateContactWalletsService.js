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
const Contact_1 = __importDefault(require("../../models/Contact"));
const ContactWallet_1 = __importDefault(require("../../models/ContactWallet"));
const UpdateContactWalletsService = ({ wallets, contactId, tenantId }) => __awaiter(void 0, void 0, void 0, function* () {
    yield ContactWallet_1.default.destroy({
        where: {
            tenantId,
            contactId
        }
    });
    const contactWallets = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wallets.forEach((wallet) => {
        contactWallets.push({
            walletId: !wallet.id ? wallet : wallet.id,
            contactId,
            tenantId
        });
    });
    yield ContactWallet_1.default.bulkCreate(contactWallets);
    const contact = yield Contact_1.default.findOne({
        where: { id: contactId, tenantId },
        attributes: ["id", "name", "number", "email", "profilePicUrl"],
        include: [
            "extraInfo",
            "tags",
            {
                association: "wallets",
                attributes: ["id", "name"]
            }
        ]
    });
    if (!contact) {
        throw new AppError_1.default("ERR_NO_CONTACT_FOUND", 404);
    }
    return contact;
});
exports.default = UpdateContactWalletsService;
//# sourceMappingURL=UpdateContactWalletsService.js.map