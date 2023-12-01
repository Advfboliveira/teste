"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Contacts", "instagramPK", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Contacts", "instagramPK")
        ]);
    }
};
//# sourceMappingURL=20211203014144-add-columns-instagram-table-contact.js.map