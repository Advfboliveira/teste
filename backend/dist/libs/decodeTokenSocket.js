"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../config/auth"));
const logger_1 = require("../utils/logger");
const decode = (token) => {
    const validation = {
        isValid: false,
        data: {
            id: "",
            profile: "",
            tenantId: 0
        }
    };
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, auth_1.default.secret);
        const { id, profile, tenantId } = decoded;
        validation.isValid = true;
        validation.data = {
            id,
            profile,
            tenantId
        };
    }
    catch (err) {
        logger_1.logger.error(err);
    }
    return validation;
};
exports.default = decode;
//# sourceMappingURL=decodeTokenSocket.js.map