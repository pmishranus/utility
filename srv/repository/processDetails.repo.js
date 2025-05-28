const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
async function updateProcessDetailsStatus(tx,processInstId,status) {
    let query = ` UPDATE NUSEXT_UTILITY_PROCESS_DETAILS SET PROCESS_STATUS = ?  WHERE PROCESS_INST_ID = ? `;
    let updateProcessDetailsStatus = await tx.run(query,[referenceId,processCode]);
    return updateProcessDetailsStatus;
}

module.exports = {
    updateProcessDetailsStatus
};