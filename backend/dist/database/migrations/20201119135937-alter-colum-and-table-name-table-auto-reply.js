"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.renameColumn("AutoReply", "reply", "name"),
            queryInterface.removeColumn("AutoReply", "words")
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.renameColumn("AutoReply", "name", "reply"),
            queryInterface.addColumn("AutoReply", "words", {
                type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING)
            })
        ]);
    }
};
//# sourceMappingURL=20201119135937-alter-colum-and-table-name-table-auto-reply.js.map