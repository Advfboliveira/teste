"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const defaultConstants_1 = require("../../utils/defaultConstants");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Tenants", "businessHours", {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: defaultConstants_1.BusinessHours
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Tenants", "businessHours");
    }
};
//# sourceMappingURL=20210220180824-add-column-businessHours-to-tenants.js.map