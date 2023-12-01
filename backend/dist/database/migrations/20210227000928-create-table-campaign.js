"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.createTable("Campaigns", {
                id: {
                    type: sequelize_1.DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                name: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false
                },
                start: {
                    type: sequelize_1.DataTypes.DATE,
                    allowNull: false
                },
                status: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                    defaultValue: "pending"
                },
                sessionId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    references: { model: "Whatsapps", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "SET NULL"
                },
                message1: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false
                },
                message2: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false
                },
                message3: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false
                },
                mediaUrl: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                mediaType: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
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
                    type: sequelize_1.DataTypes.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: sequelize_1.DataTypes.DATE,
                    allowNull: false
                }
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.dropTable("Campaigns")]);
    }
};
//# sourceMappingURL=20210227000928-create-table-campaign.js.map