const cds = require("@sap/cds");
const { SELECT, UPDATE } = require("@sap/cds/lib/ql/cds-ql");
const { ApplicationConstants } = require("../util/constant")

async function fetchByUniqueId(uniqueID) {
    const fetchByUniqueId = await cds.run(
        SELECT.from('NUSEXT_CWNED_HEADER_DATA').where({ REQ_UNIQUE_ID: uniqueID })
    );
    return fetchByUniqueId || null;
}

async function updateCwsRequestStatus(tx, requestStatus, REQ_UNIQUE_ID, modifiedBy, modifiedOn) {
    await tx.run(
        UPDATE('NUSEXT_CWNED_HEADER_DATA')
            .set({
                REQUEST_STATUS: requestStatus,
                MODIFIED_BY: modifiedBy,
                MODIFIED_ON: modifiedOn // should be a JS Date object
            })
            .where({ REQ_UNIQUE_ID })
    );
}

async function getUniqueIdsForChangeRequests(requestId) {
    try {
        const uniqueIds = await cds.run(
            SELECT.from('NUSEXT_CWNED_HEADER_DATA')
                .columns('REQ_UNIQUE_ID')
                .where({ REQUEST_ID: requestId })
                .orderBy('SUBMITTED_ON_TS', 'desc')
        );
        return uniqueIds.map(item => item.REQ_UNIQUE_ID) || [];
    } catch (error) {
        console.error('Error fetching unique IDs for change requests:', error);
        throw error;
    }
}

async function updateCurReqToDisplayOnTaskCompletion(tx, requestId,
    draftId,
    modifiedBy,
    modifiedOn) {

    await tx.run(
        UPDATE('NUSEXT_CWNED_HEADER_DATA')
            .set({
                TO_DISPLAY: ApplicationConstants.N,
                MODIFIED_BY: modifiedBy,
                MODIFIED_ON: modifiedOn // should be a JS Date object
            })
            .where({
                REQ_UNIQUE_ID: draftId,
                REQUEST_ID: requestId,
                REQUEST_STATUS: '38'
            })
    );
}

async function updateOldReqToDisplayOnTaskCompletion(tx, requestId,
    draftId,
    modifiedBy,
    modifiedOn) {

    await tx.run(
        UPDATE('NUSEXT_CWNED_HEADER_DATA')
            .set({
                TO_DISPLAY: ApplicationConstants.N,
                MODIFIED_BY: modifiedBy,
                MODIFIED_ON: modifiedOn // should be a JS Date object
            })
            .where({
                REQ_UNIQUE_ID: {
                    '!=': draftId
                },
                REQUEST_ID: requestId,
                REQUEST_STATUS: '38'
            })
    );
}

async function fetchSubmissionType(REQ_UNIQUE_ID) {
    const fetchSubmissionType = await cds.run(
        SELECT
            .from('NUSEXT_CWNED_HEADER_DATA')
            .where({ REQ_UNIQUE_ID })
            .columns('SUBMISSION_TYPE')
    );
    return fetchSubmissionType || null;
}

module.exports = {
    fetchByUniqueId,
    updateCwsRequestStatus,
    updateOldReqToDisplayOnTaskCompletion,
    updateCurReqToDisplayOnTaskCompletion,
    fetchSubmissionType,
    getUniqueIdsForChangeRequests
};