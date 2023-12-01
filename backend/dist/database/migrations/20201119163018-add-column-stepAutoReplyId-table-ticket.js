"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Tickets", "stepAutoReplyId", {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: null,
            allowNull: true
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Tickets", "stepAutoReplyId");
    }
};
//# sourceMappingURL=20201119163018-add-column-stepAutoReplyId-table-ticket.js.map