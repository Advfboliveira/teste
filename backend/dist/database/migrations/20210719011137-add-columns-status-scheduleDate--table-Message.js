"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Messages", "scheduleDate", {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: null
            }),
            queryInterface.addColumn("Messages", "sendType", {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: null,
                values: [
                    "campaign",
                    "chat",
                    "external",
                    "schedule",
                    "web",
                    "celular",
                    "bot",
                    "sync"
                ]
            }),
            queryInterface.addColumn("Messages", "messageId", {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: null,
                allowNull: true
            }),
            queryInterface.addColumn("Messages", "status", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
                values: ["pending", "sended", "received"]
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Messages", "scheduleDate"),
            queryInterface.removeColumn("Messages", "sendType"),
            queryInterface.removeColumn("Messages", "messageId"),
            queryInterface.removeColumn("Messages", "status")
        ]);
    }
};
//# sourceMappingURL=20210719011137-add-columns-status-scheduleDate--table-Message.js.map