"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("Tickets", "channel", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: "whatsapp"
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([queryInterface.removeColumn("Tickets", "channel")]);
    }
};
//# sourceMappingURL=20211116005230-add-column-channel-table-ticket.js.map