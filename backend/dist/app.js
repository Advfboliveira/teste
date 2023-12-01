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
// import "newrelic";
require("./bootstrap");
require("reflect-metadata");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const bull_board_1 = require("bull-board");
require("./database");
const process_1 = __importDefault(require("process"));
const upload_1 = __importDefault(require("./config/upload"));
const AppError_1 = __importDefault(require("./errors/AppError"));
const routes_1 = __importDefault(require("./routes"));
const logger_1 = require("./utils/logger");
const Queue_1 = __importDefault(require("./libs/Queue"));
const rabbitmq_server_1 = __importDefault(require("./libs/rabbitmq-server"));
const Consumer360_1 = __importDefault(require("./services/WABA360/Consumer360"));
const MessengerConsumer_1 = __importDefault(require("./services/MessengerChannelServices/MessengerConsumer"));
// import AMI from "./libs/AMI";
// const pino = require("pino-http")();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
// console.log(AMI);
// Sets all of the defaults, but overrides script-src
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "block-all-mixed-content": [],
        "font-src": ["'self'", "https:", "data:"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "upgrade-insecure-requests": [],
        // ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        scriptSrc: [
            "'self'",
            `*${process_1.default.env.FRONTEND_URL || "localhost: 3003"}`
            // "localhost"
        ],
        frameAncestors: [
            "'self'",
            `* ${process_1.default.env.FRONTEND_URL || "localhost: 3003"}`
        ]
    }
}));
Queue_1.default.process();
(0, bull_board_1.setQueues)(Queue_1.default.queues.map((q) => new bull_board_1.BullAdapter(q.bull)));
if (process_1.default.env.AMQP_URL) {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const rabbit = new rabbitmq_server_1.default(process_1.default.env.AMQP_URL || "");
        yield rabbit.start();
        logger_1.logger.info("Rabbit started", process_1.default.env.AMQP_URL);
        app.rabbit = rabbit;
    }))();
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const rabbitWhatsapp = new rabbitmq_server_1.default(process_1.default.env.AMQP_URL || "");
        yield rabbitWhatsapp.start();
        logger_1.logger.info("Rabbit started Whatsapp", process_1.default.env.AMQP_URL);
        global.rabbitWhatsapp = rabbitWhatsapp;
    }))();
    (0, Consumer360_1.default)();
    (0, MessengerConsumer_1.default)();
}
// if (process.env.NODE_ENV === "dev") {
// }
app.use("/admin/queues", bull_board_1.router);
// em produção estou usando assim:
// if (process.env.NODE_ENV === "prod") {
//   app.use(
//     (req, res, next) => {
//       next();
//     },
//     cors({
//       credentials: true,
//       origin: process.env.FRONTEND_URL
//     })
//   );
// } else {
// app.use((req, res, next) => {
//   next();
// }, cors());
// }
// app.use(cors({ origin: "*" }));
app.use((0, cors_1.default)());
// app.use(
//   cors({
//     credentials: true,
//     // origin: process.env.FRONTEND_URL
//     origin(origin, callback) {
//       // allow requests with no origin
//       // (like mobile apps or curl requests)
//       if (process.env.NODE_ENV === "dev") {
//         return callback(null, true);
//       }
//       const allowedOrigins = [
//         process.env.FRONTEND_URL || "localhost",
//         process.env.ADMIN_FRONTEND_URL || "localhost"
//       ];
//       if (!origin) return callback(null, true);
//       // eslint-disable-next-line consistent-return
//       const allowed = allowedOrigins.findIndex(
//         url => url.indexOf(origin) !== -1
//       );
//       if (allowed === -1) {
//         return callback(null, true);
//         // const msg =
//         //   "The CORS policy for this site does not " +
//         //   "allow access from the specified Origin.";
//         // return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     }
//   })
// );
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "6MB" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "6MB" }));
app.use("/public", express_1.default.static(upload_1.default.directory));
app.use(routes_1.default);
app.use((err, req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    if (err instanceof AppError_1.default) {
        if (err.statusCode === 403) {
            logger_1.logger.warn(err);
        }
        else {
            logger_1.logger.error(err);
        }
        return res.status(err.statusCode).json({ error: err.message });
    }
    logger_1.logger.error(err);
    return res.status(500).json({ error: `Internal server error: ${err}` });
}));
exports.default = app;
//# sourceMappingURL=app.js.map