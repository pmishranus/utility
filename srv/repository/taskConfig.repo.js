const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
const { ApplicationConstants } = require("../util/constant").default

async function fetchCurrentTaskConfig(processCode, requestorGroup, taskName) {
     const fetchCurrentTaskConfig = await cds.run(
            SELECT.one.from('NUSEXT_UTILITY_TASKS_CONFIG').where(
                { 
                    'UPPER(TASK_NAME)': taskName.toUpperCase(),
                    PROCESS_CODE : processCode,
                    REQUESTOR_GRP : requestorGroup
                })
        );
        return fetchCurrentTaskConfig || null; 
}

async function fetchTasksConfig(processCode,requestorGroup,taskSequence) {
    const fetchTasksConfig = await cds.run(
        SELECT.one.from('NUSEXT_UTILITY_TASKS_CONFIG').where(
            { 
                TASK_SEQUENCE: taskSequence,
                PROCESS_CODE : processCode,
                REQUESTOR_GRP : requestorGroup
            })
    );
    return fetchTasksConfig || null; 
}

async function fetchOptionalTaskConfigs(processCode,requestorGroup,taskSequence) {
    const fetchTasksConfig = await cds.run(
        SELECT.from('NUSEXT_UTILITY_TASKS_CONFIG').where(
            { 
                TASK_SEQUENCE : {
                    '>' : taskSequence
                },
                PROCESS_CODE : processCode,
                REQUESTOR_GRP : requestorGroup
            })
    );
    return fetchTasksConfig || null; 
}




module.exports = {
    fetchCurrentTaskConfig,fetchTasksConfig,fetchOptionalTaskConfigs
}