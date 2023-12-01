"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("ApiConfigs", "id", {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.Sequelize.literal("gen_random_uuid()")
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.changeColumn("ApiConfigs", "id", {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.Sequelize.literal("gen_random_uuid()")
            })
        ]);
    }
};
//# sourceMappingURL=20221108013747-alter_table_apiconfigs_edit_id_default_value.js.map