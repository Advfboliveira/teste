"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.addColumn("StepsReplyActions", "nextStep", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: "StepsReply", key: "id" },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            defaultValue: null,
            allowNull: true
        });
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn("StepsReplyActions", "nextStep");
    }
};
//# sourceMappingURL=20201121013843-add-column-nextStep-table-steps-reply-actions.js.map