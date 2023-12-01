"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.changeColumn("Whatsapps", "type", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "whatsapp"
        });
    },
    down: (queryInterface) => {
        return queryInterface.changeColumn("Whatsapps", "type", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "w"
        });
    }
};
//# sourceMappingURL=20211116011624-alter-column-type-table-whatsapp.js.map