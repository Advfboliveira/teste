"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.createTable("Tags", {
                id: {
                    type: sequelize_1.DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                tag: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false
                },
                isActive: {
                    type: sequelize_1.DataTypes.BOOLEAN,
                    defaultValue: true,
                    allowNull: false
                },
                color: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false
                    // unique: true
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
        return Promise.all([queryInterface.dropTable("Tags")]);
    }
};
//# sourceMappingURL=20210219213513-create-table-tags.js.map