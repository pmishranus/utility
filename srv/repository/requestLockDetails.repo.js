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

async function fetchByDraftId(draftId) {
    try {
        const lockDetails = await cds.run(
            SELECT.from('NUSEXT_UTILITY_REQUEST_LOCK_DETAILS')
                .where({ REFERENCE_ID: draftId })
        );
        return lockDetails || [];
    } catch (error) {
        console.error('Error fetching lock details by draft ID:', error);
        throw error;
    }
}

async function checkIsRequestLocked(draftId) {
    try {
        const lockDetails = await cds.run(
            SELECT.from('NUSEXT_UTILITY_REQUEST_LOCK_DETAILS')
                .where({ REFERENCE_ID: draftId, IS_LOCKED: ApplicationConstants.X })
                .limit(1)
        );
        return lockDetails && lockDetails.length > 0 ? lockDetails[0] : null;
    } catch (error) {
        console.error('Error checking if request is locked:', error);
        throw error;
    }
}

async function updateLockValue(tx, draftId, staffNusNetId, lockValue) {
    try {
        await tx.run(
            UPDATE('NUSEXT_UTILITY_REQUEST_LOCK_DETAILS')
                .set({ IS_LOCKED: lockValue })
                .where({ REFERENCE_ID: draftId, LOCKED_BY_USER_NID: staffNusNetId })
        );
    } catch (error) {
        console.error('Error updating lock value:', error);
        throw error;
    }
}


module.exports = {
    fetchLockedRequestsByDraftId,
    deleteByDraftId,
    fetchAllLockedRequests,
    unLockClaimRequests,
    fetchByDraftId,
    checkIsRequestLocked,
    updateLockValue
}