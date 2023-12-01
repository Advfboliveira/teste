"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Tickets", "autoReplyId", {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: null,
            allowNull: true
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Tickets", "autoReplyId");
    }
};
//# sourceMappingURL=20201119163017-add-column-autoReplyId-table-ticket.js.map