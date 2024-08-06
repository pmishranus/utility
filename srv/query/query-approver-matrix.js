const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
module.exports = {

    checkForDuplicateWithValidity: function (STF_NUMBER, ULU, FDLU, PROCESS_CODE, STAFF_USER_GRP, VALID_FROM, VALID_TO) {
        const queryParameter = ` eam.STAFF_ID = '${STF_NUMBER}' and eam.ULU = '${ULU}' and eam.FDLU = '${FDLU}' and eam.PROCESS_CODE = '${PROCESS_CODE}' and eam.STAFF_USER_GRP = '${STAFF_USER_GRP}' and (('${VALID_FROM}' BETWEEN eam.VALID_FROM AND eam.VALID_TO) OR ('${VALID_TO}' BETWEEN eam.VALID_FROM AND eam.VALID_TO) OR ('${VALID_FROM}' < eam.VALID_FROM AND '${VALID_TO}' > eam.VALID_TO ) OR ('${VALID_FROM}' > eam.VALID_FROM AND '${VALID_TO}' < eam.VALID_TO)) and eam.IS_DELETED='N' `;
        let checkForDuplicateWithValidity = cds.run(
            SELECT
                .from(' NUSEXT_UTILITY_CHRS_APPROVER_MATRIX as eam ')
                .where(queryParameter));
        return checkForDuplicateWithValidity;
    },
    validateAgainstStaffUserGrpNValidity: function (STF_NUMBER, ULU, FDLU, PROCESS_CODE, STAFF_USER_GRP1, STAFF_USER_GRP2, STAFF_USER_GRP3, VALID_FROM, VALID_TO) {
        const queryParameter = `  eam.STAFF_ID = '${STF_NUMBER}' and eam.ULU = '${ULU}' and eam.FDLU = CASE WHEN eam.FDLU = 'ALL' THEN eam.FDLU ELSE '${FDLU}' END and eam.PROCESS_CODE = '${PROCESS_CODE}'
          and (eam.STAFF_USER_GRP = '${STAFF_USER_GRP1}' or eam.STAFF_USER_GRP = '${STAFF_USER_GRP2}' or eam.STAFF_USER_GRP = '${STAFF_USER_GRP3}')
          and (('${VALID_FROM}' BETWEEN eam.VALID_FROM AND eam.VALID_TO) OR ('${VALID_TO}' BETWEEN eam.VALID_FROM AND eam.VALID_TO)
          OR ('${VALID_FROM}' < eam.VALID_FROM AND '${VALID_TO}' > eam.VALID_TO ) OR ('${VALID_FROM}' > eam.VALID_FROM AND '${VALID_TO}' < eam.VALID_TO))
           and eam.IS_DELETED='N' `;


        let validateAgainstStaffUserGrpNValidity = cds.run(
            SELECT
                .from(' NUSEXT_UTILITY_CHRS_APPROVER_MATRIX as eam ')
                .where(queryParameter));
        return validateAgainstStaffUserGrpNValidity;
    },

}