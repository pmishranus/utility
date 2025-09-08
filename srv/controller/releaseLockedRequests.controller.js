const cds = require("@sap/cds");
const RequestLockDetailsRepo = require("../repository/requestLockDetails.repo");

/**
 * Controller for release locked requests operations
 */
class ReleaseLockedRequestsController {

    /**
     * Unlock requests for a given draft ID
     * @param {Object} request - The CAP request object
     * @param {string} draftId - The draft ID to unlock (optional - if not provided, unlocks all)
     * @returns {Object} Response DTO with success/error message
     */
    static async unlockRequests(request, draftId) {
        try {
            console.log(`ReleaseLockedRequestsController.unlockRequests start - draftId: ${draftId}`);

            const responseDto = {
                isError: false,
                message: '',
                statusCode: 'SUCCESS'
            };

            let lockedRequests = [];

            // Fetch locked requests based on whether draftId is provided
            if (draftId && draftId.trim() !== '') {
                lockedRequests = await RequestLockDetailsRepo.fetchLockedRequestsByDraftId(draftId);
            } else {
                lockedRequests = await RequestLockDetailsRepo.fetchAllLockedRequests();
            }

            if (lockedRequests && lockedRequests.length > 0) {
                console.log(`Number of locked Requests in the database: ${lockedRequests.length}`);

                const tx = cds.tx(request);

                for (const lockedRequest of lockedRequests) {
                    if (lockedRequest && lockedRequest.REFERENCE_ID) {
                        console.log(`Unlocking the claim request id and lock instance id start: ${lockedRequest.REFERENCE_ID} ${lockedRequest.LOCK_INST_ID}`);

                        await RequestLockDetailsRepo.unLockClaimRequests(tx, lockedRequest.REFERENCE_ID);

                        console.log(`Unlocking the claim request id and lock instance id end: ${lockedRequest.REFERENCE_ID} ${lockedRequest.LOCK_INST_ID}`);
                    }
                }

                responseDto.message = "Lock released Successfully";
            } else {
                responseDto.message = "Request not in locked state";
            }

            console.log(`ReleaseLockedRequestsController.unlockRequests end`);
            return responseDto;

        } catch (error) {
            console.error('Error in unlockRequests:', error);
            return {
                isError: true,
                message: 'Generic Exception',
                statusCode: 'ERROR'
            };
        }
    }
}

module.exports = ReleaseLockedRequestsController;
