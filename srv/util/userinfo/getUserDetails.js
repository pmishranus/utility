const { application } = require("express");
const Connection = require("../../util/request/connection.class");
const ApplicationConstants = require("../app-constant");
const QueryRepo = require("../../query/query-repo");
const commonQuery = require("../../query/query-common");
const CommonUtils = require("../common-utils");
const { ApplicationException } = require("../customErrors");
const cds = require("@sap/cds");
module.exports = {
  /**
   *
   * @param {object} request CAP Request Object
   * @param {oject} db CAP DB Object
   * @param {object} srv CAP DB Object
   * @returns {Promise<Object>} Result of Updated Entries in JSON
   */
  getUserDetails: function (request, db, srv) {
    const oConnection = new Connection(request, db, srv);
    return this._fnGetStaffInfo(oConnection);
  },

  _fnGetStaffInfo: async function (oConnection) {
    try {
      const user = oConnection.request.user.id;
      // const userName = user.split('@')[0];
      const userName = "PTT_CA1";

      if (!userName) {
        throw new Error("User not found..!!");
      }

      return await this._fnFetchLoggedInUserDetails(userName, oConnection, oConnection.srv);
    } catch (oError) {
      this.handleError(oConnection.request, oError);
    }
  },

  _fnFetchLoggedInUserDetails: async function (userName, oConnection, srv) {
    let utilResponse = {
      is_external_user: '',
      staffInfo: {
        otherAssignment: []
      }
    };

    const upperNusNetId = userName.toUpperCase();
    let staffInfo = await QueryRepo.fetchStaffInfo(upperNusNetId);
    if (!staffInfo || Object.keys(staffInfo).length === 0) {
      staffInfo = await QueryRepo.fetchExternalUser(upperNusNetId);
      utilResponse.is_external_user = ApplicationConstants.X;
    } else {
      // utilResponse.staffInfo = staffInfo;
      // staffInfo = [];
    }

    if(!CommonUtils.isEmptyObject(staffInfo)){

        let oStaffInfo = staffInfo;
        utilResponse.staffInfo.FULL_NM = oStaffInfo.FULL_NM;
        utilResponse.staffInfo.EMAIL = oStaffInfo.EMAIL;
        utilResponse.staffInfo.FIRST_NM = oStaffInfo.FIRST_NM;
        utilResponse.staffInfo.LAST_NM = oStaffInfo.LAST_NM;
        utilResponse.staffInfo.STAFF_ID = oStaffInfo.STF_NUMBER;
  
        if ((!oStaffInfo.BANK_INFO_FLG || oStaffInfo.BANK_INFO_FLG.trim() === '') && oStaffInfo.BANK_INFO_FLG !== ApplicationConstants.X) {
          utilResponse.staffInfo.BANK_INFO_FLG = ApplicationConstants.N;
        } else {
          utilResponse.staffInfo.BANK_INFO_FLG = ApplicationConstants.Y
        }
  
  
        // Cost Distribution implementation
        let aCostDist = await QueryRepo.fetchCostDist(oConnection, srv, upperNusNetId, oStaffInfo.START_DATE, oStaffInfo.END_DATE);
        if (!aCostDist || Object.keys(aCostDist).length === 0) {
          utilResponse.staffInfo.COST_DIST_FLG = ApplicationConstants.N;
        } else {
          aCostDist.forEach(element => {
            if (element.COST_DIST_FLG === ApplicationConstants.X) {
              utilResponse.staffInfo.COST_DIST_FLG = ApplicationConstants.Y;
            }
          });
        }
  
  
        //primary assignment implementation
        if (oStaffInfo.STF_NUMBER === oStaffInfo.SF_STF_NUMBER) {
  
          let primaryAssignment = {
            SF_STF_NUMBER: oStaffInfo.SF_STF_NUMBER,
            STF_NUMBER: oStaffInfo.STF_NUMBER,
            ULU_C: oStaffInfo.ULU_C,
            ULU_T: oStaffInfo.ULU_T,
            FDLU_C: oStaffInfo.FDLU_C,
            FDLU_T: oStaffInfo.FDLU_T,
            JOIN_DATE: oStaffInfo.JOIN_DATE,
            PAYSCALE_GRP_C: oStaffInfo.PAYSCALE_GRP_C,
            PAYSCALE_GRP_T: oStaffInfo.PAYSCALE_GRP_T,
            JOB_LVL_C: oStaffInfo.JOB_LVL_C,
            JOB_LVL_T: oStaffInfo.JOB_LVL_T,
            JOB_GRD_C: oStaffInfo.JOB_GRD_C,
            JOB_GRD_T: oStaffInfo.JOB_GRD_T,
            NUSNET_ID: oStaffInfo.NUSNET_ID,
            START_DATE: oStaffInfo.START_DATE,
            END_DATE: oStaffInfo.END_DATE
          }
          utilResponse.staffInfo.primaryAssignment = primaryAssignment
        } else {
          let otherAssignment = {
            SF_STF_NUMBER: oStaffInfo.SF_STF_NUMBER,
            STF_NUMBER: oStaffInfo.STF_NUMBER,
            ULU_C: oStaffInfo.ULU_C,
            ULU_T: oStaffInfo.ULU_T,
            FDLU_C: oStaffInfo.FDLU_C,
            FDLU_T: oStaffInfo.FDLU_T,
            JOIN_DATE: oStaffInfo.JOIN_DATE,
            PAYSCALE_GRP_C: oStaffInfo.PAYSCALE_GRP_C,
            PAYSCALE_GRP_T: oStaffInfo.PAYSCALE_GRP_T,
            JOB_LVL_C: oStaffInfo.JOB_LVL_C,
            JOB_LVL_T: oStaffInfo.JOB_LVL_T,
            JOB_GRD_C: oStaffInfo.JOB_GRD_C,
            JOB_GRD_T: oStaffInfo.JOB_GRD_T,
            NUSNET_ID: oStaffInfo.NUSNET_ID,
            START_DATE: oStaffInfo.START_DATE,
            END_DATE: oStaffInfo.END_DATE
          }
          utilResponse.staffInfo.otherAssignment.push(otherAssignment);
        }
  
      
  
      // fetch approval matrix
  
      let approvalMatrixList = await QueryRepo.fetchAuthDetails(utilResponse.staffInfo.STAFF_ID);
      let inboxApprovalMatrixList = await QueryRepo.fetchInboxApproverMatrix(oConnection, srv, utilResponse.staffInfo.STAFF_ID);
      let adminList = await QueryRepo.fetchAdminDetails(oConnection, srv, utilResponse.staffInfo.STAFF_ID);
      if (!approvalMatrixList || Object.keys(approvalMatrixList).length === 0) {
        approvalMatrixList = [];
      }
  
      approvalMatrixList = [...approvalMatrixList, ...adminList];
  
      let authorizationList = [];
      if (approvalMatrixList && approvalMatrixList.length > 0) {
        approvalMatrixList.forEach(eam => {
          let approvalMatrix = {
            ULU_C: eam.ULU_C,
            FDLU_C: eam.FDLU_C,
            ULU_T: eam.ULU_T,
            FDLU_T: eam.FDLU_T,
            STAFF_USER_GRP: eam.STAFF_USER_GRP,
            VALID_FROM: eam.VALID_FROM,
            VALID_TO: eam.VALID_TO,
            PROCESS_CODE: eam.PROCESS_CODE
          };
          authorizationList.push(approvalMatrix);
        });
      }
      utilResponse.staffInfo.claimAuthorizations = authorizationList;
  
      let approverMatrixList = [];
      if (approvalMatrixList && approvalMatrixList.length > 0) {
        approvalMatrixList.forEach(eam => {
          let approverMatrix = {
            ULU_C: eam.ULU_C,
            FDLU_C: eam.FDLU_C,
            ULU_T: eam.ULU_T,
            FDLU_T: eam.FDLU_T,
            STAFF_USER_GRP: eam.STAFF_USER_GRP,
            VALID_FROM: eam.VALID_FROM,
            VALID_TO: eam.VALID_TO,
            PROCESS_CODE: eam.PROCESS_CODE
          };
          approverMatrixList.push(approverMatrix);
        });
      }
  
      utilResponse.staffInfo.approverMatrix = approverMatrixList;
  
  
      let inboxApproverMatrixList = [];
      if (inboxApprovalMatrixList && inboxApprovalMatrixList.length > 0) {
        inboxApprovalMatrixList.forEach(eam => {
          let inboxApproverMatrix = {
            ULU_C: eam.ULU_C,
            FDLU_C: eam.FDLU_C,
            STAFF_USER_GRP: eam.STAFF_USER_GRP,
            VALID_FROM: eam.VALID_FROM,
            VALID_TO: eam.VALID_TO,
            PROCESS_CODE: eam.PROCESS_CODE
          };
          inboxApproverMatrixList.push(inboxApproverMatrix);
        });
      }
  
      utilResponse.staffInfo.inboxApproverMatrix = inboxApproverMatrixList;
      utilResponse.isError = "false";
      utilResponse.message = "success"
  
      return utilResponse;
    }else{
      throw new ApplicationException("Error in fetching user information.");
    }
    
  },

  handleError: function (request, oError) {
    if (!request.errors) {
      const iErrorCode = oError.code && oError.code >= 400 ? oError.code : 500;
      let sMSG = oError.message
        ? oError.message
        : "Error during processing request!";
      request.error({
        code: "500",
        status: iErrorCode,
        message: sMSG,
      });
    }
  },

  _userInformationBasedOnNusnetIdOrStaffId: async function (upperNusNetId) {
    let userDetails = await QueryRepo.fetchStaffInfo(upperNusNetId);
    if (!userDetails || Object.keys(userDetails).length === 0) {
      userDetails = await QueryRepo.fetchExternalUser(upperNusNetId);
      userDetails.EXTERNAL_USER = ApplicationConstants.X;
    } else {
      userDetails.EXTERNAL_USER = "";
    }
    userDetails.ULU_T = await commonQuery.fetchDistinctULU(userDetails.ULU_C);
    userDetails.FDLU_T = await commonQuery.fetchDistinctFDLU(userDetails.FDLU_C);

    return userDetails;
  }

};
