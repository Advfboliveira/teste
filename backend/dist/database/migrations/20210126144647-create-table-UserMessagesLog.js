"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("UserMessagesLog", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            messageId: {
                type: sequelize_1.DataTypes.STRING,
                // references: { model: "Messages", key: "id" },
                // onUpdate: "CASCADE",
                // onDelete: "CASCADE",
                allowNull: true,
                defaultValue: null
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT"
            },
            ticketId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tickets", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
                allowNull: true
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
        return queryInterface.dropTable("UserMessagesLog");
    }
};
//# sourceMappingURL=20210126144647-create-table-UserMessagesLog.js.map