"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            queryInterface.renameColumn("StepsReplyActions", "nextStep", "nextStepId")
        ]);
    },
    down: (queryInterface) => {
        return Promise.all([
            queryInterface.renameColumn("StepsReplyActions", "nextStepId", "nextStep")
        ]);
    }
};
//# sourceMappingURL=20201121015611-alter-column-nextStep-table-steps-reply-actions.js.map