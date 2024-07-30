const cds = require("@sap/cds");
module.exports = {
    fetchStaffInfo: function (upperNusNetId) {
        const stfInfoQueryParameter = ` ( NUSNET_ID = '${upperNusNetId}' OR STF_NUMBER = '${upperNusNetId}') AND START_DATE <= CURRENT_DATE AND END_DATE >= CURRENT_DATE`
        let fetchStaffInfo = cds.run(SELECT.from(srv.entities["CHRS_JOB_INFO"])
            .where(stfInfoQueryParameter));
        return fetchStaffInfo;
    },
    fetchExternalUser: function (upperNusNetId) {
        const stfInfoQueryParameter = ` ( NUSNET_ID = '${upperNusNetId}' OR STF_NUMBER = '${upperNusNetId}') AND START_DATE <= CURRENT_DATE AND END_DATE >= CURRENT_DATE`
        let fetchExternalUser = cds.run(SELECT.from(srv.entities["CHRS_EXTERNAL_USERS"])
            .where(stfInfoQueryParameter));
        return fetchExternalUser;
    },
    fetchCostDist : function(){
        let fetchCostDist = cds.run(SELECT.from(srv.entities["CHECK_COST_DIST_EXISTS"])
            .where(stfInfoQueryParameter));
        return fetchCostDist;
    }
}