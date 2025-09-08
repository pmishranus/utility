const cds = require("@sap/cds");
async function fetchByTaskInstanceId(taskInstanceId) {
    const fetchByTaskInstanceId = await cds.run(
        SELECT.one.from('NUSEXT_UTILITY_TASK_DETAILS').where({ TASK_INST_ID: taskInstanceId })
    );
    return fetchByTaskInstanceId || null;
}
async function fetchProcessDetailsByTaskInstId(taskInstanceId) {
    const fetchProcessDetailsByTaskInstId = await cds.run(
        SELECT
            .one
            .from(' NUSEXT_UTILITY_PROCESS_DETAILS  as process ')
            .join(' NUSEXT_UTILITY_TASK_DETAILS AS task ')
            .on(' task.PROCESS_INST_ID = process.PROCESS_INST_ID ')
            .where({
                'task.TASK_INST_ID': taskInstanceId,
                'process.REFERENCE_ID': {
                    '!=': null
                }
            })
            .columns(process => {
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

async function fetchByProcessInstId(processInstId) {
    try {
        const taskDetails = await cds.run(
            SELECT.from('NUSEXT_UTILITY_TASK_DETAILS')
                .where({ PROCESS_INST_ID: processInstId })
                .orderBy('TASK_CREATED_ON')
        );
        return taskDetails || [];
    } catch (error) {
        console.error('Error fetching task details by process instance ID:', error);
        throw error;
    }
}

async function fetchByReferenceId(draftId) {
    try {
        const taskDetails = await cds.run(
            SELECT.from('NUSEXT_UTILITY_TASK_DETAILS as task')
                .join('NUSEXT_UTILITY_PROCESS_DETAILS as process')
                .on('task.PROCESS_INST_ID = process.PROCESS_INST_ID')
                .where({ 'process.REFERENCE_ID': draftId })
                .orderBy('task.TASK_CREATED_ON')
        );
        return taskDetails || [];
    } catch (error) {
        console.error('Error fetching task details by reference ID:', error);
        throw error;
    }
}

async function fetchTaskCreatedOnList(draftId) {
    try {
        const taskCreatedOnList = await cds.run(
            SELECT.from('NUSEXT_UTILITY_TASK_DETAILS as task')
                .join('NUSEXT_UTILITY_PROCESS_DETAILS as process')
                .on('task.PROCESS_INST_ID = process.PROCESS_INST_ID')
                .columns('task.TASK_CREATED_ON')
                .where({ 'process.REFERENCE_ID': draftId })
                .orderBy('task.TASK_CREATED_ON', 'asc')
        );
        return taskCreatedOnList.map(item => item.TASK_CREATED_ON) || [];
    } catch (error) {
        console.error('Error fetching task created on list:', error);
        throw error;
    }
}

module.exports = {
    fetchByTaskInstanceId,
    fetchProcessDetailsByTaskInstId,
    fetchEclaimsDataRequestorGrpByTaskInstId,
    fetchCwsDataRequestorGrpByTaskInstId,
    fetchByProcessInstId,
    fetchByReferenceId,
    fetchTaskCreatedOnList
};