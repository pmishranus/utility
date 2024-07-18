"use strict";
const TableConfig = require("../../util/databaseOperations/table-config.class");

module.exports = {
  getTargetTableConfig: function (srv, tablename) {
    let oTableConfig = {
      sTableName: "nusext_",
      sType: "root",
      sCardinality: "single",
      sDelete: "none",
      sTimestamps: "none",
      exists: true
    };

    let contextName;
    switch (tablename) {
      case "ECLAIMS_DATA":
        contextName = "ECLAIMS_";
        oTableConfig.aPrimaryKeys = ["DRAFT_ID"];
        oTableConfig.oTable = srv.entities.HEADER_DATA;
        break;
      case "ECLAIMS_ITEMS_DATA":
        contextName = "ECLAIMS_";
        oTableConfig.aPrimaryKeys = ["ITEM_ID"];
        oTableConfig.oTable = srv.entities.ITEMS_DATA;
        break;
      case "TAX_BFT_CLAIMS_GRP":
        contextName = "ECLAIMS_";
        oTableConfig.aPrimaryKeys = ["BEN_TYPE"];
        oTableConfig.oTable = srv.entities.TAX_BFT_CLAIMS_GRP;
        break;
      case "CHRS_JOB_INFO":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["STF_NUMBER", "SF_STF_NUMBER", "SEQ_NUMBER", "START_DATE", "END_DATE"];
        oTableConfig.oTable = srv.entities.CHRS_JOB_INFO;
        break;
      case "CHRS_COST_DIST":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE"];
        oTableConfig.oTable = srv.entities.CHRS_COST_DIST;
        break;
      case "CHRS_HRP_INFO":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE"];
        oTableConfig.oTable = srv.entities.CHRS_HRP_INFO;
        break;
      case "CHRS_COMP_INFO":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["SF_STF_NUMBER", "START_DATE", "END_DATE", "RATE_TYPE_C"];
        oTableConfig.oTable = srv.entities.CHRS_COMP_INFO;
        break;
      case "APP_CONFIGS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["ACFG_ID"];
        oTableConfig.oTable = srv.entities.APP_CONFIGS;
        break;
      case "CHRS_APPROVER_MATRIX":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["AUTH_ID"];
        oTableConfig.oTable = srv.entities.CHRS_APPROVER_MATRIX;
        break;
      default:
        oTableConfig.exists = false;
        break;
    }

    if (contextName) {
      oTableConfig.sTableName += contextName + tablename;
    }
    return new TableConfig(oTableConfig);

  },

  getEclaimHeaderDataTableConfig: function (srv) {
    const oTableConfig = {
      sTableName: "nusext_ECLAIMS_HEADER_DATA",
      aPrimaryKeys: ["DRAFT_ID"],
      oTable: srv.entities.HEADER_DATA,
      sType: "root",
      sCardinality: "single",
      sDelete: "none",
      sTimestamps: "none",
    };
    return new TableConfig(oTableConfig);
  },
  getEclaimItemDataTableConfig: function (srv) {
    const oTableConfig = {
      sTableName: "nusext_ECLAIMS_ITEMS_DATA",
      aPrimaryKeys: ["ITEM_ID"],
      oTable: srv.entities.ITEMS_DATA,
      sType: "root",
      sCardinality: "single",
      sDelete: "none",
      sTimestamps: "none",
    };
    return new TableConfig(oTableConfig);
  },

  getTaxBenefitClaimGrpDataTableConfig: function (srv) {
    const oTableConfig = {
      sTableName: "nusext_ECLAIMS_TAX_BFT_CLAIMS_GRP",
      aPrimaryKeys: ["BEN_TYPE"],
      oTable: srv.entities.TAX_BFT_CLAIMS_GRP,
      sType: "root",
      sCardinality: "single",
      sDelete: "none",
      sTimestamps: "none",
    };
    return new TableConfig(oTableConfig);
  },

  getChrsJobInfoDataTableConfig: function (srv) {
    const oTableConfig = {
      sTableName: "nusext_MASTER_DATA_CHRS_JOB_INFO",
      aPrimaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "SEQ_NUMBER", "START_DATE", "END_DATE"],
      oTable: srv.entities.JOB_INFO_DATA,
      sType: "root",
      sCardinality: "single",
      sDelete: "none",
      sTimestamps: "none",
    };
    return new TableConfig(oTableConfig);
  },
  getChrsCostDist: function (srv) {
    const oTableConfig = {
      sTableName: "nusext_MASTER_DATA_CHRS_COST_DIST",
      aPrimaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE"],
      oTable: srv.entities.COST_DIST_DATA,
      sType: "root",
      sCardinality: "single",
      sDelete: "none",
      sTimestamps: "none",
    };
    return new TableConfig(oTableConfig);
  }
};
