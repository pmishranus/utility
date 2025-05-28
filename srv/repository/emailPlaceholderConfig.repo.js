const cds = require("@sap/cds");
const { ApplicationConstants } = require("../util/constant");
async function getAllEmailPlaceHoldersForSubjectLine(TEMPLATE_NAME) {
const getAllEmailPlaceHoldersForSubjectLine = await cds.run(
        SELECT.from('NUSEXT_UTILITY_EMAIL_PLACEHOLDER_CONFIG')
            .where({
                TEMPLATE_NAME,
                PH_TYPE : ApplicationConstants.SUBJECT
            }));
    return getAllEmailPlaceHoldersForSubjectLine || null;

}

module.exports = {
    getAllEmailPlaceHoldersForSubjectLine
}