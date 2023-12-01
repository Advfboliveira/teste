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
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const bull_1 = __importDefault(require("bull"));
const QueueListeners_1 = __importDefault(require("./QueueListeners"));
const jobs = __importStar(require("../jobs/Index"));
const queues = Object.values(jobs).map((job) => ({
    bull: new bull_1.default(job.key, {
        redis: {
            host: process.env.IO_REDIS_SERVER,
            port: +(process.env.IO_REDIS_PORT || "6379"),
            password: process.env.IO_REDIS_PASSWORD || undefined,
            db: 3
        }
    }),
    name: job.key,
    handle: job.handle,
    options: job.options
}));
exports.default = {
    queues,
    add(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = this.queues.find((q) => q.name === name);
            if (!queue) {
                throw new Error(`Queue ${name} not exists`);
            }
            if (Array.isArray(data)) {
                const parsedJobs = data.map((jobData) => {
                    return {
                        data: jobData,
                        opts: Object.assign(Object.assign({}, queue.options), jobData === null || jobData === void 0 ? void 0 : jobData.options)
                    };
                });
                return queue.bull.addBulk(parsedJobs);
            }
            return queue.bull.add(data, Object.assign(Object.assign({}, queue.options), data.options));
        });
    },
    process() {
        return this.queues.forEach(queue => {
            queue.bull.process(200, queue.handle);
            queue.bull
                .on("active", QueueListeners_1.default.onActive)
                .on("error", QueueListeners_1.default.onError)
                .on("waiting", QueueListeners_1.default.onWaiting)
                .on("completed", QueueListeners_1.default.onCompleted)
                .on("stalled", QueueListeners_1.default.onStalled)
                .on("failed", QueueListeners_1.default.onFailed)
                .on("cleaned", QueueListeners_1.default.onClean)
                .on("removed", QueueListeners_1.default.onRemoved);
        });
    }
};
//# sourceMappingURL=Queue.js.map