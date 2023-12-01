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
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = __importDefault(require("../models/User"));
const Setting_1 = __importDefault(require("../models/Setting"));
const Contact_1 = __importDefault(require("../models/Contact"));
const Ticket_1 = __importDefault(require("../models/Ticket"));
const Whatsapp_1 = __importDefault(require("../models/Whatsapp"));
const ContactCustomField_1 = __importDefault(require("../models/ContactCustomField"));
const Message_1 = __importDefault(require("../models/Message"));
const MessageOffLine_1 = __importDefault(require("../models/MessageOffLine"));
const AutoReply_1 = __importDefault(require("../models/AutoReply"));
const StepsReply_1 = __importDefault(require("../models/StepsReply"));
const StepsReplyAction_1 = __importDefault(require("../models/StepsReplyAction"));
const Queue_1 = __importDefault(require("../models/Queue"));
const UsersQueues_1 = __importDefault(require("../models/UsersQueues"));
const Tenant_1 = __importDefault(require("../models/Tenant"));
const AutoReplyLogs_1 = __importDefault(require("../models/AutoReplyLogs"));
const UserMessagesLog_1 = __importDefault(require("../models/UserMessagesLog"));
const FastReply_1 = __importDefault(require("../models/FastReply"));
const Tag_1 = __importDefault(require("../models/Tag"));
const ContactWallet_1 = __importDefault(require("../models/ContactWallet"));
const ContactTag_1 = __importDefault(require("../models/ContactTag"));
const Campaign_1 = __importDefault(require("../models/Campaign"));
const CampaignContacts_1 = __importDefault(require("../models/CampaignContacts"));
const ApiConfig_1 = __importDefault(require("../models/ApiConfig"));
const ApiMessage_1 = __importDefault(require("../models/ApiMessage"));
const LogTicket_1 = __importDefault(require("../models/LogTicket"));
const ChatFlow_1 = __importDefault(require("../models/ChatFlow"));
const QueueJobs = __importStar(require("../libs/Queue"));
const logger_1 = require("../utils/logger");
// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";
const sequelize = new sequelize_typescript_1.Sequelize(dbConfig);
const models = [
    User_1.default,
    Contact_1.default,
    Ticket_1.default,
    Message_1.default,
    MessageOffLine_1.default,
    Whatsapp_1.default,
    ContactCustomField_1.default,
    Setting_1.default,
    AutoReply_1.default,
    StepsReply_1.default,
    StepsReplyAction_1.default,
    Queue_1.default,
    UsersQueues_1.default,
    Tenant_1.default,
    AutoReplyLogs_1.default,
    UserMessagesLog_1.default,
    FastReply_1.default,
    Tag_1.default,
    ContactWallet_1.default,
    ContactTag_1.default,
    Campaign_1.default,
    CampaignContacts_1.default,
    ApiConfig_1.default,
    ApiMessage_1.default,
    LogTicket_1.default,
    ChatFlow_1.default
];
sequelize.addModels(models);
// const startLoopDb = () => {
//   // eslint-disable-next-line no-underscore-dangle
//   global._loopDb = setInterval(() => {
//     FindUpdateTicketsInactiveChatBot();
//     console.log("DATABASE CONNECT");
//   }, 60000);
// };
sequelize.afterConnect(() => {
    logger_1.logger.info("DATABASE CONNECT");
    QueueJobs.default.add("VerifyTicketsChatBotInactives", {});
    QueueJobs.default.add("SendMessageSchenduled", {});
});
sequelize.afterDisconnect(() => {
    logger_1.logger.info("DATABASE DISCONNECT");
    // eslint-disable-next-line no-underscore-dangle
    // clearInterval(global._loopDb);
});
exports.default = sequelize;
//# sourceMappingURL=index.js.map