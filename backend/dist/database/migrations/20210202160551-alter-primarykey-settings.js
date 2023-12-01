"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("Settings", "key", {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: false,
                allowNull: false,
                unique: false
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("Settings", "key", {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                unique: true
            })
        ]);
    }
};
//# sourceMappingURL=20210202160551-alter-primarykey-settings.js.map