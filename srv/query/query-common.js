const cds = require("@sap/cds");
const { SELECT, UPSERT } = require("@sap/cds/lib/ql/cds-ql");
module.exports = {
    fetchSequenceNumber: function (pattern, counter) {
        let fetchSequenceNumber = cds.run(
            `CALL SEQ_NUMBER_GENERATION(
            PATTERN => '${pattern}',
            COUNTER => ${counter},
            RUNNINGNORESULT => ?`
        );
        return fetchSequenceNumber;
    },
    fetchLoggedInUser :function(userName){
        const stfInfoQueryParameter = ` ( NUSNET_ID = '${upperNusNetId}' OR STF_NUMBER = '${upperNusNetId}')`
        let fetchStaffInfo = cds.run(SELECT.one.from(oConnection.srv.entities["CHRS_JOB_INFO"])
            .where(stfInfoQueryParameter)
            .orderBy('END_DATE desc')
        );
        return fetchStaffInfo;
    },
    upsertOperationChained : function(tx,entityName,record){
        let execUpsertOperation = tx.run(UPSERT.into(entityName).entries(record));
        return execUpsertOperation;
    }

}