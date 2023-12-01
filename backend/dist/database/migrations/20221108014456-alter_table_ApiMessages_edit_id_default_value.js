"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("ApiMessages", "id", {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.Sequelize.literal("gen_random_uuid()")
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("ApiMessages", "id", {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.Sequelize.literal("gen_random_uuid()")
            })
        ]);
    }
};
//# sourceMappingURL=20221108014456-alter_table_ApiMessages_edit_id_default_value.js.map