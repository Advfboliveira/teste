"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Whatsapps", "isActive", {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Whatsapps", "isActive")]);
    }
};
//# sourceMappingURL=20211227160721-add-colum-isActive-table-whatsapps.js.map