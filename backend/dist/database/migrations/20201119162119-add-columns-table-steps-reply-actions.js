"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("StepsReplyActions", "queue", {
            type: sequelize_1.DataTypes.INTEGER
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("StepsReplyActions", "queue");
    }
};
//# sourceMappingURL=20201119162119-add-columns-table-steps-reply-actions.js.map