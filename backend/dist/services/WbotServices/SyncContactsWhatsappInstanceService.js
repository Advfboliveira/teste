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
const sequelize_1 = require("sequelize");
const wbot_1 = require("../../libs/wbot");
const Contact_1 = __importDefault(require("../../models/Contact"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const logger_1 = require("../../utils/logger");
const SyncContactsWhatsappInstanceService = (whatsappId, tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const wbot = (0, wbot_1.getWbot)(whatsappId);
    let contacts;
    try {
        contacts = yield wbot.getContacts();
    }
    catch (err) {
        logger_1.logger.error(`Could not get whatsapp contacts from phone. Check connection page. | Error: ${err}`);
    }
    if (!contacts) {
        throw new AppError_1.default("ERR_CONTACTS_NOT_EXISTS_WHATSAPP", 404);
    }
    try {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const dataArray = [];
        yield Promise.all(contacts.map(({ name, pushname, id, isGroup }) => __awaiter(void 0, void 0, void 0, function* () {
            if ((name || pushname) && !isGroup) {
                // const profilePicUrl = await wbot.getProfilePicUrl(`${number}@c.us`);
                const contactObj = { name: name || id.user, number: id.user, tenantId };
                dataArray.push(contactObj);
            }
        })));
        if (dataArray.length) {
            const d = new Date().toJSON();
            const query = `INSERT INTO "Contacts" ("number", "name", "tenantId", "createdAt", "updatedAt") VALUES
        ${dataArray
                .map((e) => {
                return `('${e.number}',
            '${e.name}',
            '${e.tenantId}',
            '${d}'::timestamp,
            '${d}'::timestamp)`;
            })
                .join(",")}
        ON CONFLICT ("number", "tenantId") DO UPDATE SET "name" = EXCLUDED."name", "number" = EXCLUDED."number";`;
            yield ((_a = Contact_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(query, {
                type: sequelize_1.QueryTypes.INSERT,
                logging: console.log
            }));
            // await Contact.bulkCreate(dataArray, {
            //   fields: ["number", "name", "tenantId"],
            //   updateOnDuplicate: ["number", "name"],
            //   logging: console.log
            // });
            // console.log("sql contact");
        }
    }
    catch (error) {
        console.error(error);
        throw new Error(error);
    }
});
exports.default = SyncContactsWhatsappInstanceService;
//# sourceMappingURL=SyncContactsWhatsappInstanceService.js.map