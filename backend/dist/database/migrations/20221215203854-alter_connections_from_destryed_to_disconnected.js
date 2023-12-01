"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.sequelize.query("update \"Whatsapps\" SET status = 'DISCONNECTED' WHERE status = 'DESTROYED';")
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.sequelize.query("select gen_random_uuid()")
        ]);
    }
};
//# sourceMappingURL=20221215203854-alter_connections_from_destryed_to_disconnected.js.map