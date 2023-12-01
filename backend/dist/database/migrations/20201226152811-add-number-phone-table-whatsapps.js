"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Whatsapps", "number", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn("Whatsapps", "phone", {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Whatsapps", "number")]);
        return Promise.all([queryInterface.removeColumn("Whatsapps", "phone")]);
    }
};
//# sourceMappingURL=20201226152811-add-number-phone-table-whatsapps.js.map