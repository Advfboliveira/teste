"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.removeColumn("StepsReplyActions", "reply");
    },
    down: (queryInterface) => {
        return queryInterface.addColumn("StepsReplyActions", "reply", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        });
    }
};
//# sourceMappingURL=20201121014717-remove-column-reply-table-steps-reply-actions.js.map