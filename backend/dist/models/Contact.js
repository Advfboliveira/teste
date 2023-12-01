"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const sequelize_typescript_1 = require("sequelize-typescript");
const GetProfilePicUrl_1 = __importDefault(require("../services/WbotServices/GetProfilePicUrl"));
const Campaign_1 = __importDefault(require("./Campaign"));
const CampaignContacts_1 = __importDefault(require("./CampaignContacts"));
const ContactCustomField_1 = __importDefault(require("./ContactCustomField"));
const ContactTag_1 = __importDefault(require("./ContactTag"));
const ContactWallet_1 = __importDefault(require("./ContactWallet"));
// import Message from "./Message";
const Tag_1 = __importDefault(require("./Tag"));
const Tenant_1 = __importDefault(require("./Tenant"));
const Ticket_1 = __importDefault(require("./Ticket"));
const User_1 = __importDefault(require("./User"));
let Contact = class Contact extends sequelize_typescript_1.Model {
    static getProfilePicUrl(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const profilePicUrl = yield (0, GetProfilePicUrl_1.default)(instance.number, instance.tenantId);
            instance.profilePicUrl = profilePicUrl;
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Contact.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Contact.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Contact.prototype, "number", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Contact.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Contact.prototype, "profilePicUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Contact.prototype, "pushname", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Contact.prototype, "telegramId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Contact.prototype, "messengerId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Contact.prototype, "instagramPK", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Contact.prototype, "isUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Contact.prototype, "isWAContact", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Contact.prototype, "isGroup", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Contact.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Contact.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Ticket_1.default),
    __metadata("design:type", Array)
], Contact.prototype, "tickets", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ContactCustomField_1.default),
    __metadata("design:type", Array)
], Contact.prototype, "extraInfo", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Tag_1.default, () => ContactTag_1.default, "contactId", "tagId"),
    __metadata("design:type", Array)
], Contact.prototype, "tags", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => User_1.default, () => ContactWallet_1.default, "contactId", "walletId"),
    __metadata("design:type", Array)
], Contact.prototype, "wallets", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => CampaignContacts_1.default),
    __metadata("design:type", Array)
], Contact.prototype, "campaignContacts", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Campaign_1.default, () => CampaignContacts_1.default, "contactId", "campaignId"),
    __metadata("design:type", Array)
], Contact.prototype, "campaign", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Tenant_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Contact.prototype, "tenantId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Tenant_1.default),
    __metadata("design:type", Tenant_1.default)
], Contact.prototype, "tenant", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Contact]),
    __metadata("design:returntype", Promise)
], Contact, "getProfilePicUrl", null);
Contact = __decorate([
    sequelize_typescript_1.Table
], Contact);
// Contact.sequelize?.define("Contact", {
//   scheduledMessages: {
//     type: DataTypes.VIRTUAL,
//     async get() {
//       const contactId = 4077;
//       const messages = await Message.findAll({
//         where: {
//           contactId,
//           scheduleDate: { [Op.not]: null },
//           status: "pending"
//         },
//         logging: console.log
//       });
//       return messages;
//     }
//   }
// });
exports.default = Contact;
//# sourceMappingURL=Contact.js.map