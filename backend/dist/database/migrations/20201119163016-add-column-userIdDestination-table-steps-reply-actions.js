"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("StepsReplyActions", "userIdDestination", {
            type: sequelize_1.DataTypes.INTEGER
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("StepsReplyActions", "userIdDestination");
    }
};
//# sourceMappingURL=20201119163016-add-column-userIdDestination-table-steps-reply-actions.js.map