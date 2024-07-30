const { application } = require("express");
const Connection = require("../../util/request/connection.class");
const ApplicationConstants = require("../app-constant");
const QueryRepo = require("../query-repo");
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

      return await this._fnFetchLoggedInUserDetails(userName, oConnection.srv);
    } catch (oError) {
      this.handleError(oConnection.request, oError);
    }
  },

  _fnFetchLoggedInUserDetails: async function (userName, srv) {
    let utilResponse = {
      is_external_user: '',
      staffInfo: {
        otherAssignment : []
      }
    };

    const upperNusNetId = userName.toUpperCase();
    
    // let staffInfo = await cds.run(SELECT.from(srv.entities["chrs_job_info"])
    //   .where(stfInfoQueryParameter)
    // );
    let staffInfo = await QueryRepo.fetchStaffInfo(upperNusNetId);
    if (!staffInfo || Object.keys(staffInfo).length === 0) {
      staffInfo = await QueryRepo.fetchExternalUser(upperNusNetId);
      utilResponse.is_external_user = ApplicationConstants.X;
    } else {
      utilResponse.staffInfo = actualUser;
    }

    for (let i = 0; i < utilResponse.staffInfo.length; i++) {
      let oStaffInfo = utilResponse.staffInfo[i];
      utilResponse.staffInfo.FULL_NM = oStaffInfo.FULL_NM;
      utilResponse.staffInfo.EMAIL = oStaffInfo.EMAIL;
      utilResponse.staffInfo.FIRST_NM = oStaffInfo.FIRST_NM;
      utilResponse.staffInfo.LAST_NM = oStaffInfo.LAST_NM;
      utilResponse.staffInfo.STAFF_ID = oStaffInfo.STAFF_ID;

      if ((!oStaffInfo.BANK_INFO_FLG || oStaffInfo.BANK_INFO_FLG.trim() === '') && oStaffInfo.BANK_INFO_FLG !== ApplicationConstants.X) {
        utilResponse.staffInfo.BANK_INFO_FLG = ApplicationConstants.N;
      }else{
        utilResponse.staffInfo.BANK_INFO_FLG = ApplicationConstants.Y
      }


      // Cost Distribution implementation

      utilResponse.staffInfo.COST_DIST_FLG = oStaffInfo.FULL_NM;

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
      }else{
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

    }

    return { Name: "Pnakaj" };
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
};
