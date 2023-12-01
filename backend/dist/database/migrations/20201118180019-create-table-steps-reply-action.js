"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("StepsReplyActions", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            stepReplyId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "StepsReply", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            words: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            action: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            reply: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
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
        return queryInterface.dropTable("StepsReplyActions");
    }
};
//# sourceMappingURL=20201118180019-create-table-steps-reply-action.js.map