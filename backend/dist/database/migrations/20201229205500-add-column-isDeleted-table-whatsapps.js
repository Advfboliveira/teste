"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Whatsapps", "isDeleted", {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Whatsapps", "isDeleted")]);
    }
};
//# sourceMappingURL=20201229205500-add-column-isDeleted-table-whatsapps.js.map