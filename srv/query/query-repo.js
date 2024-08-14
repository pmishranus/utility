const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
module.exports = {
    fetchStaffInfo: async function (upperNusNetId) {
        const stfInfoQueryParameter = ` ( NUSNET_ID = '${upperNusNetId}' OR STF_NUMBER = '${upperNusNetId}') AND START_DATE <= CURRENT_DATE AND END_DATE >= CURRENT_DATE`
        let fetchStaffInfo = await cds.run(SELECT.one.from("NUSEXT_MASTER_DATA_CHRS_JOB_INFO")
            .where(stfInfoQueryParameter));
        return fetchStaffInfo;
    },
    fetchExternalUser: async function (upperNusNetId) {
        const stfInfoQueryParameter = ` ( NUSNET_ID = '${upperNusNetId}' OR STF_NUMBER = '${upperNusNetId}') AND START_DATE <= CURRENT_DATE AND END_DATE >= CURRENT_DATE`
        let fetchExternalUser = await cds.run(SELECT.one.from("NUSEXT_UTILITY_CHRS_EXTERNAL_USERS")
            .where(stfInfoQueryParameter));
        return fetchExternalUser;
    },
    fetchCostDist: function (oConnection, srv, upperNusNetId, startDate, endDate) {
        const stfInfoQueryParameter = ` ( J.NUSNET_ID = '${upperNusNetId}' OR J.STF_NUMBER = '${upperNusNetId}') AND C.START_DATE <= CURRENT_DATE AND C.END_DATE >= CURRENT_DATE`
        let fetchCostDist = cds.run(
            SELECT
                .from(' NUSEXT_MASTER_DATA_CHRS_COST_DIST  as C ')
                .columns('C.STF_NUMBER', 'C.SF_STF_NUMBER', 'C.COST_DIST_FLG', 'C.START_DATE', 'C.END_DATE')
                .join(' NUSEXT_MASTER_DATA_CHRS_JOB_INFO AS J ')
                .on('c.STF_NUMBER = j.STF_NUMBER')
                .where(stfInfoQueryParameter)
        );
        return fetchCostDist;
    },
    fetchAuthDetails: function (staffId) {
        let queryParameter = ` (UPPER(eam.STAFF_NUSNET_ID) = '${staffId}' or eam.STAFF_ID = '${staffId}')
          and eam.ULU = u.ULU_C and u.FDLU_C = CASE WHEN eam.FDLU = 'ALL' THEN u.FDLU_C ELSE eam.FDLU END 
         and eam.VALID_FROM <= CURRENT_DATE and eam.VALID_TO >= CURRENT_DATE and eam.IS_DELETED='N'`
        let fetchAuthDetails = cds.run(
            SELECT
                .from(' NUSEXT_UTILITY_CHRS_APPROVER_MATRIX as eam')
                    .join('NUSEXT_MASTER_DATA_CHRS_FDLU_ULU AS u')
                    .on(' eam.ULU = u.ULU_C ')
                    .columns("eam.PROCESS_CODE","eam.STAFF_ID","u.ULU_C","u.ULU_T","u.FDLU_C","u.FDLU_T","eam.VALID_FROM","eam.VALID_TO","eam.STAFF_USER_GRP")
                    .where(queryParameter)
                );
        return fetchAuthDetails;
    },
    fetchInboxApproverMatrix: function(oConnection, srv, staffId) {
        let queryParameter = ` (UPPER(eam.STAFF_NUSNET_ID) = '${staffId}' or eam.STAFF_ID = '${staffId}')
          and eam.VALID_FROM <= CURRENT_DATE and eam.VALID_TO >= CURRENT_DATE and eam.IS_DELETED='N'`
        let fetchInboxApproverMatrix = cds.run(
            SELECT
                .from("NUSEXT_UTILITY_CHRS_APPROVER_MATRIX as eam")
                .columns("eam.STAFF_USER_GRP","eam.PROCESS_CODE","eam.STAFF_ID","eam.ULU","eam.FDLU","eam.VALID_FROM","eam.VALID_TO")
                    .where(queryParameter)
                );
        return fetchInboxApproverMatrix;
    },
    fetchAdminDetails : function(oConnection, srv, staffId) {
        let queryParameter = ` (UPPER(eam.STAFF_NUSNET_ID) = '${staffId}' or eam.STAFF_ID = '${staffId}')
        and eam.ULU = 'ALL' and eam.FDLU = 'ALL' and eam.VALID_FROM <= CURRENT_DATE and eam.VALID_TO >= CURRENT_DATE and eam.IS_DELETED='N'`
        let fetchAdminDetails = cds.run(
            SELECT
                .from("NUSEXT_UTILITY_CHRS_APPROVER_MATRIX as eam")
                .columns("eam.PROCESS_CODE","eam.STAFF_ID","'ALL' as ULU_C","'ALL' AS ULU_T","'ALL' as FDLU_C","'ALL' as FDLU_T","eam.VALID_FROM","eam.VALID_TO","eam.STAFF_USER_GRP")
                    .where(queryParameter)
                );
        return fetchAdminDetails;
    },
}