"use strict";
const TableConfig = require("../../util/databaseOperations/table-config.class");

module.exports = {
  getTargetTableConfig: function (srv, tablename,) {
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
        tablename = "HEADER_DATA";
        oTableConfig.aPrimaryKeys = ["DRAFT_ID"];
        oTableConfig.oTable = srv.entities.HEADER_DATA;
        break;
      case "ECLAIMS_ITEMS_DATA":
        contextName = "ECLAIMS_";
        tablename = "ITEMS_DATA";
        oTableConfig.aPrimaryKeys = ["ITEM_ID"];
        oTableConfig.oTable = srv.entities.ITEMS_DATA;
        break;
      case "TAX_BFT_CLAIMS_GRP":
        contextName = "ECLAIMS_";
        oTableConfig.aPrimaryKeys = ["BEN_TYPE"];
        oTableConfig.oTable = srv.entities.TAX_BFT_CLAIMS_GRP;
        break;
      case "CWS_DATA":
        contextName = "CWNED_";
        tablename = "HEADER_DATA";
        oTableConfig.aPrimaryKeys = ["REQ_UNIQUE_ID"];
        oTableConfig.oTable = srv.entities.CWS_HEADER_DATA;
        break;
      case "CWS_ASSISTANCE_DATA":
        contextName = "CWNED_";
        tablename = "ASSISTANCE_DATA";
        oTableConfig.aPrimaryKeys = ["ASSISTANCE_ID"];
        oTableConfig.oTable = srv.entities.CWS_ASSISTANCE_DATA;
        break;
      case "CWS_PAYMENT_DATA":
        contextName = "CWNED_";
        tablename = "PAYMENT_DATA";
        oTableConfig.aPrimaryKeys = ["PAYMENT_ID"];
        oTableConfig.oTable = srv.entities.CWS_PAYMENT_DATA;
        break;
      case "CWS_WBS_DATA":
        contextName = "CWNED_";
        tablename = "WBS_DATA";
        oTableConfig.aPrimaryKeys = ["ID"];
        oTableConfig.oTable = srv.entities.CWS_WBS_DATA;
        break;
      case "CWS_YEAR_SPLIT_DATA":
        contextName = "CWNED_";
        tablename = "YEAR_SPLIT_DATA";
        oTableConfig.aPrimaryKeys = ["SPLIT_ID"];
        oTableConfig.oTable = srv.entities.CWS_YEAR_SPLIT_DATA;
        break;
      case "OPWN_OTP_CONSOLIDATED_DATA":
        contextName = "CWNED_";
        tablename = "OPWN_OTP_CONSOLIDATED_DATA";
        oTableConfig.aPrimaryKeys = ["SF_SEQUENCE"];
        oTableConfig.oTable = srv.entities.OPWN_OTP_CONSOLIDATED_DATA;
        break;
      case "OPWN_OTP_CONSOLIDATED_ERR_DATA":
        contextName = "CWNED_";
        tablename = "OPWN_OTP_CONSOLIDATED_ERR_DATA";
        oTableConfig.aPrimaryKeys = ["SF_SEQUENCE"];
        oTableConfig.oTable = srv.entities.OPWN_OTP_CONSOLIDATED_ERR_DATA;
        break;
      case "OPWN_PAYMENT_IMG_DATA":
        contextName = "CWNED_";
        tablename = "OPWN_PAYMENT_IMG_DATA";
        oTableConfig.aPrimaryKeys = ["PAYMENT_ID"];
        oTableConfig.oTable = srv.entities.OPWN_PAYMENT_IMG_DATA;
        break;
      case "CWS_REPORT_EXTRACT_DATA":
        contextName = "CWNED_";
        tablename = "CWS_REPORT_EXTRACT_DATA";
        oTableConfig.aPrimaryKeys = ["REP_EXTRACT_ID"];
        oTableConfig.oTable = srv.entities.REP_EXTRACT_ID;
        break;
      case "CHRS_JOB_INFO":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["STF_NUMBER", "SF_STF_NUMBER", "SEQ_NUMBER", "START_DATE", "END_DATE"];
        oTableConfig.oTable = srv.entities.CHRS_JOB_INFO;
        break;
      case "RATE_TYPE_MASTER_DATA":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["ID"];
        oTableConfig.oTable = srv.entities.RATE_TYPE_MASTER_DATA;
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
      case "CHRS_FDLU_ULU":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["FDLU_C"];
        oTableConfig.oTable = srv.entities.CHRS_FDLU_ULU;
        break;
      case "MASTER_CLAIM_TYPE":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["CLAIM_TYPE_C"];
        oTableConfig.oTable = srv.entities.MASTER_CLAIM_TYPE;
        break;
      case "CHRS_ROLE_MASTER":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["ROLE_ID"];
        oTableConfig.oTable = srv.entities.CHRS_ROLE_MASTER;
        break;
      case "CHRS_EXTERNAL_USERS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE"];
        oTableConfig.oTable = srv.entities.CHRS_EXTERNAL_USERS;
        break;
      case "CHRS_REPLICATION_JOB_INFO":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["STF_NUMBER", "SF_STF_NUMBER", "SEQ_NUMBER", "START_DATE", "END_DATE", "MODIFIED_ON"];
        oTableConfig.oTable = srv.entities.CHRS_REPLICATION_JOB_INFO;
        break;
      case "CHRS_REPLICATION_COMP_INFO":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["SF_STF_NUMBER", "START_DATE", "END_DATE", "RATE_TYPE_C", "MODIFIED_ON"];
        oTableConfig.oTable = srv.entities.CHRS_REPLICATION_COMP_INFO;
        break;
      case "CHRS_REPLICATION_HRP_INFO":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE", "MODIFIED_ON"];
        oTableConfig.oTable = srv.entities.CHRS_REPLICATION_HRP_INFO;
        break;
      case "CHRS_REPLICATION_COST_DIST":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE", "MODIFIED_ON"];
        oTableConfig.oTable = srv.entities.CHRS_REPLICATION_COST_DIST;
        break;
      case "CHRS_PARAM_ENTRIES":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["REF_KEY"];
        oTableConfig.oTable = srv.entities.CHRS_PARAM_ENTRIES;
        break;
      case "CHRS_ELIG_CRITERIA":
        contextName = "MASTER_DATA_";
        oTableConfig.aPrimaryKeys = ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE", "CLAIM_TYPE", "STF_CLAIM_TYPE_CAT"];
        oTableConfig.oTable = srv.entities.CHRS_ELIG_CRITERIA;
        break;
      case "BTP_CREDENTIALS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["CID"];
        oTableConfig.oTable = srv.entities.BTP_CREDENTIALS;
        break;
      case "EMAIL_TEMPLATES":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["TEMPLATE_NAME"];
        oTableConfig.oTable = srv.entities.EMAIL_TEMPLATES;
        break;
      case "EMAIL_CONFIGS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["ECONFIG_ID"];
        oTableConfig.oTable = srv.entities.EMAIL_CONFIGS;
        break;
      case "EMAIL_PLACEHOLDER_CONFIG":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["EPH_ID"];
        oTableConfig.oTable = srv.entities.EMAIL_PLACEHOLDER_CONFIG;
        break;
      case "AUDIT_LOG_DATA":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["AUDIT_ID"];
        oTableConfig.oTable = srv.entities.AUDIT_LOG_DATA;
        break;
      case "ATTACHMENTS_DATA":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["ATTCHMNT_ID"];
        oTableConfig.oTable = srv.entities.ATTACHMENTS_DATA;
        break;
      case "NOTIFICATION_LOG_DATA":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["NOTIF_ID"];
        oTableConfig.oTable = srv.entities.NOTIFICATION_LOG_DATA;
        break;
      case "STATUS_CONFIG":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["STATUS_CODE"];
        oTableConfig.oTable = srv.entities.STATUS_CONFIG;
        break;
      case "PROCESS_CONFIG":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["PROCESS_CODE"];
        oTableConfig.oTable = srv.entities.PROCESS_CONFIG;
        break;
      case "APP_CONFIGS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["ACFG_ID"];
        oTableConfig.oTable = srv.entities.APP_CONFIGS;
        break;
      case "CWS_APP_CONFIGS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["CWS_ACFG_ID"];
        oTableConfig.oTable = srv.entities.CWS_APP_CONFIGS;
        break;
      case "REQUEST_LOCK_DETAILS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["LOCK_INST_ID"];
        oTableConfig.oTable = srv.entities.REQUEST_LOCK_DETAILS;
        break;
      case "CHRS_APPROVER_MATRIX":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["AUTH_ID"];
        oTableConfig.oTable = srv.entities.CHRS_APPROVER_MATRIX;
        break;
      case "REMARKS_DATA":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["ID"];
        oTableConfig.oTable = srv.entities.REMARKS_DATA;
        break;
      case "PROCESS_DETAILS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["PROCESS_INST_ID"];
        oTableConfig.oTable = srv.entities.PROCESS_DETAILS;
        break;
      case "TASK_DETAILS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["TASK_INST_ID"];
        oTableConfig.oTable = srv.entities.TASK_DETAILS;
        break;
      case "TASKS_CONFIG":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["TCFG_ID"];
        oTableConfig.oTable = srv.entities.TASKS_CONFIG;
        break;
      case "TASK_ACTION_CONFIG":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["TACTION_ID"];
        oTableConfig.oTable = srv.entities.TASK_ACTION_CONFIG;
        break;
      case "CLAIM_REQUEST_DURATION_CONFIG":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["CONFIG_ID"];
        oTableConfig.oTable = srv.entities.CLAIM_REQUEST_DURATION_CONFIG;
        break;
      case "PROCESS_PARTICIPANTS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["PPNT_ID"];
        oTableConfig.oTable = srv.entities.PROCESS_PARTICIPANTS;
        break;
      case "DASHBOARD_CONFIG":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["DS_ACFG_ID"];
        oTableConfig.oTable = srv.entities.DASHBOARD_CONFIG;
        break;
      case "FEEDBACK_DETAILS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["SEQ_NO"];
        oTableConfig.oTable = srv.entities.FEEDBACK_DETAILS;
        break;
      case "NUS_CHRS_HOLIDAYS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["SEQ_NO"];
        oTableConfig.oTable = srv.entities.NUS_CHRS_HOLIDAYS;
        break;
      case "DATE_TO_WEEK":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["WEEK"];
        oTableConfig.oTable = srv.entities.DATE_TO_WEEK;
        break;
      case "TASK_DELEGATION_DETAILS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["ID"];
        oTableConfig.oTable = srv.entities.TASK_DELEGATION_DETAILS;
        break;
      case "TICKET_MGMT_DETAILS":
        contextName = "UTILITY_";
        oTableConfig.aPrimaryKeys = ["TCKT_ID"];
        oTableConfig.oTable = srv.entities.TICKET_MGMT_DETAILS;
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
