const cds = require("@sap/cds");
const { SELECT, UPDATE } = require("@sap/cds/lib/ql/cds-ql");


async function fetchStaffId(draftId) {
    const fetchStaffId = await cds.run(
        SELECT
            .one
            .from('NUSEXT_ECLAIMS_HEADER_DATA')
            .where({
                DRAFT_ID: draftId
            })
            .columns('STAFF_NUSNET_ID')
    );
    return fetchStaffId.STAFF_NUSNET_ID || '';
}


async function updateEClaimsDataOnTaskCompletion(tx, requestStatus, DRAFT_ID, modifiedBy, modifiedByNid, modifiedOn) {
    await tx.run(
        UPDATE('NUSEXT_ECLAIMS_HEADER_DATA')
            .set({
                REQUEST_STATUS: requestStatus,
                MODIFIED_BY: modifiedBy,
                MODIFIED_BY_NID: modifiedByNid,
                MODIFIED_ON: modifiedOn // should be a JS Date object
            })
            .where({ DRAFT_ID })
    );
}

async function fetchByDraftId(draftId) {
    try {
        const eClaimsItems = await cds.run(
            SELECT.from('NUSEXT_ECLAIMS_ITEMS_DATA')
                .where({ DRAFT_ID: draftId })
                .orderBy('ITEM_ID')
        );
        return eClaimsItems || [];
    } catch (error) {
        console.error('Error fetching eClaims items by draft ID:', error);
        throw error;
    }
}

async function fetchHeaderByDraftId(draftId) {
    try {
        const header = await cds.run(
            SELECT
                .one
                .from('NUSEXT_ECLAIMS_HEADER_DATA')
                .where({ DRAFT_ID: draftId })
                .columns([
                    'DRAFT_ID',
                    'REQUEST_ID',
                    'REQUEST_STATUS',
                    'REQUESTOR_GRP',
                    'PROCESS_CODE',
                    'STAFF_ID',
                    'SUBMISSION_TYPE',
                    'SUBMITTED_ON_TS'
                ])
        );
        return header || null;
    } catch (error) {
        console.error('Error fetching eClaims header by draft ID:', error);
        throw error;
    }
}

module.exports = {
    fetchStaffId,
    updateEClaimsDataOnTaskCompletion,
    fetchByDraftId,
    fetchHeaderByDraftId
}