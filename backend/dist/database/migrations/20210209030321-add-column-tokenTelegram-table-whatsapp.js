"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Whatsapps", "tokenTelegram", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Whatsapps", "tokenTelegram");
    }
};
//# sourceMappingURL=20210209030321-add-column-tokenTelegram-table-whatsapp.js.map