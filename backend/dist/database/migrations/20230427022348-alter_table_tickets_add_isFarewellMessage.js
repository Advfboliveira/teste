"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("Tickets", "isFarewellMessage", {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("Tickets", "isFarewellMessage");
    }
};
//# sourceMappingURL=20230427022348-alter_table_tickets_add_isFarewellMessage.js.map