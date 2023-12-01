"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const isAPIAuth_1 = __importDefault(require("../middleware/isAPIAuth"));
const upload_1 = __importDefault(require("../config/upload"));
const APIExternalController = __importStar(require("../controllers/APIExternalController"));
const apiExternalRoute = express_1.default.Router();
const upload = (0, multer_1.default)(Object.assign(Object.assign({}, upload_1.default), { limits: {
        files: 1,
        fileSize: 1024 * 1024 * 5 // 5 MB (max file size)
    } }));
apiExternalRoute.post("/v1/api/external/:apiId", isAPIAuth_1.default, upload.single("media"), APIExternalController.sendMessageAPI);
apiExternalRoute.post("/v1/api/external/:apiId/start-session", isAPIAuth_1.default, APIExternalController.startSession);
exports.default = apiExternalRoute;
//# sourceMappingURL=apiExternalRoutes.js.map