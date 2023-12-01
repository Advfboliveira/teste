"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addConstraint("Tags", ["tag", "tenantId"], {
                type: "unique",
                name: "unique_constraint_tag_tenant"
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeConstraint("Tags", "unique_constraint_tag_tenant")
        ]);
    }
};
//# sourceMappingURL=20210219213514-create-constraint-table-tags.js.map