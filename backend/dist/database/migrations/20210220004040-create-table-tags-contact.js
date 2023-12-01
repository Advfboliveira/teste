"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("ContactTags", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            tagId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tags", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
                allowNull: false
            },
            contactId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Contacts", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: false
            },
            tenantId: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Tenants", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                allowNull: false
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
        return queryInterface.dropTable("ContactTags");
    }
};
//# sourceMappingURL=20210220004040-create-table-tags-contact.js.map