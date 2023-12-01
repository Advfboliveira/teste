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
const date_fns_1 = require("date-fns");
const ShowBusinessHoursAndMessageService_1 = __importDefault(require("../../TenantServices/ShowBusinessHoursAndMessageService"));
const CreateMessageSystemService_1 = __importDefault(require("../../MessageServices/CreateMessageSystemService"));
// import { sleepRandomTime } from "../../../utils/sleepRandomTime";
const verifyBusinessHours = (msg, ticket) => __awaiter(void 0, void 0, void 0, function* () {
    let isBusinessHours = true;
    // Considerar o envio da mensagem de ausência se:
    // Ticket não está no fluxo de autoresposta
    // Ticket não estiver fechado
    // Mensagem não enviada por usuário via sistema
    // Não é um ticket referente a um grupo do whatsapp
    if (ticket.status !== "closed" && !msg.fromMe && !ticket.isGroup) {
        const tenant = yield (0, ShowBusinessHoursAndMessageService_1.default)({
            tenantId: ticket.tenantId
        });
        const dateMsg = (0, date_fns_1.fromUnixTime)(msg.timestamp);
        const businessDay = tenant.businessHours.find((d) => d.day === dateMsg.getDay());
        // Não existir configuração para a data, não deverá enviar
        // mensagem de ausencia
        if (!businessDay)
            return isBusinessHours;
        // Se o tipo for "O" open - significa que o estabelecimento
        // funciona o dia inteiro e deve desconsiderar o envio de mensagem de ausência
        if (businessDay.type === "O")
            return isBusinessHours;
        // verificar se data da mensagem está dendo do primerio período de tempo
        const isHoursFistInterval = (0, date_fns_1.isWithinInterval)(dateMsg, {
            start: (0, date_fns_1.parse)(businessDay.hr1, "HH:mm", new Date()),
            end: (0, date_fns_1.parse)(businessDay.hr2, "HH:mm", new Date())
        });
        // verificar se data da mensagem está dendo do segundo período de tempo
        const isHoursLastInterval = (0, date_fns_1.isWithinInterval)(dateMsg, {
            start: (0, date_fns_1.parse)(businessDay.hr3, "HH:mm", new Date()),
            end: (0, date_fns_1.parse)(businessDay.hr4, "HH:mm", new Date())
        });
        // se o tipo for C - Closed significa que o estabelecimento está
        // fechado o dia inteiro ou se a data/hora da mensagens estiver
        // fora dos horários de funcionamento da empresa, a mensagem deverá
        // ser enviada.
        if (businessDay.type === "C" ||
            (!isHoursFistInterval && !isHoursLastInterval)) {
            // await sleepRandomTime({
            //   minMilliseconds: +(process.env.MIN_SLEEP_BUSINESS_HOURS || 10000),
            //   maxMilliseconds: +(process.env.MAX_SLEEP_BUSINESS_HOURS || 20000)
            // });
            // await SendWhatsAppMessage({
            //   body: tenant.messageBusinessHours,
            //   ticket,
            //   quotedMsg: undefined
            // });
            isBusinessHours = false;
            const messageData = {
                body: tenant.messageBusinessHours,
                fromMe: true,
                read: true,
                sendType: "bot",
                tenantId: ticket.tenantId
            };
            yield (0, CreateMessageSystemService_1.default)({
                msg: messageData,
                tenantId: ticket.tenantId,
                ticket,
                sendType: messageData.sendType,
                status: "pending"
            });
        }
    }
    return isBusinessHours;
});
exports.default = verifyBusinessHours;
//# sourceMappingURL=VerifyBusinessHours.js.map