"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Contacts", "telegramId", {
                type: sequelize_1.DataTypes.BIGINT,
                defaultValue: null,
                allowNull: true
            }),
            queryInterface.removeConstraint("Contacts", "unique_constraint_contact_number_tenant"),
            queryInterface.changeColumn("Contacts", "number", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                unique: false,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Contacts", "telegramId"),
            queryInterface.changeColumn("Contacts", "number", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true
            }),
            queryInterface.addConstraint("Contacts", ["number", "tenantId"], {
                type: "unique",
                name: "unique_constraint_contact_number_tenant"
            })
        ]);
    }
};
//# sourceMappingURL=20211115225207-add-telegramId-table-contact.js.map