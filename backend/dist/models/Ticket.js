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
const date_fns_1 = require("date-fns");
const Contact_1 = __importDefault(require("./Contact"));
const Message_1 = __importDefault(require("./Message"));
const User_1 = __importDefault(require("./User"));
const Whatsapp_1 = __importDefault(require("./Whatsapp"));
const AutoReply_1 = __importDefault(require("./AutoReply"));
const StepsReply_1 = __importDefault(require("./StepsReply"));
const Queue_1 = __importDefault(require("./Queue"));
// import ShowStepAutoReplyMessageService from "../services/AutoReplyServices/ShowStepAutoReplyMessageService";
const Tenant_1 = __importDefault(require("./Tenant"));
const MessageOffLine_1 = __importDefault(require("./MessageOffLine"));
const ChatFlow_1 = __importDefault(require("./ChatFlow"));
let Ticket = class Ticket extends sequelize_typescript_1.Model {
    get protocol() {
        const date = this.getDataValue("createdAt");
        const formatDate = (0, date_fns_1.format)(new Date(date), "yyyyddMMHHmmss");
        const id = this.getDataValue("id");
        return `${formatDate}${id}`;
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: "pending" }),
    __metadata("design:type", String)
], Ticket.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "unreadMessages", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Ticket.prototype, "lastMessage", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Ticket.prototype, "channel", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Ticket.prototype, "answered", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Ticket.prototype, "isGroup", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Ticket.prototype, "isActiveDemand", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Ticket.prototype, "isFarewellMessage", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Ticket.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Ticket.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Ticket.prototype, "lastInteractionBot", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Ticket.prototype, "botRetries", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Ticket.prototype, "closedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Ticket.prototype, "lastMessageAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Ticket.prototype, "startedAttendanceAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], Ticket.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Contact_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "contactId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Contact_1.default),
    __metadata("design:type", Contact_1.default)
], Ticket.prototype, "contact", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Whatsapp_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "whatsappId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Whatsapp_1.default),
    __metadata("design:type", Whatsapp_1.default)
], Ticket.prototype, "whatsapp", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Message_1.default),
    __metadata("design:type", Array)
], Ticket.prototype, "messages", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => AutoReply_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "autoReplyId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => AutoReply_1.default),
    __metadata("design:type", AutoReply_1.default)
], Ticket.prototype, "autoReply", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => StepsReply_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "stepAutoReplyId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => StepsReply_1.default),
    __metadata("design:type", StepsReply_1.default)
], Ticket.prototype, "stepsReply", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => ChatFlow_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "chatFlowId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => ChatFlow_1.default),
    __metadata("design:type", ChatFlow_1.default)
], Ticket.prototype, "chatFlow", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Ticket.prototype, "stepChatFlow", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Queue_1.default),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "queueId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Queue_1.default),
    __metadata("design:type", Queue_1.default)
], Ticket.prototype, "queue", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Tenant_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ticket.prototype, "tenantId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", Object)
], Ticket.prototype, "isTransference", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", Object)
], Ticket.prototype, "isCreated", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)([]),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", Array)
], Ticket.prototype, "scheduledMessages", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Tenant_1.default),
    __metadata("design:type", Tenant_1.default)
], Ticket.prototype, "tenant", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => MessageOffLine_1.default),
    __metadata("design:type", Array)
], Ticket.prototype, "messagesOffLine", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    __metadata("design:type", Object)
], Ticket.prototype, "apiConfig", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Ticket.prototype, "protocol", null);
Ticket = __decorate([
    sequelize_typescript_1.Table
], Ticket);
exports.default = Ticket;
//# sourceMappingURL=Ticket.js.map