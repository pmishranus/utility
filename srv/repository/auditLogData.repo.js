const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");

/**
 * Get all audit log data for a specific reference ID
 * @param {string} referenceId - The reference ID to search for
 * @returns {Array} Array of audit log records
 */
async function getAllAuditLogData(referenceId) {
    try {
        const auditData = await cds.run(
            SELECT.from('NUSEXT_UTILITY_AUDIT_LOG_DATA')
                .where({ REFERENCE_ID: referenceId })
                .orderBy('CHANGED_ON', 'desc')
        );
        return auditData || [];
    } catch (error) {
        console.error('Error fetching audit log data:', error);
        throw error;
    }
}

/**
 * Get audit log data for change requests (CWS/NED/OPWN processes)
 * @param {Array} referenceIds - Array of reference IDs to search for
 * @returns {Array} Array of audit log records with CWS data
 */
async function getAllAuditLogDataForChangeRequests(referenceIds) {
    try {
        if (!referenceIds || referenceIds.length === 0) {
            return [];
        }

        const auditData = await cds.run(
            SELECT.from('NUSEXT_UTILITY_AUDIT_LOG_DATA', 'ad')
                .columns(
                    'ad.REFERENCE_ID',
                    'ad.CHANGED_BY',
                    'ad.CHANGED_ON',
                    'ad.IDENTITY',
                    'ad.ACTION_TYPE',
                    'ad.SECTION',
                    'ad.SUB_SECTION',
                    'ad.FIELD_LABEL',
                    'ad.OLD_VALUE',
                    'ad.OLD_VALUE_DESC',
                    'ad.NEW_VALUE',
                    'ad.NEW_VALUE_DESC',
                    'ad.FIELD_TYPE',
                    'ad.CUSTOM_ATTR_1',
                    'ad.CUSTOM_ATTR_2',
                    'cw.SUBMITTED_BY',
                    'cw.SUBMITTED_ON_TS'
                )
                .join('NUSEXT_CWNED_HEADER_DATA', 'cw')
                .on('cw.REQ_UNIQUE_ID = ad.REFERENCE_ID')
                .where({ 'ad.REFERENCE_ID': { in: referenceIds } })
                .orderBy('ad.CHANGED_ON', 'desc')
        );
        return auditData || [];
    } catch (error) {
        console.error('Error fetching audit log data for change requests:', error);
        throw error;
    }
}

/**
 * Get OHRSS audit data for a specific reference ID and field label
 * @param {string} referenceId - The reference ID to search for
 * @param {string} fieldLabel - The field label to filter by
 * @returns {Array} Array of audit log records
 */
async function getOHRSSAuditData(referenceId, fieldLabel) {
    try {
        const auditData = await cds.run(
            SELECT.from('NUSEXT_UTILITY_AUDIT_LOG_DATA')
                .where({
                    REFERENCE_ID: referenceId,
                    FIELD_LABEL: fieldLabel
                })
                .orderBy('CHANGED_ON', 'desc')
        );
        return auditData || [];
    } catch (error) {
        console.error('Error fetching OHRSS audit data:', error);
        throw error;
    }
}

/**
 * Get OHRSS modified audit data for a specific reference ID, excluding a field label
 * @param {string} referenceId - The reference ID to search for
 * @param {string} fieldLabel - The field label to exclude
 * @param {string} staffNusId - The staff NUS ID to filter by
 * @param {Date} reqAssignedTime - The request assigned time to filter by
 * @returns {Array} Array of audit log records
 */
async function getOHRSSModifiedAuditData(referenceId, fieldLabel, staffNusId, reqAssignedTime) {
    try {
        const auditData = await cds.run(
            SELECT.from('NUSEXT_UTILITY_AUDIT_LOG_DATA')
                .where({
                    REFERENCE_ID: referenceId,
                    FIELD_LABEL: { '!=': fieldLabel },
                    ACTION_TYPE: 'MODIFIED',
                    CHANGED_BY: staffNusId,
                    CHANGED_ON: { '>=': reqAssignedTime }
                })
                .orderBy('CHANGED_ON', 'desc')
        );
        return auditData || [];
    } catch (error) {
        console.error('Error fetching OHRSS modified audit data:', error);
        throw error;
    }
}

module.exports = {
    getAllAuditLogData,
    getAllAuditLogDataForChangeRequests,
    getOHRSSAuditData,
    getOHRSSModifiedAuditData
};
