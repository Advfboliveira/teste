"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("AutoReplyLogs", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            autoReplyId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            autoReplyName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            stepsReplyId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            stepsReplyMessage: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            wordsReply: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            contactId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Contacts", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict"
            },
            ticketId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tickets", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE(6),
                allowNull: false
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE(6),
                allowNull: false
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable("AutoReplyLogs");
    }
};
//# sourceMappingURL=20201230151109-create-table-record-auto-reply.js.map