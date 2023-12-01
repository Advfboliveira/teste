"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Users", "status", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "offline"
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Users", "status")]);
    }
};
//# sourceMappingURL=20211215211539-add-column-status-table-users.js.map