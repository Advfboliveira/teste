"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const date_fns_1 = require("date-fns");
const publicFolder = path_1.default.resolve(__dirname, "..", "..", "public");
exports.default = {
    directory: publicFolder,
    storage: multer_1.default.diskStorage({
        destination: publicFolder,
        filename(req, file, cb) {
            const { originalname } = file;
            const ext = path_1.default.extname(originalname);
            const name = originalname.replace(ext, "");
            const date = (0, date_fns_1.format)(new Date(), "ddMMyyyyHHmmssSSS");
            const fileName = `${name}_${date}${ext}`;
            return cb(null, fileName);
        }
    })
};
//# sourceMappingURL=upload.js.map