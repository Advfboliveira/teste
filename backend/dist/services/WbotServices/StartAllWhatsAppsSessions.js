"use strict";
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
exports.StartAllWhatsAppsSessions = void 0;
const sequelize_1 = require("sequelize");
// import { initInstaBot } from "../../libs/InstaBot";
const Whatsapp_1 = __importDefault(require("../../models/Whatsapp"));
const StartInstaBotSession_1 = require("../InstagramBotServices/StartInstaBotSession");
const StartMessengerBot_1 = require("../MessengerChannelServices/StartMessengerBot");
const StartTbotSession_1 = require("../TbotServices/StartTbotSession");
const StartWaba360_1 = require("../WABA360/StartWaba360");
const StartWhatsAppSession_1 = require("./StartWhatsAppSession");
// import { StartTbotSession } from "../TbotServices/StartTbotSession";
const StartAllWhatsAppsSessions = () => __awaiter(void 0, void 0, void 0, function* () {
    const whatsapps = yield Whatsapp_1.default.findAll({
        where: {
            [sequelize_1.Op.or]: [
                {
                    [sequelize_1.Op.and]: {
                        type: {
                            [sequelize_1.Op.in]: ["instagram", "telegram", "waba", "messenger"]
                        },
                        status: {
                            [sequelize_1.Op.notIn]: ["DISCONNECTED"]
                        }
                    }
                },
                {
                    [sequelize_1.Op.and]: {
                        type: "whatsapp"
                    },
                    status: {
                        [sequelize_1.Op.notIn]: ["DISCONNECTED", "qrcode"]
                        // "DISCONNECTED"
                    }
                }
            ],
            isActive: true
        }
    });
    const whatsappSessions = whatsapps.filter(w => w.type === "whatsapp");
    const telegramSessions = whatsapps.filter(w => w.type === "telegram" && !!w.tokenTelegram);
    const instagramSessions = whatsapps.filter(w => w.type === "instagram");
    const waba360Sessions = whatsapps.filter(w => w.type === "waba");
    const messengerSessions = whatsapps.filter(w => w.type === "messenger");
    if (whatsappSessions.length > 0) {
        whatsappSessions.forEach(whatsapp => {
            (0, StartWhatsAppSession_1.StartWhatsAppSession)(whatsapp);
        });
    }
    if (telegramSessions.length > 0) {
        telegramSessions.forEach(whatsapp => {
            (0, StartTbotSession_1.StartTbotSession)(whatsapp);
        });
    }
    if (waba360Sessions.length > 0) {
        waba360Sessions.forEach(channel => {
            if (channel.tokenAPI && channel.wabaBSP === "360") {
                (0, StartWaba360_1.StartWaba360)(channel);
            }
        });
    }
    if (instagramSessions.length > 0) {
        instagramSessions.forEach(channel => {
            if (channel.instagramKey) {
                (0, StartInstaBotSession_1.StartInstaBotSession)(channel);
            }
        });
    }
    if (messengerSessions.length > 0) {
        messengerSessions.forEach(channel => {
            if (channel.tokenAPI) {
                (0, StartMessengerBot_1.StartMessengerBot)(channel);
            }
        });
    }
});
exports.StartAllWhatsAppsSessions = StartAllWhatsAppsSessions;
//# sourceMappingURL=StartAllWhatsAppsSessions.js.map