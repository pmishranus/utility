const cds = require("@sap/cds");
const RequestLockDetailsRepo = require("../repository/requestLockDetails.repo");
const CommonRepo = require("../repository/util.repo");
const { ProcessConfigType, fromValue } = require("../enum/processConfigType");
const { ApplicationConstants } = require("../util/constant");
const EclaimsDataRepo = require("../repository/eclaimsData.repo");
const CwsDataRepo = require("../repository/cwsData.repo");

/**
 * Controller for request lock operations
 */
class RequestLockController {

    /**
     * Main request lock method that routes to appropriate handler based on process type
     * @param {Object} request - The CAP request object
     * @param {Object} requestDto - The request data
     * @returns {Object} Response DTO with success/error message
     */
    static async requestLock(request, requestDto) {
        try {
            console.log('RequestLockController.requestLock start()');

            const pType = fromValue(requestDto.PROCESS_CODE);

            switch (pType) {
                case 'PTT':
                case 'CW':
                case 'OT':
                case 'HM':
                case 'TB':
                    return await RequestLockController.requestLockForEClaims(request, requestDto);
                case 'CWS':
                case 'NED':
                case 'OPWN':
                    return await RequestLockController.requestLockForCW(request, requestDto);
                default:
                    return {
                        isError: true,
                        message: 'Unsupported process type',
                        statusCode: 'ERROR'
                    };
            }
        } catch (error) {
            console.error('Error in requestLock:', error);
            return {
                isError: true,
                message: error.message || 'Generic Exception',
                statusCode: 'ERROR'
            };
        }
    }

    /**
     * Request lock for eClaims processes (PTT, CW, OT, HM, TB)
     * @param {Object} request - The CAP request object
     * @param {Object} requestDto - The request data
     * @returns {Object} Response DTO with success/error message
     */
    static async requestLockForEClaims(request, requestDto) {
        try {
            console.log('RequestLockController.requestLockForEClaims start()');

            const responseDto = {
                isError: false,
                message: '',
                statusCode: 'SUCCESS'
            };

            // Get user details from XSUAA (BTP CAPM pattern) if not provided in request
            if (!requestDto.NUSNET_ID) {
                const userId = request.user.id;
                if (userId) {
                    const userInfoDetails = await CommonRepo.fetchUserInfo(userId.toUpperCase());
                    if (userInfoDetails) {
                        requestDto.STAFF_ID = userInfoDetails.STAFF_ID;
                        requestDto.NUSNET_ID = userInfoDetails.STAFF_ID;
                    }
                }
            }

            // Input validation
            const validationResults = RequestLockController.validateInputData(requestDto);
            if (validationResults.length > 0) {
                responseDto.validationResults = validationResults;
                return responseDto;
            }

            const tx = cds.tx(request);

            // Cleaning up the lock details table if requestor form flow
            if (requestDto.requestorFormFlow) {
                await RequestLockDetailsRepo.deleteByDraftId(tx, requestDto.DRAFT_ID);
            }

            const savedRequestData = await RequestLockDetailsRepo.fetchByDraftId(requestDto.DRAFT_ID);

            if (savedRequestData && savedRequestData.length > 0) {
                // Validation for existing lock details
                const requestLockDetails = await RequestLockDetailsRepo.checkIsRequestLocked(requestDto.DRAFT_ID);
                if (requestLockDetails &&
                    requestLockDetails.LOCKED_BY_USER_NID &&
                    requestLockDetails.LOCKED_BY_USER_NID !== requestDto.NUSNET_ID) {

                    const userDetails = await CommonRepo.fetchUserInfo(requestDto.NUSNET_ID);
                    throw new Error(`Request is locked by ${userDetails?.FULL_NM || ''}(${userDetails?.NUSNET_ID || ''})`);
                }

                // Update flow
                let lockValue = '';
                let isUserExists = false;

                for (const savedLockDetails of savedRequestData) {
                    if (savedLockDetails &&
                        savedLockDetails.LOCKED_BY_USER_NID &&
                        savedLockDetails.LOCKED_BY_USER_NID === requestDto.NUSNET_ID) {

                        if (requestDto.REQUEST_STATUS === ApplicationConstants.LOCK) {
                            lockValue = ApplicationConstants.X;
                        }

                        if (requestDto.REQUEST_STATUS === ApplicationConstants.UNLOCK &&
                            (!savedLockDetails.IS_LOCKED || savedLockDetails.IS_LOCKED === '')) {
                            throw new Error('The Request is not in the locked state.');
                        }

                        await RequestLockDetailsRepo.updateLockValue(tx, requestDto.DRAFT_ID, requestDto.NUSNET_ID, lockValue);
                        isUserExists = true;
                        break;
                    }
                }

                if (!isUserExists) {
                    // Create new lock entry for existing user
                    await RequestLockController.persistLockInputDetails(tx, requestDto);
                }
            } else {
                // Creation flow - First time creation
                await RequestLockController.persistLockInputDetails(tx, requestDto);
            }

            responseDto.message = "Request Lock status updated successfully";
            console.log('RequestLockController.requestLockForEClaims end()');
            return responseDto;

        } catch (error) {
            console.error('Error in requestLockForEClaims:', error);
            return {
                isError: true,
                message: error.message || 'Generic Exception',
                statusCode: 'ERROR'
            };
        }
    }

