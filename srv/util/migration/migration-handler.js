"use strict";
const Connection = require("../../util/request/connection.class");
const ExternalApiCall = require("../../external/external-api-call");
const UpsertHandler = require("../databaseOperations/upsert-handler.class");
const TableConfig = require("../migration/migration-table-config");
const hanaDbHost =
  process.env.hanaDbHost ||
  "https://nusbtpqahanaduxmssmjjx.ap1.hana.ondemand.com";
const hanaDbUser = process.env.hanaDbUser || "BTPAPP_QA_ADMIN";
const hanaDbPwd = process.env.hanaDbPwd || "NusBtpAppqa!55w0rd";
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
    let relativePath = "/eclaims/services/migration.xsjs?cmd=";

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
        case "CHRS_JOB_INFO":
        case "CHRS_COST_DIST":
        case "CHRS_HRP_INFO":
        case "CHRS_FDLU_ULU":
          relativePath += "fetchFullData";
          oPayload = {
            SCHEMA: "NUS_BTP_EC_MASTERDATA",
            TABLE: "nusmasterdata::Tables." + Tablename
          };
          break;
        case "APP_CONFIGS":
        case "CHRS_APPROVER_MATRIX":
          relativePath += "fetchFullData";
          oPayload = {
            SCHEMA: "NUS_BTP_UTILITIES",
            TABLE: "utilities::Tables." + Tablename
          };
          break;
        default:
          const error = new Error("Invalid Tablename provided.");
          error.code = 400;
          error.statusCode = 400;
          throw error;
      }

      //setting the api config
      const url = hanaDbHost + relativePath;
      const username = hanaDbUser;
      const password = hanaDbPwd;
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

        // switch (Tablename) {
        //   case "ECLAIMS_DATA":
        //     targetTableConfigHdrData =
        //       TableConfig.getEclaimHeaderDataTableConfig(oConnection.srv);
        //     upsertTargetTableDataResp = new UpsertHandler(
        //       responseData,
        //       oConnection,
        //       targetTableConfigHdrData
        //     );
        //     return {
        //       oUpsertEclaimHeaderDataResult:
        //         await oUpsertEclaimHeaderData.handleRequest([]),
        //     };
        //     break;
        //   case "ECLAIMS_ITEMS_DATA":
        //     targetTableConfigHdrData =
        //       TableConfig.getEclaimItemDataTableConfig(oConnection.srv);
        //     const oUpsertEclaimItemData = new UpsertHandler(
        //       responseData,
        //       oConnection,
        //       targetTableConfigHdrData
        //     );
        //     return {
        //       oUpsertEclaimItemDataResult:
        //         await oUpsertEclaimItemData.handleRequest([]),
        //     };
        //     break;
        //   case "TAX_BFT_CLAIMS_GRP":
        //     const oTableConfigTaxBenefitClaimGrpData =
        //       TableConfig.getTaxBenefitClaimGrpDataTableConfig(oConnection.srv);
        //     const oUpsertTaxBenefitClaimGrpData = new UpsertHandler(
        //       responseData,
        //       oConnection,
        //       oTableConfigTaxBenefitClaimGrpData
        //     );
        //     return {
        //       oUpsertTaxBenefitClaimGrpResult:
        //         await oUpsertTaxBenefitClaimGrpData.handleRequest([]),
        //     };
        //     break;
        //   case "CHRS_JOB_INFO":
        //     break;
        //   case "CHRS_COST_DIST":
        //   case "CHRS_HRP_INFO":
        //   case "CHRS_FDLU_ULU":
        //   default:
        //     const error = new Error("Invalid Tablename provided.");
        //     error.code = 400;
        //     error.statusCode = 400;
        //     throw error;
        // }
      }
    }
  },
}