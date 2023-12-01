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
const CampaignContacts_1 = __importDefault(require("./CampaignContacts"));
const Tenant_1 = __importDefault(require("./Tenant"));
const User_1 = __importDefault(require("./User"));
const Whatsapp_1 = __importDefault(require("./Whatsapp"));
let Campaign = class Campaign extends sequelize_typescript_1.Model {
    get mediaUrl() {
        const value = this.getDataValue("mediaUrl");
        if (value && value !== "null") {
            const { BACKEND_URL } = process.env;
            return `${BACKEND_URL}:${process.env.PROXY_PORT}/public/${value}`;
        }
        return null;
    }
    static updatedInstances(instances) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(instances))
                return instances;
            const newInstances = yield Promise.all(
            // eslint-disable-next-line consistent-return
            instances.map((instance) => __awaiter(this, void 0, void 0, function* () {
                if (!["pending", "finished", "canceled"].includes(instance.status)) {
                    const pendentesEntrega = +instance.dataValues.pendentesEntrega;
                    const pendentesEnvio = +instance.dataValues.pendentesEnvio;
                    const recebidas = +instance.dataValues.recebidas;
                    const lidas = +instance.dataValues.lidas;
                    const contactsCount = +instance.dataValues.contactsCount;
                    const totalTransacionado = pendentesEntrega + pendentesEnvio + recebidas + lidas;
                    if (instance.status === "scheduled" &&
                        contactsCount === pendentesEnvio) {
                        return instance;
                    }
                    if (contactsCount !== totalTransacionado) {
                        instance.status = "processing";
                        yield instance.update({ status: "processing" });
                    }
                    if (contactsCount === totalTransacionado) {
                        instance.status = "finished";
                        yield instance.update({ status: "finished" });
                    }
                    return instance;
                }
                // ("pending", "scheduled", "processing", "canceled", "finished")
            })));
            return newInstances;
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Campaign.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Campaign.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], Campaign.prototype, "start", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)("pending"),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("pending", "scheduled", "processing", "canceled", "finished")),
    __metadata("design:type", String)
], Campaign.prototype, "status", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Campaign.prototype, "message1", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Campaign.prototype, "message2", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Campaign.prototype, "message3", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Campaign.prototype, "mediaUrl", null);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Campaign.prototype, "mediaType", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Campaign.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], Campaign.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Whatsapp_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Campaign.prototype, "sessionId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Whatsapp_1.default),
    __metadata("design:type", Whatsapp_1.default)
], Campaign.prototype, "session", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Tenant_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Campaign.prototype, "tenantId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Tenant_1.default),
    __metadata("design:type", Tenant_1.default)
], Campaign.prototype, "tenant", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => CampaignContacts_1.default),
    __metadata("design:type", Array)
], Campaign.prototype, "campaignContacts", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], Campaign.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], Campaign.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.AfterFind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Campaign, "updatedInstances", null);
Campaign = __decorate([
    sequelize_typescript_1.Table
], Campaign);
exports.default = Campaign;
//# sourceMappingURL=Campaign.js.map