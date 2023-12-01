"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Tickets", "queue", {
            type: sequelize_1.DataTypes.INTEGER,
            // references: { model: "ServiceQueue", key: "id" },
            // onUpdate: "CASCADE",
            // onDelete: "CASCADE",
            defaultValue: null,
            allowNull: true
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Tickets", "queue");
    }
};
//# sourceMappingURL=20201121030331-add-column-queue-table-ticket.js.map