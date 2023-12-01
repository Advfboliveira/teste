"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "unreadMessages", {
                type: sequelize_1.DataTypes.INTEGER
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("Tickets", "unreadMessages")
        ]);
    }
};
//# sourceMappingURL=20210113001629-add-columns-unreadMessages-to-tickets.js.map