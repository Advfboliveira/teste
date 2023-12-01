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
const Contact_1 = __importDefault(require("./Contact"));
const Message_1 = __importDefault(require("./Message"));
const Ticket_1 = __importDefault(require("./Ticket"));
const User_1 = __importDefault(require("./User"));
let MessagesOffLine = class MessagesOffLine extends sequelize_typescript_1.Model {
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
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], MessagesOffLine.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], MessagesOffLine.prototype, "ack", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], MessagesOffLine.prototype, "read", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], MessagesOffLine.prototype, "fromMe", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], MessagesOffLine.prototype, "body", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MessagesOffLine.prototype, "mediaName", null);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], MessagesOffLine.prototype, "mediaUrl", null);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], MessagesOffLine.prototype, "mediaType", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], MessagesOffLine.prototype, "isDeleted", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], MessagesOffLine.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], MessagesOffLine.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Message_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], MessagesOffLine.prototype, "quotedMsgId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Message_1.default, "quotedMsgId"),
    __metadata("design:type", Message_1.default)
], MessagesOffLine.prototype, "quotedMsg", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Ticket_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], MessagesOffLine.prototype, "ticketId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Ticket_1.default),
    __metadata("design:type", Ticket_1.default)
], MessagesOffLine.prototype, "ticket", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Contact_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], MessagesOffLine.prototype, "contactId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Contact_1.default, "contactId"),
    __metadata("design:type", Contact_1.default)
], MessagesOffLine.prototype, "contact", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], MessagesOffLine.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], MessagesOffLine.prototype, "user", void 0);
MessagesOffLine = __decorate([
    (0, sequelize_typescript_1.Table)({ freezeTableName: true })
], MessagesOffLine);
exports.default = MessagesOffLine;
//# sourceMappingURL=MessageOffLine.js.map