"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Tickets", "closedAt")]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "closedAt", {
                type: sequelize_1.DataTypes.DATE(),
                allowNull: true,
                defaultValue: null
            })
        ]);
    }
};
//# sourceMappingURL=20211204211026-remove-column-closedAt-table-tickets.js.map