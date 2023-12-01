"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Users", "lastOnline", {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Users", "lastOnline")]);
    }
};
//# sourceMappingURL=20211214214935-add-column-lastOnline-table-users.js.map