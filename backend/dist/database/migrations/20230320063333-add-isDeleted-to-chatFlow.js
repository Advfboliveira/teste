"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("ChatFlow", "isDeleted", {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("ChatFlow", "isDeleted");
    }
};
//# sourceMappingURL=20230320063333-add-isDeleted-to-chatFlow.js.map