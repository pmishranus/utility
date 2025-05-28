const cds = require("@sap/cds");
const { SELECT, UPSERT } = require("@sap/cds/lib/ql/cds-ql");


async function fetchSequenceNumber(pattern, counter) {
    let fetchSequenceNumber = await cds.run(
        `CALL SEQ_NUMBER_GENERATION(PATTERN => '${pattern}',COUNTER => ${counter},RUNNINGNORESULT => ?)`
    );
    return fetchSequenceNumber;
}
async function fetchUserInfo(upperNusNetId) {
    const stfInfoQueryParameter = ` ( NUSNET_ID = '${upperNusNetId}' OR STF_NUMBER = '${upperNusNetId}')`
    let fetchStaffInfo = await cds.run(SELECT.one.from("NUSEXT_MASTER_DATA_CHRS_JOB_INFO")
        .where(stfInfoQueryParameter)
        .orderBy('END_DATE desc')
    );
    return fetchStaffInfo;
}
async function upsertOperationChained (tx,entityName,record){
    let execUpsertOperation = await tx.run(UPSERT.into(entityName).entries(record));
    return execUpsertOperation;
}

module.exports = { fetchSequenceNumber, fetchUserInfo,upsertOperationChained }