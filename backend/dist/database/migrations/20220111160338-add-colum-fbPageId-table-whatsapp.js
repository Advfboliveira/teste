"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Whatsapps", "fbPageId", {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.addColumn("Whatsapps", "fbObject", {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Whatsapps", "fbPageId"),
            queryInterface.removeColumn("Whatsapps", "fbObject")
        ]);
    }
};
//# sourceMappingURL=20220111160338-add-colum-fbPageId-table-whatsapp.js.map