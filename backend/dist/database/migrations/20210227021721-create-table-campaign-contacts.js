"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.createTable("CampaignContacts", {
                id: {
                    type: sequelize_1.DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                messageRandom: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: false
                },
                body: {
                    type: sequelize_1.DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
                },
                mediaName: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                messageId: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                jobId: {
                    type: sequelize_1.DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                ack: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                },
                timestamp: {
                    type: sequelize_1.DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: null
                },
                contactId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    references: { model: "Contacts", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE"
                },
                campaignId: {
                    type: sequelize_1.DataTypes.INTEGER,
                    references: { model: "Campaigns", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                    allowNull: false,
                    defaultValue: 0
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
        return Promise.all([queryInterface.dropTable("CampaignContacts")]);
    }
};
//# sourceMappingURL=20210227021721-create-table-campaign-contacts.js.map