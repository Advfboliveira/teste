"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "botRetries", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }),
            queryInterface.addColumn("Tickets", "lastInteractionBot", {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Tickets", "botRetries"),
            queryInterface.removeColumn("Tickets", "lastInteractionBot")
        ]);
    }
};
//# sourceMappingURL=20211217140835-add-columns_botRetry_lastBotInteraction_table-tickets.js.map