    /**
     * Request lock for CWS processes (CWS, NED, OPWN)
     * @param {Object} request - The CAP request object
     * @param {Object} requestDto - The request data
     * @returns {Object} Response DTO with success/error message
     */
    static async requestLockForCW(request, requestDto) {
        try {
            console.log('RequestLockController.requestLockForCW start()');

            const responseDto = {
                isError: false,
                message: '',
                statusCode: 'SUCCESS'
            };

            // Get user details from XSUAA (BTP CAPM pattern)
            const userId = request.user.id;
            if (userId) {
                const userInfoDetails = await CommonRepo.fetchUserInfo(userId.toUpperCase());
                if (userInfoDetails) {
                    requestDto.STAFF_ID = userInfoDetails.STAFF_ID;
                    requestDto.NUSNET_ID = userInfoDetails.STAFF_ID;
                }
            }

            // Input validation
            const validationResults = RequestLockController.validateInputData(requestDto);
            if (validationResults.length > 0) {
                responseDto.validationResults = validationResults;
                return responseDto;
            }

            const tx = cds.tx(request);
            const savedRequestData = await RequestLockDetailsRepo.fetchByDraftId(requestDto.DRAFT_ID);

            if (savedRequestData && savedRequestData.length > 0) {
                // Validation for existing lock details
                const requestLockDetails = await RequestLockDetailsRepo.checkIsRequestLocked(requestDto.DRAFT_ID);
                if (requestLockDetails &&
                    requestLockDetails.LOCKED_BY_USER_NID &&
                    requestLockDetails.LOCKED_BY_USER_NID !== requestDto.NUSNET_ID) {

                    const userDetails = await CommonRepo.fetchUserInfo(requestDto.NUSNET_ID);
                    throw new Error(`Request is locked by ${userDetails?.FULL_NM || ''}(${userDetails?.NUSNET_ID || ''})`);
                }

                // Update flow
                let lockValue = '';
                let isUserExists = false;

                for (const savedLockDetails of savedRequestData) {
                    if (savedLockDetails &&
                        savedLockDetails.LOCKED_BY_USER_NID &&
                        savedLockDetails.LOCKED_BY_USER_NID === requestDto.NUSNET_ID) {

                        if (requestDto.REQUEST_STATUS === ApplicationConstants.LOCK) {
                            lockValue = ApplicationConstants.X;
                        }

                        if (requestDto.REQUEST_STATUS === ApplicationConstants.UNLOCK &&
                            (!savedLockDetails.IS_LOCKED || savedLockDetails.IS_LOCKED === '')) {
                            throw new Error('The Request is not in the locked state.');
                        }

                        await RequestLockDetailsRepo.updateLockValue(tx, requestDto.DRAFT_ID, requestDto.NUSNET_ID, lockValue);
                        isUserExists = true;
                        break;
                    }
                }

                if (!isUserExists) {
                    // Create new lock entry for existing user
                    await RequestLockController.persistLockInputDetails(tx, requestDto);
                }
            } else {
                // Creation flow - First time creation
                await RequestLockController.persistLockInputDetails(tx, requestDto);
            }

            responseDto.message = "Request Lock status updated successfully";
            console.log('RequestLockController.requestLockForCW end()');
            return responseDto;

        } catch (error) {
            console.error('Error in requestLockForCW:', error);
            return {
                isError: true,
                message: error.message || 'Generic Exception',
                statusCode: 'ERROR'
            };
        }
    }

    /**
     * Delete lock for a request
     * @param {Object} request - The CAP request object
     * @param {Object} requestDto - The request data
     * @returns {Object} Response DTO with success/error message
     */
    static async deleteLock(request, requestDto) {
        try {
            console.log('RequestLockController.deleteLock start()');

            const responseDto = {
                isError: false,
                message: '',
                statusCode: 'SUCCESS'
            };

            if (!requestDto.DRAFT_ID) {
                responseDto.message = "Reference ID is not provided";
                responseDto.statusCode = "E";
                return responseDto;
            }

            const tx = cds.tx(request);
            await RequestLockDetailsRepo.deleteByDraftId(tx, requestDto.DRAFT_ID);

            responseDto.statusCode = "S";
            responseDto.message = "All locks for Reference ID are deleted successfully";

            console.log('RequestLockController.deleteLock end()');
            return responseDto;

        } catch (error) {
            console.error('Error in deleteLock:', error);
            return {
                isError: true,
                message: error.message || 'Generic Exception',
                statusCode: 'ERROR'
            };
        }
    }

