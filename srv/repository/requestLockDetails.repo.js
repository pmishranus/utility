const cds = require("@sap/cds");
const { SELECT, DELETE, UPDATE } = require("@sap/cds/lib/ql/cds-ql");
const { ApplicationConstants } = require("../util/constant");

async function fetchLockedRequestsByDraftId(draftId) {
    const fetchLockedRequestsByDraftId = await cds.run(
        SELECT.from('NUSEXT_UTILITY_REQUEST_LOCK_DETAILS').where({ REFERENCE_ID: draftId, IS_LOCKED: ApplicationConstants.X })
    );
    return fetchLockedRequestsByDraftId || null;
}

async function deleteByDraftId(tx, REFERENCE_ID) {
    await tx.run(
        DELETE
            .from('NUSEXT_UTILITY_REQUEST_LOCK_DETAILS')
            .where({ REFERENCE_ID })
    );
}

async function fetchAllLockedRequests() {
    try {
        const lockedRequests = await cds.run(
            SELECT.from('NUSEXT_UTILITY_REQUEST_LOCK_DETAILS')
                .where({ IS_LOCKED: ApplicationConstants.X })
        );
        return lockedRequests || [];
    } catch (error) {
        console.error('Error fetching all locked requests:', error);
        throw error;
    }
}

async function unLockClaimRequests(tx, draftId) {
    try {
        await tx.run(
            UPDATE('NUSEXT_UTILITY_REQUEST_LOCK_DETAILS')
                .set({ IS_LOCKED: '' })
                .where({ REFERENCE_ID: draftId })
        );
    } catch (error) {
        console.error('Error unlocking claim requests:', error);
        throw error;
    }
}

module.exports = {
    fetchLockedRequestsByDraftId,
    deleteByDraftId,
    fetchAllLockedRequests,
    unLockClaimRequests
}