"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("ApiConfigs", "authToken", {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("ApiConfigs", "authToken")
        ]);
    }
};
//# sourceMappingURL=20220829163612-alter_table_apiconfigs_add_authToken.js.map