"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Tickets", "oldStepAutoReplyId")
        ]);
    },
    down: (queryInterface) => {
        return queryInterface.addColumn("Tickets", "oldStepAutoReplyId", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: "StepsReply", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
            allowNull: true,
            defaultValue: null
        });
    }
};
//# sourceMappingURL=20201123172529-remove-column-old-step-table-ticket.js.map