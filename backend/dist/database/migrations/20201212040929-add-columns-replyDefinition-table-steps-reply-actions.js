"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("StepsReplyActions", "replyDefinition", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("StepsReplyActions", "replyDefinition")
        ]);
    }
};
//# sourceMappingURL=20201212040929-add-columns-replyDefinition-table-steps-reply-actions.js.map