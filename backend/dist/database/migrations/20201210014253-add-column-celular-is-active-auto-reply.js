"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addColumn("AutoReply", "isActive", {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }),
            queryInterface.addColumn("AutoReply", "celularTeste", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeColumn("AutoReply", "isActive"),
            queryInterface.removeColumn("AutoReply", "celularTeste")
        ]);
    }
};
//# sourceMappingURL=20201210014253-add-column-celular-is-active-auto-reply.js.map