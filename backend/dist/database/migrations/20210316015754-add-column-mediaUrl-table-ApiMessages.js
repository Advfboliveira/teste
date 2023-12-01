"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("ApiMessages", "mediaUrl", {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            validate: {
                isUrl: true
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("ApiMessages", "mediaUrl");
    }
};
//# sourceMappingURL=20210316015754-add-column-mediaUrl-table-ApiMessages.js.map