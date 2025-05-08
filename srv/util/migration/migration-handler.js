"use strict";
const Connection = require("../../util/request/connection.class");
const ExternalApiCall = require("../../external/external-api-call");
const UpsertHandler = require("../databaseOperations/upsert-handler.class");
const TableConfig = require("../migration/migration-table-config");
const hanaDbHost =
  process.env.hanaDbHost ||
  "https://nusbtpqahanaduxmssmjjx.ap1.hana.ondemand.com";
// const hanaDbUser = process.env.hanaDbUser || "BTPAPP_QA_ADMIN";
// const hanaDbPwd = process.env.hanaDbPwd || "NusBtpAppqa!55w0rd";
const credStore = require("../common/credStore");
module.exports = {
  /**
   *
   * @param {object} request CAP Request Object
   * @param {oject} db CAP DB Object
   * @param {object} srv CAP DB Object
   * @returns {Promise<Object>} Result of Updated Entries in JSON
   */
  loadMigratedData: function (request, db, srv) {
    const oConnection = new Connection(request, db, srv);
    return oConnection.createConnection(this.handleTableDataUpdate);
  },

  handleTableDataUpdate: async function (oConnection) {
    const { Tablename } = oConnection.request.data;
    let oPayload = {};
    let relativePath = "/eclaims/services/migration_node.xsjs?cmd=";

    if (!Tablename) {
      const error = new Error("Please provide Tablename parameter..!!");
      error.code = 400;
      error.statusCode = 400;
      throw error;
    } else {
      switch (Tablename) {
        case "ECLAIMS_DATA":
        case "ECLAIMS_ITEMS_DATA":
        case "TAX_BFT_CLAIMS_GRP":
          relativePath += "fetchData";
          oPayload = {
            SCHEMA: "NUS_BTP_APPNS",
            TABLE: "eclaims::Tables." + Tablename
          };

          break;
        case "CWS_DATA":
        case "CWS_YEAR_SPLIT_DATA":
        case "CWS_WBS_DATA":
        case "CWS_ASSISTANCE_DATA":
        case "CWS_PAYMENT_DATA":
        case "CWS_REPORT_EXTRACT_DATA":
        case "OPWN_OTP_CONSOLIDATED_DATA":
        case "OPWN_OTP_CONSOLIDATED_ERR_DATA":
        case "OPWN_PAYMENT_IMG_DATA":
          relativePath += "fetchData";
          oPayload = {
            SCHEMA: "NUS_BTP_APPNS",
            TABLE: "cwsned::Tables." + Tablename
          };

          break;
        case "CHRS_JOB_INFO":
        case "CHRS_COMP_INFO":
        case "CHRS_COST_DIST":
        case "CHRS_HRP_INFO":
        case "CHRS_FDLU_ULU":
        case "MASTER_CLAIM_TYPE":
        case "CHRS_ELIG_CRITERIA":
        case "CHRS_ULU_FDLU_PA_PSA":
        case "CHRS_PAYROLL_AREA":
        case "RATE_TYPE_MASTER_DATA":
        case "EMPLOYEE_LISTING_CONCUR":
        case "CHRS_REPLICATION_JOB_INFO":
        case "CHRS_REPLICATION_HRP_INFO":
        case "CHRS_REPLICATION_COMP_INFO":
        case "CHRS_REPLICATION_COST_DIST":
        case "CHRS_PARAM_ENTRIES":
          relativePath += "fetchData";
          oPayload = {
            SCHEMA: "NUS_BTP_EC_MASTERDATA",
            TABLE: "nusmasterdata::Tables." + Tablename
          };
          break;
        case "APP_CONFIGS":
        case "CWS_APP_CONFIGS":
        case "CHRS_APPROVER_MATRIX":
        case "CHRS_ROLE_MASTER":
        case "PROCESS_CONFIG":
        case "CHRS_EXTERNAL_USERS":
        case "REMARKS_DATA":
        case "PROCESS_DETAILS":
        case "TASK_DETAILS":
        case "DASHBOARD_CONFIG":
        case "BTP_CREDENTIALS":
        case "EMAIL_TEMPLATES":
        case "EMAIL_CONFIGS":
        case "EMAIL_PLACEHOLDER_CONFIG":
        case "AUDIT_LOG_DATA":
        case "ATTACHMENTS_DATA":
        case "NOTIFICATION_LOG_DATA":
        case "STATUS_CONFIG":
        case "TASKS_CONFIG":
        case "TASK_ACTION_CONFIG":
        case "CLAIM_REQUEST_DURATION_CONFIG":
        case "PROCESS_PARTICIPANTS":
        case "TASK_DELEGATION_DETAILS":
        case "CWS_ULU_EMAIL_CONFIG":
        case "REQUEST_LOCK_DETAILS":
        case "FEEDBACK_DETAILS":
        case "NUS_CHRS_HOLIDAYS":
        case "DATE_TO_WEEK":
        case "TICKET_MGMT_DETAILS":
          relativePath += "fetchData";
          oPayload = {
            SCHEMA: "NUS_BTP_UTILS",
            TABLE: "utilities::Tables." + Tablename
          };
          break;
        default:
          const error = new Error("Invalid Tablename provided.");
          error.code = 400;
          error.statusCode = 400;
          throw error;
      }

      //credential store beginning

      let credStoreBinding = JSON.parse(process.env.VCAP_SERVICES).credstore[0].credentials;

      let credPassword = {
        name: "hana_login_password"
      };

      let oRetCredential = await credStore.readCredential(credStoreBinding, "hana_db", "password", credPassword.name);




      //end of credential store

      //setting the api config
      if (!oRetCredential || !oRetCredential.metadata || !oRetCredential.username || !oRetCredential.value) {
        const error = new Error("Client Credentials Not Available");
        error.code = 400;
        error.statusCode = 400;
        throw error;
      }
      const url = oRetCredential.metadata + relativePath;
      const username = oRetCredential.username;
      const password = oRetCredential.value;
      const auth = Buffer.from(`${username}:${password}`).toString("base64");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
      };
      const response = await ExternalApiCall._fnAxiosCall("POST", url, oPayload, config);

      let responseData = response.data.result;
      // let oUpsertEclaimHeaderDataResult;
      if (responseData) {
        const targetTableConfigHdrData = TableConfig.getTargetTableConfig(oConnection.srv, Tablename);

        if (targetTableConfigHdrData.exists) {
          const upsertTargetTableDataResp = new UpsertHandler(
            responseData,
            oConnection,
            targetTableConfigHdrData
          );

          return {
            result:
              await upsertTargetTableDataResp.handleRequest([]),
          };
        } else {
          const error = new Error("Invalid Tablename provided.");
          error.code = 400;
          error.statusCode = 400;
          throw error;
        }
      }
    }
  },
}