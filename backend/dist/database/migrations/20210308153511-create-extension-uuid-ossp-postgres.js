"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.sequelize.query("select gen_random_uuid()"
            // 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
            )
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.sequelize.query("select gen_random_uuid()"
            // 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
            )
        ]);
    }
};
//# sourceMappingURL=20210308153511-create-extension-uuid-ossp-postgres.js.map