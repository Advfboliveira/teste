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
const User_1 = __importDefault(require("./User"));
const StepsReply_1 = __importDefault(require("./StepsReply"));
const Queue_1 = __importDefault(require("./Queue"));
let StepsReplyActions = class StepsReplyActions extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], StepsReplyActions.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => StepsReply_1.default),
    __metadata("design:type", Number)
], StepsReplyActions.prototype, "stepReplyId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => StepsReply_1.default, "stepReplyId"),
    __metadata("design:type", StepsReply_1.default)
], StepsReplyActions.prototype, "stepsReply", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], StepsReplyActions.prototype, "words", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], StepsReplyActions.prototype, "replyDefinition", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], StepsReplyActions.prototype, "action", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], StepsReplyActions.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], StepsReplyActions.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], StepsReplyActions.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DATE(6)),
    __metadata("design:type", Date)
], StepsReplyActions.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Queue_1.default),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], StepsReplyActions.prototype, "queueId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Queue_1.default),
    __metadata("design:type", Queue_1.default)
], StepsReplyActions.prototype, "queue", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], StepsReplyActions.prototype, "userIdDestination", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], StepsReplyActions.prototype, "userDestination", void 0);
__decorate([
    sequelize_typescript_1.Column,
    (0, sequelize_typescript_1.ForeignKey)(() => StepsReply_1.default),
    __metadata("design:type", Number)
], StepsReplyActions.prototype, "nextStepId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => StepsReply_1.default, "nextStepId"),
    __metadata("design:type", StepsReply_1.default)
], StepsReplyActions.prototype, "nextStep", void 0);
StepsReplyActions = __decorate([
    (0, sequelize_typescript_1.Table)({ freezeTableName: true })
], StepsReplyActions);
exports.default = StepsReplyActions;
//# sourceMappingURL=StepsReplyAction.js.map