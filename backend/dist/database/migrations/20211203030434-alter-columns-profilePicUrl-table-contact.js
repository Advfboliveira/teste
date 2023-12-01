"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.changeColumn("Contacts", "profilePicUrl", {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        });
    },
    down: (queryInterface) => {
        return queryInterface.changeColumn("Contacts", "profilePicUrl", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        });
    }
};
//# sourceMappingURL=20211203030434-alter-columns-profilePicUrl-table-contact.js.map