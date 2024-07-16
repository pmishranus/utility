"use strict";
const TableConfig = require("../../util/databaseOperations/table-config.class");

module.exports = {
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
  }

  
};
