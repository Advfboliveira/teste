"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.removeConstraint("Settings", "Settings_pkey")
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.addConstraint("Settings", ["key"], {
                name: "Settings_pkey",
                type: "unique"
            })
        ]);
    }
};
//# sourceMappingURL=20210202163058-delete-constraite-primarykey-settings.js.map