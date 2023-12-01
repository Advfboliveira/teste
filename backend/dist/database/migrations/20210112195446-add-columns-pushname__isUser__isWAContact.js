"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Contacts", "pushname", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn("Contacts", "isUser", {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn("Contacts", "isWAContact", {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Contacts", "pushname"),
            queryInterface.removeColumn("Contacts", "isUser"),
            queryInterface.removeColumn("Contacts", "isWAContact")
        ]);
    }
};
//# sourceMappingURL=20210112195446-add-columns-pushname__isUser__isWAContact.js.map