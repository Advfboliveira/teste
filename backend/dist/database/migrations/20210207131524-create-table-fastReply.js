"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("FastReply", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            key: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            message: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            tenantId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: false,
                defaultValue: 1
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
        return queryInterface.dropTable("FastReply");
    }
};
//# sourceMappingURL=20210207131524-create-table-fastReply.js.map