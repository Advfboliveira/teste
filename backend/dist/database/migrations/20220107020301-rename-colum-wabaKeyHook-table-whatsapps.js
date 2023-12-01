"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.renameColumn("Whatsapps", "wabaKeyHook", "tokenHook")
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.renameColumn("Whatsapps", "tokenHook", "wabaKeyHook")
        ]);
    }
};
//# sourceMappingURL=20220107020301-rename-colum-wabaKeyHook-table-whatsapps.js.map