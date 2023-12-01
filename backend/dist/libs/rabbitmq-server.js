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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-useless-constructor */
const amqplib_1 = require("amqplib");
const logger_1 = require("../utils/logger");
const sleepRandomTime_1 = require("../utils/sleepRandomTime");
class RabbitmqServer {
    // eslint-disable-next-line prettier/prettier
    constructor(uri) {
        this.uri = uri;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.conn = yield (0, amqplib_1.connect)(this.uri);
            this.channel = yield this.conn.createChannel();
            yield this.channel.assertQueue("waba360", { durable: true });
            yield this.channel.assertQueue("messenger", { durable: true });
        });
    }
    // async createExchange(name: string): Promise<void> {
    //   // const ex = this.channel.assertExchange(name, type, { durable: true });
    //   // console.log("Ex", ex);
    //   // await this.channel.bindQueue(name, name, name);
    // }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    publishInQueue(queue, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.assertQueue(queue, { durable: true });
            return this.channel.sendToQueue(queue, Buffer.from(message), {
                persistent: true
            });
        });
    }
    publishInExchange(exchange, routingKey, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.publish(exchange, routingKey, Buffer.from(message), {
                persistent: true
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    consumeWhatsapp(queue, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.channel.prefetch(10, false);
            yield this.channel.assertQueue(queue, { durable: true });
            this.channel.consume(queue, (message) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield callback(message);
                    // delay para processamento da mensagem
                    yield (0, sleepRandomTime_1.sleepRandomTime)({
                        minMilliseconds: Number(process.env.MIN_SLEEP_INTERVAL || 500),
                        maxMilliseconds: Number(process.env.MAX_SLEEP_INTERVAL || 2000)
                    });
                    this.channel.ack(message);
                    return;
                }
                catch (error) {
                    this.channel.nack(message);
                    logger_1.logger.error("consumeWhatsapp", error);
                    // this.channel.close();
                }
            }));
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    consume(queue, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.channel.consume(queue, (message) => {
                try {
                    callback(message);
                    this.channel.ack(message);
                    return;
                }
                catch (error) {
                    logger_1.logger.error(error);
                    // this.channel.close();
                }
            });
        });
    }
}
exports.default = RabbitmqServer;
//# sourceMappingURL=rabbitmq-server.js.map