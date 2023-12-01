"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("StepsReply", "initialStep", {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            })
        ]);
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("StepsReply", "initialStep");
    }
};
//# sourceMappingURL=20201121151502-add-column-correct-initialStep-table-steps-auto-reply.js.map