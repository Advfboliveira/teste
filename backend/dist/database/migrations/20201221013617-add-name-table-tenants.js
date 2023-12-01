"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tenants", "name", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Tenants", "name")]);
    }
};
//# sourceMappingURL=20201221013617-add-name-table-tenants.js.map