const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");

/**
 * Fetch all rate type master data by rate code
 * @param {string} rateCode - The rate code to search for
 * @returns {Array} Array of rate type master data records
 */
async function fetchAllByRateCode(rateCode) {
    try {
        const rateTypeData = await cds.run(
            SELECT.from('NUSEXT_MASTER_DATA_RATE_TYPE_MASTER_DATA')
                .where({ RATE_CODE: rateCode })
        );
        return rateTypeData || [];
    } catch (error) {
        console.error('Error fetching rate type master data by rate code:', error);
        throw error;
    }
}

/**
 * Fetch all rate type master data
 * @returns {Array} Array of all rate type master data records
 */
async function fetchAll() {
    try {
        const rateTypeData = await cds.run(
            SELECT.from('NUSEXT_MASTER_DATA_RATE_TYPE_MASTER_DATA')
        );
        return rateTypeData || [];
    } catch (error) {
        console.error('Error fetching all rate type master data:', error);
        throw error;
    }
}

module.exports = {
    fetchAllByRateCode,
    fetchAll
};
