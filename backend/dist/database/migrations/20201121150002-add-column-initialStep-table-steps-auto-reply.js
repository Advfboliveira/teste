"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("StepsReply", "initialStep", {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: null,
            allowNull: true
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("StepsReply", "initialStep");
    }
};
//# sourceMappingURL=20201121150002-add-column-initialStep-table-steps-auto-reply.js.map