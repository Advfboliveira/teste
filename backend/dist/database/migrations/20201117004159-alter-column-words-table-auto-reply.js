"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("AutoReply", "words", {
                type: `${sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING)} USING CAST("words" as ${sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING)})`
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("AutoReply", "words", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            })
        ]);
    }
};
//# sourceMappingURL=20201117004159-alter-column-words-table-auto-reply.js.map