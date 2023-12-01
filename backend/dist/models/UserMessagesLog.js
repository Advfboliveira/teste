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
const Message_1 = __importDefault(require("./Message"));
const Ticket_1 = __importDefault(require("./Ticket"));
const User_1 = __importDefault(require("./User"));
let UserMessagesLog = class UserMessagesLog extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserMessagesLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserMessagesLog.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], UserMessagesLog.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Message_1.default),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserMessagesLog.prototype, "messageId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Message_1.default, "messageId"),
    __metadata("design:type", Message_1.default)
], UserMessagesLog.prototype, "message", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Ticket_1.default),
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserMessagesLog.prototype, "ticketId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Ticket_1.default),
    __metadata("design:type", Ticket_1.default)
], UserMessagesLog.prototype, "ticket", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], UserMessagesLog.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], UserMessagesLog.prototype, "updatedAt", void 0);
UserMessagesLog = __decorate([
    (0, sequelize_typescript_1.Table)({ freezeTableName: true })
], UserMessagesLog);
exports.default = UserMessagesLog;
//# sourceMappingURL=UserMessagesLog.js.map