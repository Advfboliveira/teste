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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-restricted-syntax */
// import AppError from "../../errors/AppError";
const util_1 = require("util");
const path_1 = require("path");
const fs_1 = require("fs");
const ChatFlow_1 = __importDefault(require("../../models/ChatFlow"));
// import { logger } from "../../utils/logger";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const CreateChatFlowService = ({ flow, userId, tenantId, name, isActive }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    try {
        for (var _g = true, _h = __asyncValues(flow.nodeList), _j; _j = yield _h.next(), _a = _j.done, !_a;) {
            _c = _j.value;
            _g = false;
            try {
                const node = _c;
                if (node.type === "node") {
                    try {
                        for (var _k = true, _l = (e_2 = void 0, __asyncValues(node.interactions)), _m; _m = yield _l.next(), _d = _m.done, !_d;) {
                            _f = _m.value;
                            _k = false;
                            try {
                                const item = _f;
                                if (item.type === "MediaField" && item.data.media) {
                                    const newName = `${new Date().getTime()}-${item.data.name}`;
                                    yield writeFileAsync((0, path_1.join)(__dirname, "..", "..", "..", "public", newName), item.data.media.split("base64")[1], "base64");
                                    delete item.data.media;
                                    item.data.fileName = item.data.name;
                                    item.data.mediaUrl = newName;
                                }
                            }
                            finally {
                                _k = true;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_k && !_d && (_e = _l.return)) yield _e.call(_l);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            finally {
                _g = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_g && !_a && (_b = _h.return)) yield _b.call(_h);
        }
        finally { if (e_1) throw e_1.error; }
    }
    const chatFlow = yield ChatFlow_1.default.create({
        flow,
        userId,
        tenantId,
        name,
        isActive
    });
    return chatFlow;
});
exports.default = CreateChatFlowService;
//# sourceMappingURL=CreateChatFlowService.js.map