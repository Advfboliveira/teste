"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("StepsReply", "action"),
            queryInterface.removeColumn("StepsReply", "stepOrder")
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("StepsReply", "action", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }),
            queryInterface.addColumn("StepsReply", "stepOrder", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            })
        ]);
    }
};
//# sourceMappingURL=20201204203210-remove-columns-table-steps-reply.js.map