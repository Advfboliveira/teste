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
const IsContactTest = (celularContato, celularTeste, channel) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar se rotina em teste e contato informado é compatível
    if (channel !== "whatsapp")
        return false;
    if ((celularTeste && (celularContato === null || celularContato === void 0 ? void 0 : celularContato.indexOf(celularTeste.substr(1))) === -1) ||
        !celularContato) {
        return true;
    }
    return false;
});
exports.default = IsContactTest;
//# sourceMappingURL=IsContactTest.js.map