    /**
     * Persist lock input details
     * @param {Object} tx - Database transaction
     * @param {Object} requestDto - The request data
     */
    static async persistLockInputDetails(tx, requestDto) {
        try {
            console.log('RequestLockController.persistLockInputDetails start()');

            if (!requestDto.DRAFT_ID) {
                throw new Error('Draft Id is blank/empty/null');
            }

            const pType = fromValue(requestDto.PROCESS_CODE);
            let lockDetailsList = [];

            switch (pType) {
                case 'PTT':
                case 'CW':
                case 'OT':
                case 'HM':
                case 'TB':
                    const eclaims = await EclaimsDataRepo.fetchByDRAFT_ID(requestDto.DRAFT_ID);
                    if (!eclaims) {
                        throw new Error('No Eclaims Data available');
                    }

                    // Create lock details for eClaims
                    const lockDetails = RequestLockController.frameRequestLockDetails(
                        requestDto.DRAFT_ID,
                        requestDto.PROCESS_CODE,
                        eclaims.ULU,
                        eclaims.FDLU,
                        requestDto.REQUESTOR_GRP,
                        requestDto.NUSNET_ID,
                        requestDto.REQUEST_STATUS,
                        requestDto.NUSNET_ID
                    );
                    lockDetailsList.push(lockDetails);
                    break;

                case 'CWS':
                case 'NED':
                case 'OPWN':
                    const cwsData = await CwsDataRepo.fetchByREQUEST_ID(requestDto.DRAFT_ID);
                    if (!cwsData) {
                        throw new Error('No CWS Data available');
                    }

                    // Create lock details for CWS
                    const cwsLockDetails = RequestLockController.frameRequestLockDetails(
                        requestDto.DRAFT_ID,
                        requestDto.PROCESS_CODE,
                        cwsData.ULU,
                        cwsData.FDLU,
                        requestDto.REQUESTOR_GRP,
                        requestDto.NUSNET_ID,
                        requestDto.REQUEST_STATUS,
                        requestDto.NUSNET_ID
                    );
                    lockDetailsList.push(cwsLockDetails);
                    break;

                default:
                    break;
            }

            // Create lock details in database using upsert operation
            for (const lockDetails of lockDetailsList) {
                await CommonRepo.upsertOperationChained(tx, 'NUSEXT_UTILITY_REQUEST_LOCK_DETAILS', lockDetails);
            }

            console.log('RequestLockController.persistLockInputDetails end()');
        } catch (error) {
            console.error('Error in persistLockInputDetails:', error);
            throw error;
        }
    }

    /**
     * Frame request lock details object
     * @param {string} draftId - Draft ID
     * @param {string} processCode - Process code
     * @param {string} ulu - ULU
     * @param {string} fdlu - FDLU
     * @param {string} userGroup - User group
     * @param {string} staffNusNetId - Staff NUSNET ID
     * @param {string} requestStatus - Request status
     * @param {string} lockedByUserID - Locked by user ID
     * @returns {Object} Lock details object
     */
    static frameRequestLockDetails(draftId, processCode, ulu, fdlu, userGroup, staffNusNetId, requestStatus, lockedByUserID) {
        const now = new Date();
        const requestMonth = String(now.getMonth() + 1).padStart(2, '0');
        const requestYear = String(now.getFullYear() % 100);
        const lockIdPatternVal = `LOCK${requestYear}${requestMonth}`;
        const lockInstId = `${lockIdPatternVal}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

        return {
            LOCK_INST_ID: lockInstId,
            REFERENCE_ID: draftId,
            PROCESS_CODE: processCode,
            ULU: ulu,
            FDLU: fdlu,
            REQUEST_STATUS: requestStatus,
            STAFF_USER_GRP: userGroup,
            LOCKED_BY_USER_NID: staffNusNetId,
            IS_LOCKED: requestStatus === ApplicationConstants.LOCK ? ApplicationConstants.X : ''
        };
    }

    /**
     * Validate input data
     * @param {Object} requestDto - The request data
     * @returns {Array} Array of validation results
     */
    static validateInputData(requestDto) {
        const validationResults = [];

        if (!requestDto.NUSNET_ID) {
            validationResults.push({
                type: 'ERROR',
                title: 'STAFF_NUSNET_ID',
                message: 'STAFF_NUSNET_ID is empty/null'
            });
        }

        if (!requestDto.REQUEST_STATUS) {
            validationResults.push({
                type: 'ERROR',
                title: 'REQUEST_STATUS',
                message: 'REQUEST_STATUS is empty/null'
            });
        }

        if (requestDto.REQUEST_STATUS &&
            requestDto.REQUEST_STATUS !== ApplicationConstants.LOCK &&
            requestDto.REQUEST_STATUS !== ApplicationConstants.UNLOCK) {
            validationResults.push({
                type: 'ERROR',
                title: 'REQUEST_STATUS',
                message: 'REQUEST_STATUS should be either LOCK or UNLOCK.'
            });
        }

        if (!requestDto.DRAFT_ID) {
            validationResults.push({
                type: 'ERROR',
                title: 'DRAFT_ID',
                message: 'DRAFT_ID is empty/null'
            });
        }

        if (!requestDto.PROCESS_CODE) {
            validationResults.push({
                type: 'ERROR',
                title: 'PROCESS_CODE',
                message: 'PROCESS_CODE is empty/null'
            });
        }

        return validationResults;
    }
}

module.exports = RequestLockController;
