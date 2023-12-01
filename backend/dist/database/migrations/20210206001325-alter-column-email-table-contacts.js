"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("Contacts", "email", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("Contacts", "email", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            })
        ]);
    }
};
//# sourceMappingURL=20210206001325-alter-column-email-table-contacts.js.map