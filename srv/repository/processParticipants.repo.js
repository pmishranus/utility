const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
const { ApplicationConstants } = require("../util/constant").default
async function fetchByUserDesignation (draftId,userDesignation) {
    let fetchByUserDesignation = await cds.run(SELECT.distinct.from("NUSEXT_UTILITY_PROCESS_PARTICIPANTS")
        .where({
            REFERENCE_ID : draftId,
            USER_DESIGNATION : userDesignation,
            IS_DELETED : ApplicationConstants.N
        }));
    return fetchByUserDesignation;
}

module.exports = {
    fetchByUserDesignation
}