"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "apiConfig", {
                type: sequelize_1.DataTypes.JSONB,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Tickets", "apiConfig")]);
    }
};
//# sourceMappingURL=20220824192600-alter_table_ticket_add_apiConfig.js.map