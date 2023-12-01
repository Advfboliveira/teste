"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.createTable("ApiConfigs", {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: sequelize_1.DataTypes.UUID,
                    defaultValue: sequelize_1.Sequelize.literal("gen_random_uuid()")
                },
                sessionId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    references: { model: "Whatsapps", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "SET NULL"
                },
                name: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                    defaultValue: ""
                },
                isActive: {
                    type: sequelize_1.DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
                token: {
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
                urlServiceStatus: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                    validate: {
                        isUrl: true
                    }
                },
                urlMessageStatus: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null,
                    validate: {
                        isUrl: true
                    }
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
        return Promise.all([queryInterface.dropTable("ApiConfigs")]);
    }
};
//# sourceMappingURL=20210308174543-create-table-ApiConfigs.js.map