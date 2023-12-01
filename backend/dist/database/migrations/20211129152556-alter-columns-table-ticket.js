"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "chatFlowId", {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: null,
                allowNull: true
            }),
            queryInterface.addColumn("Tickets", "stepChatFlow", {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: null,
                allowNull: true
            }),
            queryInterface.addColumn("Tickets", "closedAt", {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: null,
                allowNull: true
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Tickets", "chatFlowId"),
            queryInterface.removeColumn("Tickets", "stepChatFlow"),
            queryInterface.removeColumn("Tickets", "closedAt")
        ]);
    }
};
//# sourceMappingURL=20211129152556-alter-columns-table-ticket.js.map