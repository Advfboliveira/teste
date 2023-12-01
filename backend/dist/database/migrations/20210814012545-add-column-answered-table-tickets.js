"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "answered", {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: true
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Tickets", "answered")]);
    }
};
//# sourceMappingURL=20210814012545-add-column-answered-table-tickets.js.map