"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Users", "configs", {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Users", "configs")]);
    }
};
//# sourceMappingURL=20210810043718-add-column-configs-table-users.js.map