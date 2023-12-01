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
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const AutoReplyController = __importStar(require("../controllers/AutoReplyController"));
const StepsReplyController = __importStar(require("../controllers/StepsReplyController"));
const StepsReplyActionController = __importStar(require("../controllers/StepsReplyActionController"));
const autoReplyRoutes = express_1.default.Router();
autoReplyRoutes.post("/auto-reply", isAuth_1.default, AutoReplyController.store);
autoReplyRoutes.get("/auto-reply", isAuth_1.default, AutoReplyController.index);
autoReplyRoutes.put("/auto-reply/:autoReplyId", isAuth_1.default, AutoReplyController.update);
autoReplyRoutes.delete("/auto-reply/:autoReplyId", isAuth_1.default, AutoReplyController.remove);
autoReplyRoutes.post("/auto-reply/:idAutoReply/steps", isAuth_1.default, StepsReplyController.store);
autoReplyRoutes.put("/auto-reply/:idAutoReply/steps/:stepsReplyId", isAuth_1.default, StepsReplyController.update);
autoReplyRoutes.delete("/auto-reply/:idAutoReply/steps/:stepsReplyId", isAuth_1.default, StepsReplyController.remove);
autoReplyRoutes.post("/auto-reply-action", isAuth_1.default, StepsReplyActionController.store);
autoReplyRoutes.put("/auto-reply-action/:stepsReplyActionId", isAuth_1.default, StepsReplyActionController.update);
autoReplyRoutes.delete("/auto-reply-action/:stepsReplyActionId", isAuth_1.default, StepsReplyActionController.remove);
exports.default = autoReplyRoutes;
//# sourceMappingURL=autoReplyRoutes.js.map