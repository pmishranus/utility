const cds = require("@sap/cds");
const { SELECT, DELETE } = require("@sap/cds/lib/ql/cds-ql");
const {ApplicationConstants} = require("../util/constant").default;

async function fetchLockedRequestsByDraftId(draftId) {
    const fetchLockedRequestsByDraftId = await cds.run(
        SELECT.from('NUSEXT_UTILITY_REQUEST_LOCK_DETAILS').where({ REFERENCE_ID: draftId, IS_LOCKED: ApplicationConstants.X })
    );
    return fetchLockedRequestsByDraftId || null;
}

async function deleteByDraftId(tx,REFERENCE_ID) {
    await tx.run(
            DELETE
            .from('NUSEXT_UTILITY_REQUEST_LOCK_DETAILS')
            .where({ REFERENCE_ID })
        );
}

module.exports = {
    fetchLockedRequestsByDraftId,deleteByDraftId
}