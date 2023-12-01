"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "tenantId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false,
                defaultValue: 1
            }),
            queryInterface.addColumn("Contacts", "tenantId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false,
                defaultValue: 1
            }),
            queryInterface.addColumn("Queues", "tenantId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false,
                defaultValue: 1
            }),
            queryInterface.addColumn("Settings", "tenantId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false,
                defaultValue: 1
            }),
            queryInterface.addColumn("AutoReply", "tenantId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false,
                defaultValue: 1
            }),
            queryInterface.addColumn("Users", "tenantId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false,
                defaultValue: 1
            }),
            queryInterface.addColumn("Whatsapps", "tenantId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                allowNull: false,
                defaultValue: 1
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Tickets", "tenantId"),
            queryInterface.removeColumn("Contacts", "tenantId"),
            queryInterface.removeColumn("Queues", "tenantId"),
            queryInterface.removeColumn("Settings", "tenantId"),
            queryInterface.removeColumn("AutoReply", "tenantId"),
            queryInterface.removeColumn("Users", "tenantId"),
            queryInterface.removeColumn("Whatsapps", "tenantId")
        ]);
    }
};
//# sourceMappingURL=20201221010713-add-tenantId-all-tables.js.map