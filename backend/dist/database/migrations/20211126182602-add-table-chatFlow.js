"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("ChatFlow", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            flow: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
                defaultValue: {}
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            celularTeste: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            userId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: true,
                defaultValue: null
            },
            tenantId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false,
                defaultValue: 1
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
        return queryInterface.dropTable("ChatFlow");
    }
};
//# sourceMappingURL=20211126182602-add-table-chatFlow.js.map