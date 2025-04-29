const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
module.exports = {
    fetchUserDetails: async function (upperNusNetId) {
        const stfInfoQueryParameter = ` ( NUSNET_ID = '${upperNusNetId}' OR STF_NUMBER = '${upperNusNetId}') AND START_DATE <= CURRENT_DATE AND END_DATE >= CURRENT_DATE`
        let fetchUserDetails = await cds.run(SELECT.from("NUSEXT_MASTER_DATA_CHRS_JOB_INFO")
            .where(stfInfoQueryParameter));
        return fetchUserDetails;
    },
    retrieveExternalUserDetails: async function (upperNusNetId) {
        const stfInfoQueryParameter = ` ( NUSNET_ID = '${upperNusNetId}' OR STF_NUMBER = '${upperNusNetId}') AND START_DATE <= CURRENT_DATE AND END_DATE >= CURRENT_DATE`
        let retrieveExternalUserDetails = await cds.run(SELECT.from("NUSEXT_UTILITY_CHRS_EXTERNAL_USERS")
            .where(stfInfoQueryParameter));
        return retrieveExternalUserDetails;
    },
    fetchRmRole: async function (STF_NUMBER) {
        const queryParameter = ` RM_STF_N = '${STF_NUMBER}' `
        let fetchRmRole = await cds.run(SELECT.from("NUSEXT_MASTER_DATA_CHRS_JOB_INFO")
            .where(queryParameter));
        return fetchRmRole;
    },
    fetchRmsManagerJobInfo : async function (STF_NUMBER) {
        const queryParameter = ` RM_STF_N = '${STF_NUMBER}' `
        let fetchRmRole = await cds.run(SELECT.from("NUSEXT_MASTER_DATA_CHRS_JOB_INFO").alias('cj')
            .where(queryParameter));
        return fetchRmRole;
    },
    fetchJobInfoDetailsForDashboard: async function (sColumns, staffId) {
        const queryParameter = ` ( UPPER(NUSNET_ID) = UPPER('${staffId}') OR UPPER(STF_NUMBER) = UPPER('${staffId}')) AND START_DATE <= CURRENT_DATE AND END_DATE >= CURRENT_DATE`
        // let fetchJobInfoDetailsForDashboard = await cds.run(SELECT.from("NUSEXT_MASTER_DATA_CHRS_JOB_INFO")
        //     .columns(`${sColumns}`)
        //     .where(queryParameter));
        let query = 'SELECT ' + sColumns + ' FROM NUSEXT_MASTER_DATA_CHRS_JOB_INFO WHERE ' + queryParameter;
        let fetchJobInfoDetailsForDashboard = await cds.run(query);
        return fetchJobInfoDetailsForDashboard;
    },
    fetchName: async function (STF_NUMBER) {
        const queryParameter = ` cj.STF_NUMBER = '${STF_NUMBER}' and cj.SF_STF_NUMBER = '${STF_NUMBER}' and cj.START_DATE <= CURRENT_DATE AND cj.END_DATE >= CURRENT_DATE `
        let fetchName = await cds.run(SELECT.from("NUSEXT_MASTER_DATA_CHRS_JOB_INFO as cj")
            .columns('cj.FULL_NM')
            .where(queryParameter));
        return fetchName;
    },
}