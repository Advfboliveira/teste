"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.addConstraint("Contacts", ["number", "tenantId"], {
                type: "unique",
                name: "unique_constraint_contact_number_tenant"
            })
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.removeConstraint("Contacts", "unique_constraint_contact_number_tenant")
        ]);
    }
};
//# sourceMappingURL=20201222035938-add-contraint-contato-number-tenantId.js.map