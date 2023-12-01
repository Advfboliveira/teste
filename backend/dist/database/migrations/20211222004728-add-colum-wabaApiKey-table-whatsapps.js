"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Whatsapps", "tokenAPI", {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn("Whatsapps", "wabaBSP", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn("Whatsapps", "wabaKeyHook", {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Whatsapps", "tokenAPI"),
            queryInterface.removeColumn("Whatsapps", "wabaBSP"),
            queryInterface.removeColumn("Whatsapps", "wabaKeyHook")
        ]);
    }
};
//# sourceMappingURL=20211222004728-add-colum-wabaApiKey-table-whatsapps.js.map