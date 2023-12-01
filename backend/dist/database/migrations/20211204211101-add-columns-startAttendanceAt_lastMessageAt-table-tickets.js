"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "lastMessageAt", {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn("Tickets", "startedAttendanceAt", {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn("Tickets", "closedAt", {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Tickets", "lastMessageAt"),
            queryInterface.removeColumn("Tickets", "startedAttendanceAt"),
            queryInterface.removeColumn("Tickets", "closedAt")
        ]);
    }
};
//# sourceMappingURL=20211204211101-add-columns-startAttendanceAt_lastMessageAt-table-tickets.js.map