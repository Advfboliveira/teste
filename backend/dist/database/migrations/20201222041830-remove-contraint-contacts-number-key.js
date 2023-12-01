"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.removeConstraint("Contacts", "Contacts_number_key")
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.addConstraint("Contacts", ["number"], {
                type: "unique",
                name: "Contacts_number_key"
            })
        ]);
    }
};
//# sourceMappingURL=20201222041830-remove-contraint-contacts-number-key.js.map