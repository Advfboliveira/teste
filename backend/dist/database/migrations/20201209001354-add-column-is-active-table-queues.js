"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Queues", "isActive", {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            })
        ]);
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Queues", "isActive");
    }
};
//# sourceMappingURL=20201209001354-add-column-is-active-table-queues.js.map