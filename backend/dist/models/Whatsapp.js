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
const jsonwebtoken_1 = require("jsonwebtoken");
const sequelize_typescript_1 = require("sequelize-typescript");
const webHooks_dev_json_1 = __importDefault(require("../config/webHooks.dev.json"));
const auth_1 = __importDefault(require("../config/auth"));
const Queue_1 = __importDefault(require("../libs/Queue"));
const ApiConfig_1 = __importDefault(require("./ApiConfig"));
const Tenant_1 = __importDefault(require("./Tenant"));
const Ticket_1 = __importDefault(require("./Ticket"));
// @DefaultScope(() => ({
//   where: { isDeleted: false }
// }))
let Whatsapp = class Whatsapp extends sequelize_typescript_1.Model {
    get UrlWabaWebHook() {
        const key = this.getDataValue("tokenHook");
        const wabaBSP = this.getDataValue("wabaBSP");
        let BACKEND_URL;
        BACKEND_URL = process.env.BACKEND_URL;
        if (process.env.NODE_ENV === "dev") {
            BACKEND_URL = webHooks_dev_json_1.default.urlWabahooks;
        }
        return `${BACKEND_URL}/wabahooks/${wabaBSP}/${key}`;
    }
    get UrlMessengerWebHook() {
        const key = this.getDataValue("tokenHook");
        let BACKEND_URL;
        BACKEND_URL = process.env.BACKEND_URL;
        if (process.env.NODE_ENV === "dev") {
            BACKEND_URL = webHooks_dev_json_1.default.urlWabahooks;
        }
        return `${BACKEND_URL}/fb-messenger-hooks/${key}`;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static HookStatus(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, name, qrcode, number, tenantId, id: sessionId } = instance;
            const payload = {
                name,
                number,
                status,
                qrcode,
                timestamp: Date.now(),
                type: "hookSessionStatus"
            };
            const apiConfig = yield ApiConfig_1.default.findAll({
                where: { tenantId, sessionId }
            });
            if (!apiConfig)
                return;
            yield Promise.all(apiConfig.map((api) => {
                if (api.urlServiceStatus) {
                    if (api.authToken) {
                        payload.authToken = api.authToken;
                    }
                    return Queue_1.default.add("WebHooksAPI", {
                        url: api.urlServiceStatus,
                        type: payload.type,
                        payload
                    });
                }
            }));
        });
    }
    static CreateTokenWebHook(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const { secret } = auth_1.default;
            if (!(instance === null || instance === void 0 ? void 0 : instance.tokenHook) &&
                (instance.type === "waba" || instance.type === "messenger")) {
                const tokenHook = (0, jsonwebtoken_1.sign)({
                    tenantId: instance.tenantId,
                    whatsappId: instance.id
                    // wabaBSP: instance.wabaBSP
                }, secret, {
                    expiresIn: "10000d"
                });
                instance.tokenHook = tokenHook;
            }
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Whatsapp.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Whatsapp.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Whatsapp.prototype, "session", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Whatsapp.prototype, "qrcode", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Whatsapp.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Whatsapp.prototype, "battery", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Whatsapp.prototype, "plugged", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(true),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Whatsapp.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Whatsapp.prototype, "isDeleted", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Whatsapp.prototype, "retries", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Whatsapp.prototype, "isDefault", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Whatsapp.prototype, "tokenTelegram", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Whatsapp.prototype, "instagramUser", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Whatsapp.prototype, "instagramKey", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Whatsapp.prototype, "fbPageId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    __metadata("design:type", Object)
], Whatsapp.prototype, "fbObject", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)("whatsapp"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("whatsapp", "telegram", "instagram", "messenger")),
    __metadata("design:type", String)
], Whatsapp.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Whatsapp.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Whatsapp.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Whatsapp.prototype, "number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSONB)
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    __metadata("design:type", Object)
], Whatsapp.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Ticket_1.default),
    __metadata("design:type", Array)
], Whatsapp.prototype, "tickets", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Tenant_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Whatsapp.prototype, "tenantId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Tenant_1.default),
    __metadata("design:type", Tenant_1.default)
], Whatsapp.prototype, "tenant", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("360", "gupshup")),
    __metadata("design:type", String)
], Whatsapp.prototype, "wabaBSP", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Whatsapp.prototype, "tokenAPI", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Whatsapp.prototype, "tokenHook", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    sequelize_typescript_1.AllowNull,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], Whatsapp.prototype, "farewellMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Whatsapp.prototype, "UrlWabaWebHook", null);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.VIRTUAL),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Whatsapp.prototype, "UrlMessengerWebHook", null);
__decorate([
    sequelize_typescript_1.AfterUpdate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Whatsapp, "HookStatus", null);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Whatsapp]),
    __metadata("design:returntype", Promise)
], Whatsapp, "CreateTokenWebHook", null);
Whatsapp = __decorate([
    sequelize_typescript_1.Table
], Whatsapp);
exports.default = Whatsapp;
//# sourceMappingURL=Whatsapp.js.map