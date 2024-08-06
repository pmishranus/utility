const { application } = require("express");
const Connection = require("../util/request/connection.class");
const ApplicationConstants = require("../util/app-constant");
const CommonUtils = require("../util/common-utils");
const cds = require("@sap/cds");
const dateUtils = require("../util/date-utils");
const commonQuery = require("../query/query-common");
const queryApproverMatrix = require("../query/query-approver-matrix");
const { config } = require("@sap/xssec");
module.exports = {
    /**
     *
     * @param {object} request CAP Request Object
     * @param {oject} db CAP DB Object
     * @param {object} srv CAP DB Object
     * @returns {Promise<Object>} Result of Updated Entries in JSON
     */
    createConfigEntry: function (request, db, srv) {
        const oConnection = new Connection(request, db, srv);
        return  this.persistAppConfigEntry(oConnection);
    },

    persistAppConfigEntry: async function (oConnection) {
        const tx = cds.tx();
        let configResponse = [];
        try {
            const user = oConnection.request.user.id;
            // const userName = user.split('@')[0];
            const userName = "PTT_CA1";

            //fetch logged in user information

            let loggedInUserDetails = await commonQuery.fetchLoggedInUser(userName,oConnection);

            if (!userName) {
                throw new Error("User not found..!!");
            }

            const inputRequest = oConnection.request.data.data;

            const requestMonth = new Date().getMonth() + 1; // getMonth() returns 0-based month, so add 1
            const requestYear = new Date().getFullYear() % 100;

            const formattedRequestMonth = requestMonth.toString().padStart(2, '0');
            const formattedRequestYear = requestYear.toString();
          

            // inputRequest.forEach(async configRequest => {
                for (const configRequest of inputRequest) {
                try {
                    let response = await this.checkForDuplicateWhileCreation(configRequest);

                    // create payload for the request creation
                    const authId = CommonUtils.isEmpty(configRequest.AUTH_ID)
                        ? await commonQuery.fetchSequenceNumber("AUTH" + requestYear + requestMonth, 4)
                        : configRequest.AUTH_ID;
                    let approverMatrix = {};
                    approverMatrix.AUTH_ID = authId.RUNNINGNORESULT;
                    approverMatrix.PROCESS_CODE = configRequest.PROCESS_CODE;
                    approverMatrix.PROCESS_TYPE = configRequest.PROCESS_TYPE;
                    approverMatrix.FDLU = configRequest.FDLU;
                    approverMatrix.ULU = configRequest.ULU;
                    approverMatrix.STAFF_USER_GRP = configRequest.STAFF_USER_GRP;
                    approverMatrix.STAFF_ID = configRequest.STAFF_ID;

                    if (!CommonUtils.isEmpty(configRequest.STAFF_ID)) {
                        let userInfoDetails = await commonQuery.fetchLoggedInUser(configRequest.STAFF_ID);
                        if (userInfoDetails && Object.keys(userInfoDetails).length > 0) {
                            approverMatrix.STAFF_NUSNET_ID = userInfoDetails.NUSNET_ID;
                        }
                    }

                    approverMatrix.VALID_FROM = dateUtils.formatDateAsString(configRequest.VALID_FROM, "yyyy-MM-dd");
                    approverMatrix.VALID_TO = dateUtils.formatDateAsString(configRequest.VALID_TO, "yyyy-MM-dd");

                    approverMatrix.APM_VALID_FROM = new Date(configRequest.VALID_FROM).toISOString();
                    approverMatrix.APM_VALID_TO = new Date(configRequest.VALID_TO).toISOString();


                    approverMatrix.UPDATED_BY_NID = loggedInUserDetails.NUSNET_ID;
                    approverMatrix.UPDATED_BY = loggedInUserDetails.STF_NUMBER;
                    approverMatrix.UPDATED_ON = new Date().toISOString();
                    approverMatrix.IS_DELETED = ApplicationConstants.N;

                    await commonQuery.upsertOperationChained(tx, "NUSEXT_UTILITY_CHRS_APPROVER_MATRIX", approverMatrix);
                    config.frameResponse = CommonUtils.frameResponse(ApplicationConstants.S, "The Configuration is successfully done");
                } catch ( error) {
                   
                    if (error instanceof ApplicationException) {
                        // Handle ApplicationException
                        console.error('Application Exception:', error.message);
                        configRequest.frameResponse = CommonUtils.frameResponse(ApplicationConstants.E, oAppError.message);
                    } else if (error instanceof TypeError) {
                        // Handle TypeError
                        console.error('Type Error:', error.message);
                        configRequest.frameResponse = CommonUtils.frameResponse(ApplicationConstants.E, oAppError.message);
                    } else {
                        // Handle all other errors
                        console.error('General Error:', error.message);
                        configRequest.frameResponse = CommonUtils.frameResponse(ApplicationConstants.E, oAppError.message);
                    }
                }
                configResponse.push(configRequest);
            }

        } catch (error) {
            await tx.rollback();
            if (error instanceof ApplicationException) {
                // Handle ApplicationException
                console.error('Application Exception:', error.message);
            } else if (error instanceof TypeError) {
                // Handle TypeError
                console.error('Type Error:', error.message);
            } else {
                // Handle all other errors
                console.error('General Error:', error.message);
            }
            // this.handleError(oConnection.request, oError);
            

        }
        tx.commit();
        return configResponse;
    },
    checkForDuplicateWhileCreation: async function (configRequest) {
        let validFrom = dateUtils.formatDateAsString(configRequest.VALID_FROM, "yyyy-MM-dd");
        let validTo = dateUtils.formatDateAsString(configRequest.VALID_TO, "yyyy-MM-dd");

        if (CommonUtils.isEmpty(configRequest.AUTH_ID)) {
            const existingMatrixList = await queryApproverMatrix.checkForDuplicateWithValidity(
                configRequest.STAFF_ID,
                configRequest.ULU,
                configRequest.FDLU,
                configRequest.PROCESS_CODE,
                configRequest.STAFF_USER_GRP,
                validFrom,
                validTo
            );
            if (existingMatrixList && existingMatrixList.length > 0) {
                throw new Error( 'ApplicationException',
                    "This is a Duplicate Configuration, please modify the existing configuration"
                );
            }



        }

        // Check Between Designations
        let designationAlias = "", targetDesignationAlias = "", staffUserGrp1 = "", staffUserGrp2 = "", staffUserGrp3 = "";

        if (CommonUtils.equalsIgnoreCase(configRequest.STAFF_USER_GRP, ApplicationConstants.CLAIM_ASSISTANT)) {
            designationAlias = ApplicationConstants.CA_ALIAS;
            targetDesignationAlias = `${ApplicationConstants.VERIFIER_ALIAS} / ${ApplicationConstants.APPROVER_ALIAS}`;
            staffUserGrp1 = ApplicationConstants.VERIFIER;
            staffUserGrp2 = ApplicationConstants.APPROVER;
            staffUserGrp3 = ApplicationConstants.NA;
        } else if (CommonUtils.equalsIgnoreCase(configRequest.STAFF_USER_GRP, ApplicationConstants.VERIFIER)) {
            designationAlias = ApplicationConstants.VERIFIER_ALIAS;
            targetDesignationAlias = `${ApplicationConstants.CA_ALIAS} / ${ApplicationConstants.APPROVER_ALIAS}`;
            staffUserGrp1 = ApplicationConstants.CLAIM_ASSISTANT;
            staffUserGrp2 = ApplicationConstants.APPROVER;
            staffUserGrp3 = ApplicationConstants.DEPT_ADMIN;
        }
        else if (CommonUtils.equalsIgnoreCase(configRequest.STAFF_USER_GRP, ApplicationConstants.APPROVER)) {
            designationAlias = ApplicationConstants.APPROVER_ALIAS;
            targetDesignationAlias = `${ApplicationConstants.CA_ALIAS} / ${ApplicationConstants.VERIFIER_ALIAS}`;
            staffUserGrp1 = ApplicationConstants.CLAIM_ASSISTANT;
            staffUserGrp2 = ApplicationConstants.VERIFIER;
            staffUserGrp3 = ApplicationConstants.DEPT_ADMIN;
        } else if (CommonUtils.equalsIgnoreCase(configRequest.STAFF_USER_GRP, ApplicationConstants.DEPT_ADMIN)) {
            designationAlias = ApplicationConstants.DEPT_ADMIN_ALIAS;
            targetDesignationAlias = `${ApplicationConstants.VERIFIER_ALIAS} / ${ApplicationConstants.APPROVER_ALIAS}`;
            staffUserGrp1 = ApplicationConstants.NA;
            staffUserGrp2 = ApplicationConstants.VERIFIER;
            staffUserGrp3 = ApplicationConstants.APPROVER;
        }

        if (!CommonUtils.isEmpty(staffUserGrp1) && !CommonUtils.isEmpty(staffUserGrp2)) {
            let existingConfigurations = await queryApproverMatrix.validateAgainstStaffUserGrpNValidity(configRequest.STAFF_ID,
                configRequest.ULU,
                configRequest.FDLU,
                configRequest.PROCESS_CODE,
                staffUserGrp1,
                staffUserGrp2,
                staffUserGrp3,
                validFrom,
                validTo);

            if (existingConfigurations && existingConfigurations.length > 0) {
                throw new Error('ApplicationException',
                    designationAlias + " can't be " + targetDesignationAlias
                    + ", you may also check for overlapping entry")

            }

        }


    }
}