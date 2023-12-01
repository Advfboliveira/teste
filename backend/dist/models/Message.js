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
var Message_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const uuid_1 = require("uuid");
const Contact_1 = __importDefault(require("./Contact"));
const Tenant_1 = __importDefault(require("./Tenant"));
const Ticket_1 = __importDefault(require("./Ticket"));
const User_1 = __importDefault(require("./User"));
let Message = Message_1 = class Message extends sequelize_typescript_1.Model {
    get mediaName() {
        return this.getDataValue("mediaUrl");
    }
    get mediaUrl() {
        if (this.getDataValue("mediaUrl")) {
            const { BACKEND_URL } = process.env;
            const value = this.getDataValue("mediaUrl");
            return `${BACKEND_URL}:${process.env.PROXY_PORT}/public/${value}`;
        }
        return null;
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "messageId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "ack", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("pending", "sended", "received")),
    __metadata("design:type", String)
], Message.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Message.prototype, "wabaMediaId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Message.prototype, "read", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Message.prototype, "fromMe", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Message.prototype, "body", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Message.prototype, "mediaName", null);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Message.prototype, "mediaUrl", null);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "mediaType", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Message.prototype, "isDeleted", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], Message.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Message_1),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "quotedMsgId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Message_1, "quotedMsgId"),
    __metadata("design:type", Message)
], Message.prototype, "quotedMsg", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Ticket_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "ticketId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Ticket_1.default),
    __metadata("design:type", Ticket_1.default)
], Message.prototype, "ticket", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Contact_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "contactId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Contact_1.default, "contactId"),
    __metadata("design:type", Contact_1.default)
], Message.prototype, "contact", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BIGINT),
    __metadata("design:type", Number)
], Message.prototype, "timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], Message.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE),
    __metadata("design:type", Date)
], Message.prototype, "scheduleDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("campaign", "chat", "external", "schedule", "bot", "sync")),
    __metadata("design:type", String)
], Message.prototype, "sendType", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Tenant_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Message.prototype, "tenantId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Tenant_1.default),
    __metadata("design:type", Tenant_1.default)
], Message.prototype, "tenant", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Message.prototype, "idFront", void 0);
Message = Message_1 = __decorate([
    sequelize_typescript_1.Table
], Message);
// Message.sequelize?.define("Message", {
//   quotedMsgId: {
//     type: DataType.STRING,
//     references: {
//       model: Message,
//       key: "messageId"
//     }
//   }
// });
exports.default = Message;
//# sourceMappingURL=Message.js.map