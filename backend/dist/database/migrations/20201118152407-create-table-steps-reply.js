"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("StepsReply", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            reply: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            stepOrder: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            idAutoReply: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "AutoReply", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            action: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable("StepsReply");
    }
};
//# sourceMappingURL=20201118152407-create-table-steps-reply.js.map