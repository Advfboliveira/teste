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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const Campaign_1 = __importDefault(require("./Campaign"));
const Contact_1 = __importDefault(require("./Contact"));
const Message_1 = __importDefault(require("./Message"));
let CampaignContacts = class CampaignContacts extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CampaignContacts.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CampaignContacts.prototype, "ack", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], CampaignContacts.prototype, "body", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CampaignContacts.prototype, "messageRandom", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CampaignContacts.prototype, "mediaName", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], CampaignContacts.prototype, "timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Message_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CampaignContacts.prototype, "messageId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Message_1.default, "messageId"),
    __metadata("design:type", Message_1.default)
], CampaignContacts.prototype, "message", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Campaign_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CampaignContacts.prototype, "campaignId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Campaign_1.default, "campaignId"),
    __metadata("design:type", Campaign_1.default)
], CampaignContacts.prototype, "campaign", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Contact_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], CampaignContacts.prototype, "contactId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Contact_1.default, "contactId"),
    __metadata("design:type", Contact_1.default)
], CampaignContacts.prototype, "contact", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], CampaignContacts.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], CampaignContacts.prototype, "updatedAt", void 0);
CampaignContacts = __decorate([
    sequelize_typescript_1.Table
], CampaignContacts);
exports.default = CampaignContacts;
//# sourceMappingURL=CampaignContacts.js.map