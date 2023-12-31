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
const faker_1 = __importDefault(require("faker"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const AuthUserSerice_1 = __importDefault(require("../../../services/UserServices/AuthUserSerice"));
const CreateUserService_1 = __importDefault(require("../../../services/UserServices/CreateUserService"));
const database_1 = require("../../utils/database");
describe("Auth", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, database_1.truncate)();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, database_1.truncate)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, database_1.disconnect)();
    }));
    it("should be able to login with an existing user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email: "mail@test.com",
            password: "hardpassword",
            tenantId: 1
        });
        const response = yield (0, AuthUserSerice_1.default)({
            email: "mail@test.com",
            password: "hardpassword"
        });
        expect(response).toHaveProperty("token");
    }));
    it("should not be able to login with not registered email", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, AuthUserSerice_1.default)({
                email: faker_1.default.internet.email(),
                password: faker_1.default.internet.password()
            });
        }
        catch (err) {
            expect(err).toBeInstanceOf(AppError_1.default);
            expect(err.statusCode).toBe(401);
            expect(err.message).toBe("ERR_INVALID_CREDENTIALS");
        }
    }));
    it("should not be able to login with incorret password", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email: "mail@test.com",
            password: "hardpassword",
            tenantId: 1
        });
        try {
            yield (0, AuthUserSerice_1.default)({
                email: "mail@test.com",
                password: faker_1.default.internet.password()
            });
        }
        catch (err) {
            expect(err).toBeInstanceOf(AppError_1.default);
            expect(err.statusCode).toBe(401);
            expect(err.message).toBe("ERR_INVALID_CREDENTIALS");
        }
    }));
});
//# sourceMappingURL=AuthUserService.spec.js.map