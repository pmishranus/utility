const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");

async function fetchTaskAliasName(processCode, requestorGroup, taskName) {
    try {
        const taskAliasList = await cds.run(
            SELECT.from('NUSEXT_UTILITY_TASKS_CONFIG')
                .columns('TASK_ALIAS')
                .where({
                    PROCESS_CODE: processCode,
                    REQUESTOR_GRP: requestorGroup,
                    TASK_NAME: taskName
                })
        );
        return taskAliasList.map(item => item.TASK_ALIAS) || [];
    } catch (error) {
        console.error('Error fetching task alias name:', error);
        throw error;
    }
}

module.exports = {
    fetchTaskAliasName
};
