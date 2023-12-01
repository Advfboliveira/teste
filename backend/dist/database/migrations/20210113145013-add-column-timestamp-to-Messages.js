"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Messages", "timestamp", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Messages", "timestamp")]);
    }
};
//# sourceMappingURL=20210113145013-add-column-timestamp-to-Messages.js.map