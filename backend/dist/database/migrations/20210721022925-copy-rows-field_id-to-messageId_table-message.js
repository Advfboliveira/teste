"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.sequelize.query('UPDATE "Messages" set "messageId"  = "id";')
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.sequelize.query('UPDATE "Messages" set "messageId"  = null;')
        ]);
    }
};
//# sourceMappingURL=20210721022925-copy-rows-field_id-to-messageId_table-message.js.map