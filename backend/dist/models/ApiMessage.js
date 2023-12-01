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
const uuid_1 = require("uuid");
const Queue_1 = __importDefault(require("../libs/Queue"));
const Tenant_1 = __importDefault(require("./Tenant"));
const Whatsapp_1 = __importDefault(require("./Whatsapp"));
// @Table({ freezeTableName: true })
class ApiMessage extends sequelize_typescript_1.Model {
    static HookMessage(instance) {
        var _a;
        if ((_a = instance === null || instance === void 0 ? void 0 : instance.apiConfig) === null || _a === void 0 ? void 0 : _a.urlMessageStatus) {
            const payload = {
                ack: instance.ack,
                body: instance.body,
                messageId: instance.messageId,
                number: instance.number,
                externalKey: instance.externalKey,
                type: "hookMessageStatus",
                authToken: instance.authToken
            };
            Queue_1.default.add("WebHooksAPI", {
                url: instance.apiConfig.urlMessageStatus,
                type: payload.type,
                payload
            });
        }
    }
}
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ApiMessage.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Whatsapp_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ApiMessage.prototype, "sessionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Whatsapp_1.default),
    __metadata("design:type", Whatsapp_1.default)
], ApiMessage.prototype, "session", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(0),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ApiMessage.prototype, "ack", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ApiMessage.prototype, "messageId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ApiMessage.prototype, "body", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ApiMessage.prototype, "number", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ApiMessage.prototype, "mediaName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ApiMessage.prototype, "mediaUrl", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ApiMessage.prototype, "externalKey", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ApiMessage.prototype, "timestamp", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    __metadata("design:type", Object)
], ApiMessage.prototype, "messageWA", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    __metadata("design:type", Object)
], ApiMessage.prototype, "apiConfig", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], ApiMessage.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], ApiMessage.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Tenant_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ApiMessage.prototype, "tenantId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Tenant_1.default),
    __metadata("design:type", Tenant_1.default)
], ApiMessage.prototype, "tenant", void 0);
__decorate([
    sequelize_typescript_1.AfterCreate,
    sequelize_typescript_1.AfterUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApiMessage, "HookMessage", null);
exports.default = ApiMessage;
//# sourceMappingURL=ApiMessage.js.map