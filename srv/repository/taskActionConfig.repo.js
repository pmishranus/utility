const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
const { ApplicationConstants } = require("../util/constant").default

async function fetchTaskConfigValues(requestorGroup, taskName, actionCode, processCode) {
    const fetchTaskConfigValues = await cds.run(
        SELECT.one.from('NUSEXT_UTILITY_TASK_ACTION_CONFIG').where(
            {
                'UPPER(TASK_NAME)': taskName.toUpperCase(),
                PROCESS_CODE: processCode,
                REQUESTOR_GRP: requestorGroup,
                ACTION_CODE: actionCode
            })
    );
    return fetchTaskConfigValues || null;
}
async function fetchTaskActionConfigValuesByActionCodeNNextTask(requestorGroup, taskName, actionCode, toBeTaskSeq, processCode, submissionType) {
    const fetchTaskActionConfigValuesByActionCodeNNextTask = await cds.run(
        SELECT
        .one
        .from('NUSEXT_UTILITY_TASK_ACTION_CONFIG').where(
            {
                'UPPER(TASK_NAME)': taskName.toUpperCase(),
                PROCESS_CODE: processCode,
                REQUESTOR_GRP: requestorGroup,
                TO_BE_TASK_SEQUENCE: toBeTaskSeq,
                ACTION_CODE: actionCode,
                SUBMISSION_TYPE: submissionType
            })
    );
    return fetchTaskActionConfigValuesByActionCodeNNextTask || null;
}


module.exports = {
    fetchTaskConfigValues, fetchTaskActionConfigValuesByActionCodeNNextTask
}