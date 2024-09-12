const { application } = require("express");
const Connection = require("../util/request/connection.class");
const ApplicationConstants = require("../util/app-constant");
const CommonUtils = require("../util/common-utils");
const cds = require("@sap/cds");
const dateUtils = require("../util/date-utils");
const ProcessConfigType = require("../util/ProcessConfigType");
const commonQuery = require("../query/query-common");
const processConfigQuery = require("../query/query-process-config");
const roleMasterQuery = require("../query/query-role-master")
const queryApproverMatrix = require("../query/query-approver-matrix");
const { config } = require("@sap/xssec");
const { ApplicationException } = require("../util/customErrors");
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const userUtil = require("../util/userinfo/getUserDetails");
const ValidationResultsDto = require("../dto/ValidationResultsDto");
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
        return this.persistApproverMatrixEntry(oConnection);
    },

    persistApproverMatrixEntry: async function (oConnection) {
        const tx = cds.tx();
        let configResponse = [];
        try {
            const user = oConnection.request.user.id;
            // const userName = user.split('@')[0];
            const userName = "PTT_CA1";

            //fetch logged in user information

            let loggedInUserDetails = await commonQuery.fetchLoggedInUser(userName);

            if (!userName) {
                throw new Error("User not found..!!");
            }

            const inputRequest = oConnection.request.data.data;

            const requestMonth = new Date().getMonth() + 1; // getMonth() returns 0-based month, so add 1
            const requestYear = new Date().getFullYear() % 100;

            const formattedRequestMonth = requestMonth.toString().padStart(2, '0');
            const formattedRequestYear = requestYear.toString();


            for (let index  of inputRequest) {
                let configRequest = index; //inputRequest[index]
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
                    configRequest = CommonUtils.frameResponse(configRequest, ApplicationConstants.S, "The Configuration is successfully done");
                } catch (error) {

                    if (error instanceof ApplicationException) {
                        configRequest = CommonUtils.frameResponse(configRequest,ApplicationConstants.E, error.message);
                    } else if (error instanceof TypeError) {
                        configRequest = CommonUtils.frameResponse(configRequest,ApplicationConstants.E, error.message);
                    } else {
                        configRequest = CommonUtils.frameResponse(configRequest,ApplicationConstants.E, error.message);
                    }
                }
                configResponse.push(configRequest);
            }

        } catch (error) {
            await tx.rollback();
            if (error instanceof ApplicationException) {
            } else if (error instanceof TypeError) {
                console.error('Type Error:', error.message);
            } else {
                console.error('General Error:', error.message);
            }
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
                throw new ApplicationException(
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
                throw new ApplicationException(
                    designationAlias + " can't be " + targetDesignationAlias
                    + ", you may also check for overlapping entry")

            }

        }


    },


    /************ Delete the matrix approver */
    deleteMatrixReqEntry: function (request, db, srv) {
        const oConnection = new Connection(request, db, srv);
        return this.deleteMatrixEntry(oConnection);
    },
    deleteMatrixEntry: async function (oConnection) {
        const user = oConnection.request.user.id;
    },
    /********** Mass Upload Request for the Matrix Approver */

    createMatrixReqUploadEntry: function (request, db, srv) {
        const oConnection = new Connection(request, db, srv);
        return this.persistMassUploadMatrxiEntry(oConnection);
    },
    uploadExcelForApproverMatrix: async function (req, matrixFile, requestorGrp, processCode, ulu, fdlu, noOfHeaderRows) {
        const user = req.user.id;
        // const userName = user.split('@')[0];
        const userName = "PTT_CA1";

        //fetch logged in user information

        let loggedInUserDetails = await commonQuery.fetchLoggedInUser(userName);
        let pType = ProcessConfigType.fromValue(processCode);
        switch (pType) {
            case "PTT":
            case "CW":
            case "OT":
            case "HM":
            case "TB":
            case "CWS":
            case "NED":
            case "OPWN":
                excelMassUploadResponse = await this.handleMassUploadOfApproverMatrix(matrixFile, requestorGrp, processCode, ulu, fdlu,
                    noOfHeaderRows, loggedInUserDetails);
                break;
            default:
                break;

        }
        return {
            matrix_payload: excelMassUploadResponse
        };
    },

    handleMassUploadOfApproverMatrix: async function (matrixFile, requestorGrp, processCode, ulu, fdlu, noOfHeaderRows, loggedInUserDetails) {
        if (CommonUtils.isEmpty(processCode))
            throw new ApplicationException("Please select valid Process Code");

        //check for the login user is matrix admin

        let usrStaffId = await commonQuery.checkForMatrixAdmin(loggedInUserDetails.STF_NUMBER);
        const isAdmin = (CommonUtils.isEmpty(usrStaffId)) ? true : false;
        let matrixUploadRequest = [];
        try {
            if (CommonUtils.isEmpty(matrixFile)) {
                throw new ApplicationConstants("Excel file content is Empty");
            }

            for (let index in matrixFile) {
                let oRow = matrixFile[index];
                //Handling ULU data
                if (oRow.ULU) {
                    if (CommonUtils.checkIsNumericOptional.test(oRow.ULU) || CommonUtils.checkIsStringOptional.test(oRow.ULU)) {
                        let tempStr = "";
                        if (CommonUtils.checkIsNumericMandatory.test(oRow.ULU)) {
                            tempStr = oRow.ULU.toString().padStart(10, '0');
                        } else if (CommonUtils.checkIsStringMandatory.test(oRow.ULU)) {
                            tempStr = oRow.ULU;
                        }
                        // matrixUploadRequest.setUlu(oRow.ULU);
                        oRow.ULU = tempStr;
                    } else {
                        throw new Error("ULU column value provided is not valid.");
                    }
                }

                //Handling FDLU
                if (oRow.FDLU) {
                    if (CommonUtils.checkIsNumericOptional.test(oRow.FDLU) || CommonUtils.checkIsStringOptional.test(oRow.FDLU)) {
                        let tempStr = "";
                        if (CommonUtils.checkIsNumericMandatory.test(oRow.FDLU)) {
                            tempStr = oRow.FDLU.toString().padStart(10, '0');
                        } else if (CommonUtils.checkIsStringMandatory.test(oRow.FDLU)) {
                            tempStr = oRow.FDLU;
                        }
                        oRow.FDLU = tempStr;
                    } else {
                        throw new Error("FDLU column value provided is not valid.");
                    }
                }

                // Handling staff
                if (oRow["Staff ID"]) {
                    if (CommonUtils.checkIsNumericOptional.test(oRow["Staff ID"]) || CommonUtils.checkIsStringOptional.test(oRow["Staff ID"])) {
                        let tempStr = "";
                        if (CommonUtils.checkIsNumericMandatory.test(oRow["Staff ID"])) {
                            tempStr = CommonUtils.numberToText(oRow["Staff ID"]);
                        } else if (CommonUtils.checkIsStringMandatory.test(oRow["Staff ID"])) {
                            tempStr = oRow["Staff ID"]
                        }
                        oRow["Staff ID"] = tempStr;

                    } else {
                        throw new ApplicationException("Staff ID column value provided is not valid.");
                    }
                }

                //Handling valid from

                if (oRow["Valid From"] !== undefined && oRow["Valid From"] !== null) {
                    let tempStr = "";
                    if (typeof oRow["Valid From"] === 'string') {
                        if (!CommonUtils.isEmpty(oRow["Valid From"])) {
                            const tempDate = moment(oRow["Valid From"].trim(), 'DD/MM/YYYY'); // Adjust format as needed
                            if (tempDate.isValid()) {
                                tempStr = dateUtils.formatDateAsString(tempDate, 'yyyy-MM-dd');
                            } else {
                                throw new ApplicationException("Valid From column value provided is not valid.");
                            }
                            oRow["Valid From"] = tempStr;
                        }
                    } else if (typeof oRow["Valid From"] === 'number') {
                        if (oRow["Valid From"]) {
                            const tempDate = moment(oRow["Valid From"]);
                            if (tempDate.isValid()) {
                                tempStr = dateUtils.formatDateAsString(tempDate, 'yyyy-MM-dd');
                            } else {
                                throw new ApplicationException("Valid From column value provided is not valid.");
                            }
                            oRow["Valid From"] = tempStr;
                        }
                    } else {
                        throw new ApplicationException("Valid From column value provided is not valid.");
                    }
                } else {
                    throw new ApplicationException("Valid From column value provided is not valid.");
                }



                //Handling valid from

                if (oRow["Valid To"] !== undefined && oRow["Valid To"] !== null) {
                    let tempStr = "";
                    if (typeof oRow["Valid To"] === 'string') {
                        if (!CommonUtils.isEmpty(oRow["Valid To"])) {
                            const tempDate = moment(oRow["Valid To"].trim(), 'DD/MM/YYYY'); // Adjust format as needed
                            if (tempDate.isValid()) {
                                tempStr = dateUtils.formatDateAsString(tempDate, 'yyyy-MM-dd');
                            } else {
                                throw new ApplicationException("Valid To column value provided is not valid.");
                            }
                            oRow["Valid To"] = tempStr;
                        }
                    } else if (typeof oRow["Valid To"] === 'number') {
                        if (oRow["Valid To"]) {
                            const tempDate = moment(oRow["Valid To"]);
                            if (tempDate.isValid()) {
                                tempStr = dateUtils.formatDateAsString(tempDate, 'yyyy-MM-dd');
                            } else {
                                throw new ApplicationException("Valid To column value provided is not valid.");
                            }
                            oRow["Valid To"] = tempStr;
                        }
                    } else {
                        throw new ApplicationException("Valid To column value provided is not valid.");
                    }
                } else {
                    throw new ApplicationException("Valid To column value provided is not valid.");
                }

                matrixUploadRequest.push(oRow);


            }


            if (matrixUploadRequest.length !== 0) {
                matrixUploadRequest = await this.frameMatrixExcelResponse(matrixUploadRequest, processCode, ulu, fdlu, isAdmin,
                    loggedInUserDetails);
            } else {
                throw new ApplicationException(
                    "Please pass a valid excel file with data and provide correct Header Rows Count");
            }



        } catch (error) {
            throw new ApplicationException("Issue while processing file content..!!")

        }
return matrixUploadRequest;
    },
    /**
         * @param excelMassUploadRequestList
         * @param processCode
         * @param token
         * @param ulu
         * @param fdlu
         * @param period
         * @return This method is used to prepare the Matrix Excel Response
         */
    frameMatrixExcelResponse: async function (excelMassUploadRequestList, processCode, ulu, fdlu, isAdmin,
        loggedInUserDetails) {

        //validation on the framed data
        excelMassUploadRequestList = await this.validateWithinExcelEntries(excelMassUploadRequestList);
        let appMatrixResponsePayload = [];
        for (let index in excelMassUploadRequestList) {
            let oExcelRequest = excelMassUploadRequestList[index];
            let oAppMatrix = await this.populateApproverMatrixData(oExcelRequest, processCode, ulu, fdlu, isAdmin,
                loggedInUserDetails);
            appMatrixResponsePayload.push(oAppMatrix);
        }
        return appMatrixResponsePayload;
    },
    validateWithinExcelEntries: async function (excelMassUploadRequestList) {
        if (excelMassUploadRequestList && excelMassUploadRequestList.length > 0) {
            // Group by 'ulu'
            const uluMap = CommonUtils.groupBy(excelMassUploadRequestList, 'ULU');

            Object.keys(uluMap).forEach(uluKey => {
                const fdluMap = CommonUtils.groupBy(uluMap[uluKey], 'FDLU');

                Object.keys(fdluMap).forEach(fdluKey => {
                    const staffIdMap = CommonUtils.groupBy(fdluMap[fdluKey], 'Staff ID');

                    Object.keys(staffIdMap).forEach(staffIdKey => {
                        excelMassUploadRequestList = this.mergeWithMainList(
                            excelMassUploadRequestList,
                            this.validateStaffList(staffIdMap[staffIdKey])
                        );
                    });
                });
            });
        }
        return excelMassUploadRequestList;
    },

    mergeWithMainList: function (excelMassUploadRequestList, excelResponseList) {
        excelMassUploadRequestList.forEach(massUploadRequest => {
            excelResponseList.forEach(massResponse => {
                if (massResponse.serialNumber === massUploadRequest.serialNumber) {
                    massUploadRequest.validationResults = massResponse.validationResults;
                }
            });
        });

        return excelMassUploadRequestList;
    },

    validateStaffList: function (staffIdList) {
        const validatedList = [];

        if (staffIdList && staffIdList.length > 0) {
            for (let i = 0; i < staffIdList.length; i++) {
                let singleRequest = staffIdList[i];
                singleRequest = this.validateEachStaffEntry(singleRequest, i, staffIdList);
                validatedList.push(singleRequest);
            }
        }

        return validatedList;
    },
    validateEachStaffEntry: function (singleRequest, itemIndex, staffIdList) {
        const validationResults = [];
        let message = "";
        staffIdList.forEach((staffIdElement, i) => {
            if (i !== itemIndex) {
                try {
                    // Duplicate Check
                    if (
                        singleRequest.Designation &&
                        staffIdElement.Designation &&
                        singleRequest["Valid From"] &&
                        singleRequest["Valid To"] &&
                        staffIdElement["Valid From"] &&
                        staffIdElement["Valid To"]
                    ) {
                        if (singleRequest.Designation.toLowerCase() === staffIdElement.Designation.toLowerCase()) {
                            const singleValidFrom = moment(singleRequest["Valid From"], excelFormatter);
                            const singleValidTo = moment(singleRequest["Valid To"], excelFormatter);
                            const elementValidFrom = moment(staffIdElement["Valid From"], excelFormatter);
                            const elementValidTo = moment(staffIdElement["Valid To"], excelFormatter);

                            if (
                                singleValidFrom.isSame(elementValidFrom) ||
                                singleValidTo.isSame(elementValidTo) ||
                                (singleValidFrom.isAfter(elementValidFrom) && singleValidFrom.isBefore(elementValidTo)) ||
                                (elementValidFrom.isAfter(singleValidFrom) && elementValidFrom.isBefore(singleValidTo)) ||
                                (singleValidTo.isAfter(elementValidFrom) && singleValidTo.isBefore(elementValidTo)) ||
                                (elementValidTo.isAfter(singleValidFrom) && elementValidTo.isBefore(singleValidTo))
                            ) {
                                message = "Duplicate Entry maintained for this configuration, please correct";
                            } else {
                                message = "Please check validity date(s), Valid From and Valid To provided";
                            }

                            if (message) {
                                validationResults.push(CommonUtils.frameValidationMessage('Duplicate/Overlapping', message));
                            }
                        }

                        // Department Admin can't be Verifier or Approver
                        if (singleRequest.Designation.toLowerCase() === ApplicationConstants.DEPT_ADMIN_ALIAS.toLowerCase()) {
                            if (
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.VERIFIER_ALIAS.toLowerCase() ||
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.APPROVER_ALIAS.toLowerCase()
                            ) {
                                message = `${singleRequest.Designation} can't be ${staffIdElement.Designation}`;
                            }
                        }

                        // Claim Assistant can't be Verifier or Approver
                        if (singleRequest.Designation.toLowerCase() === ApplicationConstants.CA_ALIAS.toLowerCase()) {
                            if (
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.VERIFIER_ALIAS.toLowerCase() ||
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.APPROVER_ALIAS.toLowerCase()
                            ) {
                                message = `${singleRequest.Designation} can't be ${staffIdElement.Designation}`;
                            }
                        }

                        // Verifier can't be CA or Approver or Department Admin
                        if (singleRequest.Designation.toLowerCase() === ApplicationConstants.VERIFIER_ALIAS.toLowerCase()) {
                            if (
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.CA_ALIAS.toLowerCase() ||
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.APPROVER_ALIAS.toLowerCase() ||
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.DEPT_ADMIN_ALIAS.toLowerCase()
                            ) {
                                message = `${singleRequest.Designation} can't be ${staffIdElement.Designation}`;
                            }
                        }

                        // Approver can't be CA or Verifier or Department Admin
                        if (singleRequest.Designation.toLowerCase() === ApplicationConstants.APPROVER_ALIAS.toLowerCase()) {
                            if (
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.VERIFIER_ALIAS.toLowerCase() ||
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.CA_ALIAS.toLowerCase() ||
                                staffIdElement.Designation.toLowerCase() === ApplicationConstants.DEPT_ADMIN_ALIAS.toLowerCase()
                            ) {
                                message = `${singleRequest.Designation} can't be ${staffIdElement.Designation}`;
                            }
                        }

                        if (message) {
                            validationResults.push(CommonUtils.frameValidationMessage('Designation Error', message));
                        }
                    }
                } catch (e) {
                    message = `Exception Occurred : ${e.message}`;
                    validationResults.push(CommonUtils.frameValidationMessage('Exception', message));
                }
            }
        });

        singleRequest.validationResults = validationResults;
        return singleRequest;
    },

    populateApproverMatrixData: async function (oExcelRequest, processCode, ulu, fdlu, isAdmin,
        loggedInUserDetails) {
        let validationResultsDto;
        function frameValidationMessage(message, field) {
            return new ValidationResultsDto(field, message, null, null, null, null, null, null);
        }
        let validationResults;
        let appMatrixResp = {};
        let staffDetails = await userUtil._userInformationBasedOnNusnetIdOrStaffId(oExcelRequest["Staff ID"]);
        appMatrixResp.STAFF_ID = oExcelRequest["Staff ID"];

        try {
            if (!CommonUtils.isEmptyObject(staffDetails)) {
                appMatrixResp.STAFF_NUSNET_ID = staffDetails.NUSNET_ID;
                appMatrixResp.FULL_NM = staffDetails.FULL_NM;
            }

            appMatrixResp = await this.populateUluFdluDetails(appMatrixResp, oExcelRequest.ULU, oExcelRequest.FDLU);
            appMatrixResp.VALID_FROM = oExcelRequest["Valid From"];
            appMatrixResp.VALID_TO = oExcelRequest["Valid To"];
            appMatrixResp.STAFF_USER_ALIAS = oExcelRequest.Designation;
            appMatrixResp.PROCESS_CODE = processCode;
            let processConfig = await processConfigQuery.fetchProcessConfigBasedOnProcessCode(processCode);
            appMatrixResp.PROCESS_TITLE = !CommonUtils.isEmptyObject(processConfig) ? processConfig.PROCESS_CODE : processCode;
            appMatrixResp.S_NO = oExcelRequest.serialNumber;
            appMatrixResp.STATUS_CODE = ApplicationConstants.S;

            if (!CommonUtils.isEmpty(appMatrixResp.STAFF_USER_ALIAS)) {
               
                let oRoleMaster = await roleMasterQuery.retrieveUserGrpName(appMatrixResp.STAFF_USER_ALIAS, processCode.substring(0, 1) + "%");
                if(Object.keys(oRoleMaster).length >= 0){
                    appMatrixResp.STAFF_USER_GRP = oRoleMaster.ROLE_CODE;
                }else{
                    appMatrixResp.STAFF_USER_GRP = '';
                }
            }

            validationResults = await this.validateApproverMatrixData(appMatrixResp, processCode, isAdmin, oExcelRequest.validationResults, loggedInUserDetails);

            if (!CommonUtils.isEmpty(validationResults) || !CommonUtils.isEmptyObject(validationResults))
                appMatrixResp.STATUS_CODE = ApplicationConstants.E;
        } catch (error) {
            validationResults = [];
            let validationMessage = "Exception Occurred " + error.message;
            if (CommonUtils.isNotBlank(validationMessage)) {
                validationResultsDto = frameValidationMessage("Data Exception",
                    validationMessage);
                validationResults.push(validationResultsDto);
            }
            appMatrixResp.STATUS_CODE = ApplicationConstants.E;
            console.error("Exception in populateMassUploadRequest ", error);
        }


        appMatrixResp.validationResults = validationResults;
        return appMatrixResp;
    },

    populateUluFdluDetails: async function (uploadData, ulu, fdlu) {
        let ulufdlu = {};
        if (!CommonUtils.isEmpty(ulu) && !CommonUtils.isEmpty(fdlu)) {
            if (!CommonUtils.equalsIgnoreCase(fdlu, ApplicationConstants.ALL)) {
                ulufdlu = await commonQuery.fetchUluFdlu(ulu, fdlu);
                if (!CommonUtils.isEmptyObject(ulufdlu)) {
                    uploadData.ULU = ulufdlu.ULU_C;
                    uploadData.ULU_T = ulufdlu.ULU_T;
                    uploadData.FDLU = ulufdlu.FDLU_C;
                    uploadData.FDLU_T = ulufdlu.FDLU_T;
                }
            } else {
                uploadData.ULU = ulu;
                ulufdlu = await commonQuery.fetchDistinctULU(ulu);
                uploadData.ULU_T = !CommonUtils.isEmptyObject(ulufdlu) ? ulufdlu.ULU_T : ulu;
                uploadData.FDLU = fdlu;
                uploadData.FDLU_T = fdlu;
            }
        }
        return uploadData;
    },
    validateApproverMatrixData: async function (appMatrixResp, processCode, isAdmin, excelValidationResults, loggedInUserDetails) {
        let validationResults = [];
        if (excelValidationResults && Object.keys(excelValidationResults).length) {
            validationResults = excelValidationResults;
        }

        let validationResultsDto;
        function frameValidationMessage(message, field) {
            return new ValidationResultsDto(field, message, null, null, null, null, null, null);
        }

        try {

            // Validation - Rules - 1 - check for empty input
            validationResults = await this.checkForEmptyInput(appMatrixResp, validationResults);

            // Validation - Rules - 2 - Check if Staff Id provided is right

            validationResults = await this.checkStaffIdExists(appMatrixResp.STAFF_ID, validationResults);

            // Validation - Rules - 3 - Duplicates Check and Check if Existing
            validationResults = await this.checkForDuplicateForMassUpload(appMatrixResp, processCode, validationResults);

            // Validation - Rules - 4 - Check against ULU/FDLU Combination
            validationResults = await this.checkUluFdluRelatedProperties(appMatrixResp, processCode, validationResults);

            // Validation - Rules - 5 - Check if Dept Admin is tagged to right ULU / FDLU or
            // not and also Dept. Admin can't be verifier or approver for the same
            // This Validation is applicable only for Department Admin
            if (!isAdmin) {
                validationResults = await this.checkForDeptAdmin(appMatrixResp, processCode, loggedInUserDetails);
            }

            // Validation - Rules - 6 - Check if Valid From and Valid To is entered correct
            let validationMessage = dateUtils.checkForDateValidity(appMatrixResp.VALID_FROM, appMatrixResp.VALID_TO);
            if (CommonUtils.isNotBlank(validationMessage)) {
                validationResultsDto = frameValidationMessage("Date Validity", validationMessage);
                validationResults.push(validationResultsDto);
            }


        } catch (e) {

            let message = "Exception Occurred " + e.message;
            if (CommonUtils.isNotBlank(message)) {
                validationResultsDto = frameValidationMessage("Data Exception", message);
                validationResults.push(validationResultsDto);
            }
        }
        return validationResults;
    },
    checkForDeptAdmin: function (appMatrixResp, processCode, loggedInUserDetails, validationResults) {
        let validationResultsDto;
        function frameValidationMessage(message, field) {
            return new ValidationResultsDto(field, message, null, null, null, null, null, null);
        }
        let message = "";

        if (CommonUtils.isNotNullOrEmpty(appMatrixResp.STAFF_ID)) {
            // Department Administrator can't assign Department Administrator
            if (CommonUtils.equalsIgnoreCase(appMatrixResp.STAFF_USER_GRP, ApplicationConstants.DEPT_ADMIN)) {
                message += (CommonUtils.isNotBlank(message)) ? "\n" : "";
                message += "Department Admin user can't assign a new department admin";
            }

            // Check if Department Admin is assigned to this ULU / FDLU combination
            let deptAdminAssignmentsList = queryApproverMatrix.validateAgainstStaffUserGrp(appMatrixResp.STAFF_ID,
                appMatrixResp.ULU,
                appMatrixResp.FDLU,
                appMatrixResp.PROCESS_CODE,
                ApplicationConstants.DEPT_ADMIN,
                ApplicationConstants.NA,
                ApplicationConstants.NA)

            if (CommonUtils.isEmptyObject(deptAdminAssignmentsList) || CommonUtils.isEmpty(deptAdminAssignmentsList)) {
                message += (CommonUtils.isNotBlank(message)) ? "\n" : "";
                message += "No Authorization to maintain for this ULU / FDLU combination";
            }

            // Check if the Department Administrator is not Verifier or Approver
            if (CommonUtils.equalsIgnoreCase(loggedInUserDetails.STF_NUMBER, appMatrixResp.STAFF_ID)
                && (CommonUtils.equalsIgnoreCase(appMatrixResp.STAFF_USER_GRP, ApplicationConstants.APPROVER)
                    || CommonUtils.equalsIgnoreCase(appMatrixResp, ApplicationConstants.VERIFIER))) {
                message += (CommonUtils.isNotBlank(message)) ? "\n" : "";
                message += "Department Admin can't be Verifier / Approver";
            }

        } else {
            message = "Error in fetching logged in user details."
        }
        if (CommonUtils.isNotBlank(message)) {
            validationResultsDto = frameValidationMessage("Department Admin", message);
            validationResults.push(validationResultsDto);
        }
        return validationResults;
    },
    checkUluFdluRelatedProperties: function (appMatrixResp, processCode, validationResults) {
        let validationResultsDto;
        function frameValidationMessage(message, field) {
            return new ValidationResultsDto(field, message, null, null, null, null, null, null);
        }

        if (CommonUtils.isEmpty(appMatrixResp.ULU) || CommonUtils.isEmpty(appMatrixResp.FDLU) || CommonUtils.isEmpty(appMatrixResp.ULU_T) || CommonUtils.isEmpty(appMatrixResp.FDLU_T)) {
            validationResultsDto = frameValidationMessage("ULU & FDLU", "ULU and FDLU combination is not valid.");
            validationResults.push(validationResultsDto);
        }

        let pType = ProcessConfigType.fromValue(processCode);
        switch (pType) {
            case 'PTT':
            case 'CW':
            case 'OT':
            case 'HM':
            case 'TB':

                if (CommonUtils.isEmpty(appMatrixResp.FDLU)
                    && CommonUtils.equalsIgnoreCase(appMatrixResp.FDLU, ApplicationConstants.ALL)) {

                    validationResultsDto = frameValidationMessage("ULU & FDLU", "No Assignments allowed for 'ALL' FDLU, please provide correct FDLU.");
                    validationResults.push(validationResultsDto);
                }
                break;
            case 'CWS':
            case 'NED':
            case 'OPWN':

                break;
            default:
                break;
        }
        return validationResults;
    },
    checkForDuplicateForMassUpload: function (appMatrixResp, processCode, validationResults) {
        let validationResultsDto;
        function frameValidationMessage(message, field) {
            return new ValidationResultsDto(field, message, null, null, null, null, null, null);
        }
        if (!CommonUtils.isEmpty(appMatrixResp.VALID_FROM) && !CommonUtils.isEmpty(appMatrixResp.VALID_TO)) {
            let validFrom = dateUtils.formatDateAsString(appMatrixResp.VALID_FROM, "yyyy-MM-dd");
            let validTo = dateUtils.formatDateAsString(appMatrixResp.VALID_TO, "yyyy-MM-dd");
            let existingMatrixList = queryApproverMatrix.checkIfApproverMatrixEntryExists(appMatrixResp.STAFF_ID,
                appMatrixResp.ULU,
                appMatrixResp.FDLU,
                appMatrixResp.PROCESS_CODE,
                appMatrixResp.STAFF_USER_GRP,
                validFrom,
                validTo);
            if (!existingMatrixList || Object.keys(existingMatrixList).length > 0) {
                validationResultsDto = frameValidationMessage("Staff ID", "This is a Duplicate Configuration, please modify the existing configuration");
                validationResults.push(validationResultsDto);
            }
        }

        let pType = ProcessConfigType.fromValue(processCode);

        switch (pType) {
            case 'PTT':
            case 'CW':
            case 'OT':
            case 'HM':
            case 'TB':
                // Check if the Designation is Selected as Claimant
                if (CommonUtils.equalsIgnoreCase(appMatrixResp.STAFF_USER_GRP, ApplicationConstants.CLAIMANT)) {
                    validationResultsDto = frameValidationMessage("STAFF_USER_GRP", "Claimant can't assigned in Approver Matrix");
                    validationResults.push(validationResultsDto);
                }

                // Check Between Designations
                let designationAlias = "", targetDesignationAlias = "", staffUserGrp1 = "", staffUserGrp2 = "", staffUserGrp3 = "";

                if (CommonUtils.equalsIgnoreCase(appMatrixResp.STAFF_USER_GRP, ApplicationConstants.CLAIM_ASSISTANT)) {
                    designationAlias = ApplicationConstants.CA_ALIAS;
                    targetDesignationAlias = `${ApplicationConstants.VERIFIER_ALIAS} / ${ApplicationConstants.APPROVER_ALIAS}`;
                    staffUserGrp1 = ApplicationConstants.VERIFIER;
                    staffUserGrp2 = ApplicationConstants.APPROVER;
                    staffUserGrp3 = ApplicationConstants.NA;
                } else if (CommonUtils.equalsIgnoreCase(appMatrixResp.STAFF_USER_GRP, ApplicationConstants.VERIFIER)) {
                    designationAlias = ApplicationConstants.VERIFIER_ALIAS;
                    targetDesignationAlias = `${ApplicationConstants.CA_ALIAS} / ${ApplicationConstants.APPROVER_ALIAS}`;
                    staffUserGrp1 = ApplicationConstants.CLAIM_ASSISTANT;
                    staffUserGrp2 = ApplicationConstants.APPROVER;
                    staffUserGrp3 = ApplicationConstants.DEPT_ADMIN;
                }
                else if (CommonUtils.equalsIgnoreCase(appMatrixResp.STAFF_USER_GRP, ApplicationConstants.APPROVER)) {
                    designationAlias = ApplicationConstants.APPROVER_ALIAS;
                    targetDesignationAlias = `${ApplicationConstants.CA_ALIAS} / ${ApplicationConstants.VERIFIER_ALIAS}`;
                    staffUserGrp1 = ApplicationConstants.CLAIM_ASSISTANT;
                    staffUserGrp2 = ApplicationConstants.VERIFIER;
                    staffUserGrp3 = ApplicationConstants.DEPT_ADMIN;
                } else if (CommonUtils.equalsIgnoreCase(appMatrixResp.STAFF_USER_GRP, ApplicationConstants.DEPT_ADMIN)) {
                    designationAlias = ApplicationConstants.DEPT_ADMIN_ALIAS;
                    targetDesignationAlias = `${ApplicationConstants.VERIFIER_ALIAS} / ${ApplicationConstants.APPROVER_ALIAS}`;
                    staffUserGrp1 = ApplicationConstants.NA;
                    staffUserGrp2 = ApplicationConstants.VERIFIER;
                    staffUserGrp3 = ApplicationConstants.APPROVER;
                }



                if (!CommonUtils.isEmpty(staffUserGrp1) && !CommonUtils.isEmpty(staffUserGrp2)) {
                    let existingConfigurations = queryApproverMatrix.validateAgainstStaffUserGrp(appMatrixResp.STAFF_ID,
                        appMatrixResp.ULU,
                        appMatrixResp.FDLU,
                        appMatrixResp.PROCESS_CODE,
                        staffUserGrp1,
                        staffUserGrp2,
                        staffUserGrp3);

                    if (existingConfigurations && existingConfigurations.length > 0) {
                        validationResultsDto = frameValidationMessage("STAFF_USER_GRP", designationAlias + " can't be " + targetDesignationAlias);
                        validationResults.push(validationResultsDto);


                    }

                }
                break;
            case 'CWS':
            case 'NED':
            case 'OPWN':
                // Check if the Designation is Selected as Reporting Manager or Manager
                if (CommonUtils.equalsIgnoreCase(appMatrixResp.STAFF_USER_GRP, ApplicationConstants.CW_REPORTING_MGR)
                    || CommonUtils.equalsIgnoreCase(appMatrixResp.STAFF_USER_GRP, ApplicationConstants.CW_MANAGERS_MGR)) {
                    validationResultsDto = frameValidationMessage("STAFF_USER_GRP", "RM can't assigned in Approver Matrix");
                    validationResults.push(validationResultsDto);
                }
                break;
            default:
                break;
        }

        return validationResults;
    },
    checkStaffIdExists: async function (staffId, validationResults) {
        let validationResultsDto;
        function frameValidationMessage(field,message) {
            return new ValidationResultsDto(field, message, null, null, null, null, null, null);
        }

        let staffDetails = await userUtil._userInformationBasedOnNusnetIdOrStaffId(staffId);
        if (CommonUtils.isEmptyObject(staffDetails)) {
            validationResultsDto = frameValidationMessage("Staff ID", "Invalid STF Number provided.");
            validationResults.push(validationResultsDto);
        }
        return validationResults;
    },
    checkForEmptyInput: function (matrixUploadData, validationResults) {
        if (matrixUploadData) {
            let validationResultsDto;

            function frameValidationMessage(message, field) {
                return new ValidationResultsDto(field, message, null, null, null, null, null, null);
            }

            if (!matrixUploadData.ULU || matrixUploadData.ULU.trim() === '') {
                validationResultsDto = frameValidationMessage("ULU", "Please provide ULU.");
                validationResults.push(validationResultsDto);
            }

            if (!matrixUploadData.FDLU || matrixUploadData.FDLU.trim() === '') {
                validationResultsDto = frameValidationMessage("FDLU", "Please provide FDLU.");
                validationResults.push(validationResultsDto);
            }

            if (!matrixUploadData.STAFF_ID || matrixUploadData.STAFF_ID.trim() === '') {
                validationResultsDto = frameValidationMessage("Staff Id", "Please provide Staff Id.");
                validationResults.push(validationResultsDto);
            }

            if (!matrixUploadData.STAFF_NUSNET_ID || matrixUploadData.STAFF_NUSNET_ID.trim() === '') {
                validationResultsDto = frameValidationMessage("Staff NUSNET Id", "Please provide Staff NusNet Id.");
                validationResults.push(validationResultsDto);
            }

            if (!matrixUploadData.STAFF_USER_ALIAS || matrixUploadData.STAFF_USER_ALIAS.trim() === '') {
                validationResultsDto = frameValidationMessage("Designation", "Please provide proper Designation.");
                validationResults.push(validationResultsDto);
            }

            if (!matrixUploadData.STAFF_USER_GRP || matrixUploadData.STAFF_USER_GRP.trim() === '') {
                validationResultsDto = frameValidationMessage("Designation", "Please provide proper Designation Name.");
                validationResults.push(validationResultsDto);
            }

            if (!matrixUploadData.VALID_FROM || matrixUploadData.VALID_FROM.trim() === '') {
                validationResultsDto = frameValidationMessage("Valid From", "Please provide Valid From.");
                validationResults.push(validationResultsDto);
            }

            if (!matrixUploadData.VALID_TO || matrixUploadData.VALID_TO.trim() === '') {
                validationResultsDto = frameValidationMessage("Valid To", "Please provide Valid To.");
                validationResults.push(validationResultsDto);
            }
        }
        return validationResults;
    }



}