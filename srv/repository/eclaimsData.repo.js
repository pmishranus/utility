const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");


async function fetchStaffId(draftId) {
      const fetchStaffId = await cds.run(
                SELECT
                .one
                    .from('NUSEXT_ECLAIMS_HEADER_DATA')
                    .where({ 
                        DRAFT_ID : draftId
                    })
                    .columns('STAFF_NUSNET_ID')
            );
            return fetchStaffId.STAFF_NUSNET_ID || ''; 
}


async function updateEClaimsDataOnTaskCompletion(tx,requestStatus,DRAFT_ID, modifiedBy, modifiedByNid, modifiedOn) {
    await tx.run(
            UPDATE('NUSEXT_ECLAIMS_HEADER_DATA')
            .set({
                REQUEST_STATUS: requestStatus,
                MODIFIED_BY: modifiedBy,
                MODIFIED_BY_NID: modifiedByNid,
                MODIFIED_ON: modifiedOn // should be a JS Date object
            })
            .where({ DRAFT_ID })
        );
}
module.exports = {
    fetchStaffId,updateEClaimsDataOnTaskCompletion
}