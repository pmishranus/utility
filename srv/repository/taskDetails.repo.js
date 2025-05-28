const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql")
// const {getEntityFields } = require("../util/databaseOperations/querySelector")
const { ApplicationConstants } = require("../util/constant").default
async function fetchByTaskInstanceId(taskInstanceId) {
    const fetchByTaskInstanceId = await cds.run(
        SELECT.one.from('NUSEXT_UTILITY_TASK_DETAILS').where({ TASK_INST_ID: taskInstanceId })
    );
    return fetchByTaskInstanceId || null;
}
async function fetchProcessDetailsByTaskInstId(taskInstanceId) {
    // const columns = getEntityFields("PROCESS_DETAILS")
    const fetchProcessDetailsByTaskInstId = await cds.run(
        SELECT
            .one
            .from(' NUSEXT_UTILITY_PROCESS_DETAILS  as process ')
            .join(' NUSEXT_UTILITY_TASK_DETAILS AS task ')
            .on(' task.PROCESS_INST_ID = process.PROCESS_INST_ID ')
            .where({
                'task.TASK_INST_ID': taskInstanceId,
                'process.REFERENCE_ID' : {
                    '!=' : null
                }
            })
            .columns(process=> {
                    process`.*`
            })
    );

    // query = ` select process.* FROM NUSEXT_UTILITY_PROCESS_DETAILS as process 
    //             inner join NUSEXT_UTILITY_TASK_DETAILS AS task 
    //             on task.PROCESS_INST_ID = process.PROCESS_INST_ID 
    //             WHERE `
    return fetchProcessDetailsByTaskInstId || null;
}

async function fetchEclaimsDataRequestorGrpByTaskInstId(taskInstanceId) {
    const fetchEclaimsDataRequestorGrpByTaskInstId = await cds.run(
        SELECT
            .from(' NUSEXT_ECLAIMS_HEADER_DATA  as ec ')
            .join(' NUSEXT_UTILITY_PROCESS_DETAILS AS process ')
            .on(' ec.DRAFT_ID = process.REFERENCE_ID ')
            .join(' NUSEXT_UTILITY_TASK_DETAILS AS task ')
            .on(' task.PROCESS_INST_ID = process.PROCESS_INST_ID ')
            .where({
                'task.TASK_INST_ID': taskInstanceId,
                'ec.REQUEST_ID': {
                    '!=': null
                }
            })
            .columns(['ec.REQUESTOR_GRP'])
    );
    return fetchEclaimsDataRequestorGrpByTaskInstId || null;
}

async function fetchCwsDataRequestorGrpByTaskInstId(taskInstanceId) {
    const fetchCwsDataRequestorGrpByTaskInstId = await cds.run(
        SELECT
            .from(' NUSEXT_CWNED_HEADER_DATA  as cw ')
            .join(' NUSEXT_UTILITY_PROCESS_DETAILS AS process ')
            .on(' cw.REQ_UNIQUE_ID = process.REFERENCE_ID ')
            .join(' NUSEXT_UTILITY_TASK_DETAILS AS task ')
            .on(' task.PROCESS_INST_ID = process.PROCESS_INST_ID ')
            .where({
                'task.TASK_INST_ID': taskInstanceId,
                'cw.REQUEST_ID': {
                    '!=': null
                }
            })
            .columns(['cw.REQUESTOR_GRP'])
    );
    return fetchCwsDataRequestorGrpByTaskInstId || null;
}

module.exports = {
    fetchByTaskInstanceId, fetchProcessDetailsByTaskInstId, fetchEclaimsDataRequestorGrpByTaskInstId, fetchCwsDataRequestorGrpByTaskInstId
};