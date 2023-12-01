"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Whatsapps", "type", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "w"
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Whatsapps", "type");
    }
};
//# sourceMappingURL=20210209193520-add-column-type-table-whatsapps.js.map