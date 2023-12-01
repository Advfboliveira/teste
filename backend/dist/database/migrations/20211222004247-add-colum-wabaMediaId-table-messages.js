"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Messages", "wabaMediaId", {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Messages", "wabaMediaId")
        ]);
    }
};
//# sourceMappingURL=20211222004247-add-colum-wabaMediaId-table-messages.js.map