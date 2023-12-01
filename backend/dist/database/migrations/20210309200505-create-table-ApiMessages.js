"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.createTable("ApiMessages", {
                id: {
                    allowNull: false,
                    primaryKey: true,
                    type: sequelize_1.DataTypes.UUID,
                    defaultValue: sequelize_1.Sequelize.literal("gen_random_uuid()")
                },
                messageId: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                externalKey: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                body: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notEmpty: true
                    }
                },
                ack: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                },
                number: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        notEmpty: true,
                        len: [12, 14]
                    }
                },
                mediaName: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
                },
                timestamp: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: null
                },
                sessionId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    references: { model: "Whatsapps", key: "id" },
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
                messageWA: {
                    type: sequelize_1.DataTypes.JSONB,
                    allowNull: true,
                    defaultValue: null
                },
                apiConfig: {
                    type: sequelize_1.DataTypes.JSONB,
                    allowNull: true,
                    defaultValue: null
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
        return Promise.all([queryInterface.dropTable("ApiMessages")]);
    }
};
//# sourceMappingURL=20210309200505-create-table-ApiMessages.js.map