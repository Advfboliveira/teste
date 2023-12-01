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
/* eslint-disable no-restricted-syntax */
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = __importDefault(require("./User"));
const Tenant_1 = __importDefault(require("./Tenant"));
let ChatFlow = class ChatFlow extends sequelize_typescript_1.Model {
    get flow() {
        const flow = this.getDataValue("flow");
        if (flow) {
            for (const node of flow.nodeList) {
                if (node.type === "node") {
                    for (const item of node.interactions) {
                        if (item.type === "MediaField" && item.data.mediaUrl) {
                            const { BACKEND_URL, PROXY_PORT } = process.env;
                            const file = item.data.mediaUrl;
                            item.data.fileName = file;
                            item.data.mediaUrl = `${BACKEND_URL}:${PROXY_PORT}/public/${file}`;
                        }
                    }
                }
            }
            return flow;
        }
        return {};
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ChatFlow.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ChatFlow.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)({}),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ChatFlow.prototype, "flow", null);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ChatFlow.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ChatFlow.prototype, "isDeleted", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], ChatFlow.prototype, "celularTeste", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ChatFlow.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], ChatFlow.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Tenant_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ChatFlow.prototype, "tenantId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Tenant_1.default),
    __metadata("design:type", Tenant_1.default)
], ChatFlow.prototype, "tenant", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], ChatFlow.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], ChatFlow.prototype, "updatedAt", void 0);
ChatFlow = __decorate([
    (0, sequelize_typescript_1.Table)({ freezeTableName: true })
], ChatFlow);
exports.default = ChatFlow;
//# sourceMappingURL=ChatFlow.js.map