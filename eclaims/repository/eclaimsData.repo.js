const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
module.exports = {
    fetchClaimStatusCountById: async function (staffId, statusCode) {
        // const queryParameter = ` ehd.STAFF_ID = '${staffId} and ehd.REQUEST_STATUS IN '${statusCode}' and ehd.CLAIM_TYPE <> '105' `;
        let fetchClaimStatusCountById = await cds.run(
            SELECT
                .from(' NUSEXT_ECLAIMS_HEADER_DATA as ehd')
                .where({
                    STAFF_ID : staffId,
                    REQUEST_STATUS : {
                        in : statusCode
                    },
                    CLAIM_TYPE : {
                        '!=' : '105'
                    }
                }));
        return fetchClaimStatusCountById;
    },
    fetchClaimStatusCount: async function (staffId, statusCode) {
        // const queryParameter = ` ehd.SUBMITTED_BY = '${staffId} and ehd.REQUEST_STATUS IN '${statusCode}' and ehd.CLAIM_TYPE <> '105' `;
        let fetchClaimStatusCountById = await cds.run(
            SELECT
                .from('NUSEXT_ECLAIMS_HEADER_DATA')
                .where({
                    SUBMITTED_BY : staffId,
                    REQUEST_STATUS : {
                        in : statusCode
                    },
                    CLAIM_TYPE : {
                        '!=' : '105'
                    }
                }));
        return fetchClaimStatusCountById;
    },
    fetchPendingCAStatusCount: async function (staffId, status) {
        let query = ` SELECT DISTINCT DRAFT_ID FROM NUSEXT_ECLAIMS_HEADER_DATA WHERE ULU IN ( SELECT ULU FROM NUSEXT_UTILITY_CHRS_APPROVER_MATRIX WHERE STAFF_ID = '${staffId}' `
            + " AND VALID_FROM <= CURRENT_DATE AND VALID_TO  >= CURRENT_DATE AND IS_DELETED='N' AND STAFF_USER_GRP = 'CLAIM_ASSISTANT') AND FDLU IN ( SELECT u.FDLU_C FROM"
            + ` NUSEXT_UTILITY_CHRS_APPROVER_MATRIX am, NUSEXT_MASTER_DATA_CHRS_FDLU_ULU u WHERE STAFF_ID = '${staffId}' AND am.ULU = u.ULU_C and u.FDLU_C = CASE WHEN am.FDLU = 'ALL' THEN u.FDLU_C ELSE am.FDLU END `
            + ` AND  VALID_FROM <= CURRENT_DATE and VALID_TO >= CURRENT_DATE AND IS_DELETED='N' AND am.STAFF_USER_GRP = 'CLAIM_ASSISTANT') AND REQUEST_STATUS IN ('${status}') AND SUBMITTED_BY <> '${staffId}' AND `
            + ` STAFF_ID <> '${staffId}' AND CLAIM_TYPE <> '105' `;
        let fetchPendingCAStatusCount = await cds.run(query);
        return fetchPendingCAStatusCount;
    },
    fetchCAStatusCountForDraft: async function (staffId, status) {
        let query = ` SELECT DISTINCT DRAFT_ID FROM NUSEXT_ECLAIMS_HEADER_DATA WHERE ULU IN ( SELECT ULU FROM NUSEXT_UTILITY_CHRS_APPROVER_MATRIX WHERE STAFF_ID = '${staffId}' `
            + " AND VALID_FROM <= CURRENT_DATE AND VALID_TO  >= CURRENT_DATE AND IS_DELETED='N' AND STAFF_USER_GRP = 'CLAIM_ASSISTANT') AND FDLU IN ( SELECT u.FDLU_C FROM"
            + ` NUSEXT_UTILITY_CHRS_APPROVER_MATRIX am, NUSEXT_MASTER_DATA_CHRS_FDLU_ULU u WHERE STAFF_ID = '${staffId}' AND am.ULU = u.ULU_C and u.FDLU_C = CASE WHEN am.FDLU = 'ALL' THEN u.FDLU_C ELSE am.FDLU END `
            + ` AND  VALID_FROM <= CURRENT_DATE and VALID_TO >= CURRENT_DATE AND IS_DELETED='N' AND am.STAFF_USER_GRP = 'CLAIM_ASSISTANT') AND REQUEST_STATUS IN ('${status}') AND `
            + ` STAFF_ID <> '${staffId}' AND CLAIM_TYPE <> '105' `;
        let fetchCAStatusCountForDraft = await cds.run(query);
        return fetchCAStatusCountForDraft;
    },
    fetchCAStatusCount: async function (staffId, status) {
        let query = ` SELECT DISTINCT DRAFT_ID FROM NUSEXT_ECLAIMS_HEADER_DATA WHERE ULU IN ( SELECT ULU FROM NUSEXT_UTILITY_CHRS_APPROVER_MATRIX WHERE STAFF_ID = '${staffId}' `
            + " AND VALID_FROM <= CURRENT_DATE AND VALID_TO  >= CURRENT_DATE AND IS_DELETED='N' AND STAFF_USER_GRP = 'CLAIM_ASSISTANT') AND FDLU IN ( SELECT u.FDLU_C FROM"
            + ` NUSEXT_UTILITY_CHRS_APPROVER_MATRIX am, NUSEXT_MASTER_DATA_CHRS_FDLU_ULU u WHERE STAFF_ID = '${staffId}' AND am.ULU = u.ULU_C and u.FDLU_C = CASE WHEN am.FDLU = 'ALL' THEN u.FDLU_C ELSE am.FDLU END `
            + ` AND  VALID_FROM <= CURRENT_DATE and VALID_TO >= CURRENT_DATE AND IS_DELETED='N' AND am.STAFF_USER_GRP = 'CLAIM_ASSISTANT') AND REQUEST_STATUS IN ('${status}') AND `
            + ` STAFF_ID <> '${staffId}' AND CLAIM_TYPE <> '105' `;
        let fetchCAStatusCountForDraft = await cds.run(query);
        return fetchCAStatusCountForDraft;
    },
    fetchTbClaimStatusCountById: async function(staffId, statusCode){
        // const queryParameter = ` ehd.STAFF_ID = '${staffId} and ehd.REQUEST_STATUS IN '${statusCode}' and ehd.CLAIM_TYPE = '105' `;
        // let fetchTbClaimStatusCountById = await cds.run(
        //     SELECT
        //         .from(' NUSEXT_ECLAIMS_HEADER_DATA as ehd',['COUNT(ehd.DRAFT_ID) AS count'])
        //         .where(queryParameter)
        //         .groupBy ('ehd.DRAFT_ID')
        //     );
            let query = ` SELECT DISTINCT DRAFT_ID FROM NUSEXT_ECLAIMS_HEADER_DATA WHERE REQUEST_STATUS IN (${statusCode}) AND STAFF_ID = '${staffId}' AND CLAIM_TYPE = '105' `;
            let fetchTbClaimStatusCountById = await cds.run(query);
        return fetchTbClaimStatusCountById;
    },
    fetchTbClaimStatusCount: async function(staffId, statusCode){
        // const queryParameter = ` ehd.SUBMITTED_BY = '${staffId} AND ehd.STAFF_ID = '${staffId} AND ehd.REQUEST_STATUS IN '${statusCode}' AND ehd.CLAIM_TYPE = '105' `;
        // let fetchTbClaimStatusCount = await cds.run(
        //     SELECT
        //         .from(' NUSEXT_ECLAIMS_HEADER_DATA as ehd',['COUNT(ehd.DRAFT_ID) AS count'])
        //         .where(queryParameter)
        //         .groupBy ('ehd.DRAFT_ID')
        //     );
        let query = ` SELECT DISTINCT DRAFT_ID FROM NUSEXT_ECLAIMS_HEADER_DATA WHERE SUBMITTED_BY = '${staffId}' AND REQUEST_STATUS IN (${statusCode}) AND STAFF_ID = '${staffId}' AND CLAIM_TYPE = '105' `;
        let fetchTbClaimStatusCount = await cds.run(query);
        return fetchTbClaimStatusCount;
    },
}