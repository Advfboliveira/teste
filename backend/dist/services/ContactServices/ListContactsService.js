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
const Contact_1 = __importDefault(require("../../models/Contact"));
const logger_1 = require("../../utils/logger");
const ListContactsService = ({ searchParam = "", pageNumber = "1", tenantId, profile, userId }) => __awaiter(void 0, void 0, void 0, function* () {
    const whereCondition = {
        tenantId,
        [sequelize_1.Op.or]: [
            {
                name: sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("LOWER", sequelize_1.Sequelize.col("Contact.name")), "LIKE", `%${searchParam.toLowerCase().trim()}%`)
            },
            { number: { [sequelize_1.Op.like]: `%${searchParam.toLowerCase().trim()}%` } }
        ]
    };
    const limit = 40;
    const offset = limit * (+pageNumber - 1);
    /* const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["name", "ASC"]],
      include: [
        {
          model: User,
          required: false
        }
      ]
      // subQuery: true
    }); */
    // let whereTicket = {};
    logger_1.logger.info(`Pesquisando contatos para o perfil ${profile}`);
    // if (profile !== "admin") {
    //   const QueuesWhere = await UsersQueues.findAll({
    //     where: { userId }
    //   });
    //   let concatQueues: number[] = [];
    //   QueuesWhere.forEach(queueNow => {
    //     const { queueId } = queueNow;
    //     concatQueues = [...concatQueues, queueId];
    //   });
    //   whereTicket = { queueId: concatQueues };
    // }
    const { count, rows: contacts } = yield Contact_1.default.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        order: [["name", "ASC"]],
        include: [
            // {
            //   model: Ticket,
            //   // required: true,
            //   where: whereTicket,
            //   include: [
            //     {
            //       model: User,
            //       required: false
            //     }
            //   ]
            // },
            {
                association: "wallets",
                attributes: ["name"],
                required: profile !== "admin",
                where: profile !== "admin" ? { id: userId } : {}
            }
        ]
        // subQuery: true
    });
    const hasMore = count > offset + contacts.length;
    return {
        contacts,
        count,
        hasMore
    };
});
exports.default = ListContactsService;
//# sourceMappingURL=ListContactsService.js.map