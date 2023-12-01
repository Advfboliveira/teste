"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Contacts", "messengerId", {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Contacts", "messengerId")
        ]);
    }
};
//# sourceMappingURL=20220108003843-add-colum-messengerId-table-contacts.js.map