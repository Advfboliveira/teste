"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("StepsReply", "initialStep")
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("StepsReply", "initialStep", {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            })
        ]);
    }
};
//# sourceMappingURL=20201121151458-remove-column-initialStep-table-steps-auto-reply.js.map