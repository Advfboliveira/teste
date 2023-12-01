"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "oldStepAutoReplyId", {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: "StepsReply", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Tickets", "oldStepAutoReplyId");
    }
};
//# sourceMappingURL=20201123160210-add-column-old-step-table-ticket.js.map