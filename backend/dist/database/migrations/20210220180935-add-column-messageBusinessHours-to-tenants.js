"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const defaultConstants_1 = require("../../utils/defaultConstants");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Tenants", "messageBusinessHours", {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            defaultValue: defaultConstants_1.messageBusinessHours
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Tenants", "messageBusinessHours");
    }
};
//# sourceMappingURL=20210220180935-add-column-messageBusinessHours-to-tenants.js.map