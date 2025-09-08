const cds = require("@sap/cds");
const AuditLogDataRepo = require("../repository/auditLogData.repo");
const CommonRepo = require("../repository/util.repo");
const { ProcessConfigType, fromValue } = require("../enum/processConfigType");
const CwsDataRepo = require("../repository/cwsData.repo");
const { formatDateAsString } = require("../util/date-utils");
const EclaimsDataRepo = require("../repository/eclaimsData.repo");
const RateTypeMasterRepo = require("../repository/rateTypeMaster.repo");

/**
 * Controller for audit log operations
 */
class AuditLogController {

    /**
     * Retrieve audit log entries for a given reference ID and process code
     * @param {Object} request - The CAP request object
     * @param {string} referenceId - The reference ID to search for
     * @param {string} processCode - The process code to determine the type of audit log
     * @returns {Object} Audit main response with audit log data
     */
    static async retrieveAuditLogEntries(request, referenceId, processCode) {
        try {
            console.log(`AuditLogController.retrieveAuditLogEntries start - referenceId: ${referenceId}, processCode: ${processCode}`);

            const auditMainResp = {
                auditLog: [],
                eClaimsItemsList: []
            };

            // Determine process type and fetch appropriate audit data
            const pType = fromValue(processCode);
            let auditDataList = [];

            switch (pType) {
                case 'CWS':
                case 'NED':
                case 'OPWN':
                    if (referenceId) {
                        const referenceIds = await CwsDataRepo.getUniqueIdsForChangeRequests(referenceId);
                        auditDataList = await AuditLogDataRepo.getAllAuditLogDataForChangeRequests(referenceIds);
                    }
                    break;
                default:
                    auditDataList = await AuditLogDataRepo.getAllAuditLogData(referenceId);
                    break;
            }

            // Group audit data by section
            const auditMap = new Map();
            let auditStructResp = null;
            let userInfoDetails = null;

            for (const auditStructureDto of auditDataList) {
                if (!auditMap.has(auditStructureDto.SECTION)) {
                    auditMap.set(auditStructureDto.SECTION, []);
                }

                auditStructResp = auditMap.get(auditStructureDto.SECTION);

                // Get user details for the person who made the change
                userInfoDetails = await CommonRepo.fetchUserInfo(auditStructureDto.CHANGED_BY);
                if (userInfoDetails && userInfoDetails.STAFF_ID) {
                    auditStructureDto.CHANGED_BY_FULLNM = userInfoDetails.FULL_NM;
                    auditStructureDto.CHANGED_BY_NID = userInfoDetails.NUSNET_ID;
                    auditStructureDto.CHANGED_BY = userInfoDetails.STAFF_ID;
                } else {
                    auditStructureDto.CHANGED_BY_NID = auditStructureDto.CHANGED_BY;
                }

                // Get user details for the person who submitted (if available)
                if (auditStructureDto.SUBMITTED_BY) {
                    userInfoDetails = await CommonRepo.fetchUserInfo(auditStructureDto.SUBMITTED_BY);
                    if (userInfoDetails && userInfoDetails.STAFF_ID) {
                        auditStructureDto.SUBMITTED_BY_FULLNAME = userInfoDetails.FULL_NM;
                        auditStructureDto.SUBMITTED_BY_NID = userInfoDetails.NUSNET_ID;
                    } else {
                        auditStructureDto.SUBMITTED_BY_NID = auditStructureDto.SUBMITTED_BY;
                    }
                }

                // Format the changed on timestamp
                if (auditStructureDto.CHANGED_ON) {
                    auditStructureDto.TEMP_CHANGED_ON = formatDateAsString(auditStructureDto.CHANGED_ON, "yyyy-MM-dd hh:MM:ss");
                }

                auditStructResp.push(auditStructureDto);
                auditMap.set(auditStructureDto.SECTION, auditStructResp);
            }

            // Prepare the audit data response in the UI expected format
            const auditResponseList = [];
            let auditRespDto = null;

            for (const [tabName, data] of auditMap) {
                auditRespDto = {
                    tabName: tabName,
                    data: data
                };

                // Add eClaims items list for specific process types
                switch (pType) {
                    case 'PTT':
                    case 'CW':
                    case 'OT':
                    case 'HM':
                    case 'TB':
                        auditMainResp.eClaimsItemsList = await this.getEClaimsItemsList(referenceId);
                        break;
                    default:
                        break;
                }

                auditResponseList.push(auditRespDto);
            }

            auditMainResp.auditLog = auditResponseList;

            console.log(`AuditLogController.retrieveAuditLogEntries end - found ${auditResponseList.length} audit sections`);
            return auditMainResp;

        } catch (error) {
            console.error('Error in retrieveAuditLogEntries:', error);
            throw error;
        }
    }


    /**
     * Get eClaims items list for specific process types
     * @param {string} referenceId - The reference ID (DRAFT_ID)
     * @returns {Array} Array of eClaims items
     */
    static async getEClaimsItemsList(referenceId) {
        try {
            console.log(`Getting eClaims items for referenceId: ${referenceId}`);

            // Fetch eClaims items by draft ID
            const eClaimItems = await EclaimsDataRepo.fetchByDraftId(referenceId);
            const itemsResponse = [];

            for (const itemData of eClaimItems) {
                const itemElement = { ...itemData }; // Copy properties

                // Format ITEM_ID to show last 3 digits with "Ref# " prefix
                if (itemElement.ITEM_ID && itemElement.ITEM_ID.length >= 3) {
                    const lastThreeDigits = itemElement.ITEM_ID.substring(itemElement.ITEM_ID.length - 3);
                    itemElement.ITEM_ID = `Ref# ${lastThreeDigits}`;
                }

                // Fetch rate type description
                if (itemData.RATE_TYPE) {
                    const rateTypeList = await RateTypeMasterRepo.fetchAllByRateCode(itemData.RATE_TYPE);
                    if (rateTypeList && rateTypeList.length > 0) {
                        itemElement.RATE_TYPE = rateTypeList[0].RATE_DESC;
                    }
                }

                itemsResponse.push(itemElement);
            }

            console.log(`Found ${itemsResponse.length} eClaims items for referenceId: ${referenceId}`);
            return itemsResponse;
        } catch (error) {
            console.error('Error getting eClaims items list:', error);
            return [];
        }
    }
}

module.exports = AuditLogController;
