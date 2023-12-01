"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("StepsReplyActions", "queue"),
            queryInterface.addColumn("StepsReplyActions", "queueId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Queues", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                defaultValue: null,
                allowNull: true
            }),
            queryInterface.removeColumn("StepsReplyActions", "userIdDestination"),
            queryInterface.addColumn("StepsReplyActions", "userIdDestination", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "Users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "restrict",
                defaultValue: null,
                allowNull: true
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("StepsReplyActions", "queueId"),
            queryInterface.addColumn("StepsReplyActions", "queue", {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: null,
                allowNull: true
            }),
            queryInterface.removeColumn("StepsReplyActions", "userIdDestination"),
            queryInterface.addColumn("StepsReplyActions", "userIdDestination", {
                type: sequelize_1.DataTypes.INTEGER,
                defaultValue: null,
                allowNull: true
            })
        ]);
    }
};
//# sourceMappingURL=20201210022919-alter-columns-queue-userIdDestination-steps-reply-actions.js.map