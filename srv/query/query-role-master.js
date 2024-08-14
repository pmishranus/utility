const cds = require("@sap/cds");
const { SELECT, UPSERT } = require("@sap/cds/lib/ql/cds-ql");
module.exports = {
    retrieveUserGrpName: async function(roleAlias,processCode){
        const queryParameter = ` rm.ROLE_CODE_LBL = '${roleAlias}' and rm.PROCESS_CODE LIKE '${processCode}'`;
        let retrieveUserGrpName = await cds.run(SELECT.one.from("NUSEXT_UTILITY_CHRS_ROLE_MASTER AS rm")
            .columns("rm.ROLE_CODE")
            .where(queryParameter)
        );
        return retrieveUserGrpName;
    }
}