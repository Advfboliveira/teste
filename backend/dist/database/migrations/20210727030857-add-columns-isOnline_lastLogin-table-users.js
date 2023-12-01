"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Users", "lastLogin", {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: null
            }),
            queryInterface.addColumn("Users", "lastLogout", {
                type: sequelize_1.DataTypes.DATE,
                defaultValue: null
            }),
            queryInterface.addColumn("Users", "isOnline", {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Users", "lastLogin"),
            queryInterface.removeColumn("Users", "lastLogout"),
            queryInterface.removeColumn("Users", "isOnline")
        ]);
    }
};
//# sourceMappingURL=20210727030857-add-columns-isOnline_lastLogin-table-users.js.map