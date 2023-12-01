"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Whatsapps", "instagramUser", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn("Whatsapps", "instagramKey", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Whatsapps", "instagramUser"),
            queryInterface.removeColumn("Whatsapps", "instagramKey")
        ]);
    }
};
//# sourceMappingURL=20211209174149-add-columns-instagramUser_instagramPassword-table-Whatsapps.js.map