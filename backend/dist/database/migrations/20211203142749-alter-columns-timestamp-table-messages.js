"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.changeColumn("Messages", "timestamp", {
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null
        });
    },
    down: (queryInterface) => {
        return queryInterface.changeColumn("Messages", "timestamp", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        });
    }
};
//# sourceMappingURL=20211203142749-alter-columns-timestamp-table-messages.js.map