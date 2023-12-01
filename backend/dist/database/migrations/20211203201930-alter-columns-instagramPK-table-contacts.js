"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("Contacts", "instagramPK", {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("Contacts", "instagramPK", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            })
        ]);
    }
};
//# sourceMappingURL=20211203201930-alter-columns-instagramPK-table-contacts.js.map