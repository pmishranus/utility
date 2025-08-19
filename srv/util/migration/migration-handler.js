"use strict";
const ExternalApiCall = require("../../external/external-api-call");
const credStore = require("../common/credStore");
const Connection = require("../../util/request/connection.class");
const UpsertHandler = require("../databaseOperations/upsert-handler.class");
const TableConfig = require("../migration/migration-table-config");
const cds = require("@sap/cds");
const { SELECT, DELETE, UPDATE, INSERT } = require("@sap/cds/lib/ql/cds-ql");
const { v4: uuidv4 } = require('uuid');
module.exports = {
  /**
   * Original method for backward compatibility
   * @param {object} request CAP Request Object
   * @param {object} db CAP DB Object
   * @param {object} srv CAP DB Object
   * @returns {Promise<Object>} Result of Updated Entries in JSON
   */
  loadMigratedData: function (request, db, srv) {
    const oConnection = new Connection(request, db, srv);
    return oConnection.createConnection(this.handleTableDataUpdate);
  },

  /**
   * New simplified method to handle multiple table data loading
   * @param {object} request CAP Request Object
   * @param {object} db CAP DB Object
   * @param {object} srv CAP DB Object
   * @returns {Promise<Object>} Result of multiple table processing
   */
  loadMultipleTableData: async function (request, db, srv) {
    const { tableNames, deleteOnly = false } = request.data;

    if (!tableNames || !Array.isArray(tableNames) || tableNames.length === 0) {
      const error = new Error("Please provide a valid array of table names.");
      error.code = 400;
      error.statusCode = 400;
      throw error;
    }

    const results = [];
    let processedTables = 0;
    let failedTables = 0;

    // Process tables sequentially to ensure proper order
    for (const tableName of tableNames) {
      try {
        const result = await this.processSingleTable(tableName, deleteOnly, db, srv);
        processedTables++;

        const operationType = deleteOnly ? "deleted only" : "deleted and recreated";
        results.push({
          tableName: tableName,
          success: true,
          message: `Successfully processed table: ${tableName} (${operationType})`,
          result: result,
          error: null
        });
      } catch (error) {
        failedTables++;
        results.push({
          tableName: tableName,
          success: false,
          message: `Failed to process table: ${tableName}`,
          result: null,
          error: error.message || "Unknown error occurred"
        });
      }
    }

    // Generate summary
    const totalTables = tableNames.length;
    const success = failedTables === 0;
    const operationType = deleteOnly ? "delete-only" : "delete-and-recreate";
    const summary = `Processed ${totalTables} tables (${operationType}). ${processedTables} successful, ${failedTables} failed.`;

    return {
      success: success,
      totalTables: totalTables,
      processedTables: processedTables,
      failedTables: failedTables,
      results: results,
      summary: summary
    };
  },

  /**
   * Process a single table with delete and recreate functionality
   * @param {string} tableName Name of the table to process
   * @param {boolean} deleteOnly Whether to only delete without recreating
   * @param {object} db Database connection
   * @param {object} srv Service object
   * @returns {Promise<Object>} Result of the operation
   */
  processSingleTable: async function (tableName, deleteOnly, db, srv) {
    // Get table configuration
    const tableConfig = this.getTableConfiguration(tableName, srv);

    if (!tableConfig) {
      throw new Error(`Invalid Tablename provided: "${tableName}". Please check the table name and ensure it exists in the supported tables list.`);
    }

    // Step 1: Delete existing data
    const deleteResult = await this.deleteTableData(tableName, tableConfig, db);

    // If deleteOnly is true, return after deletion
    if (deleteOnly) {
      return {
        deletedRecords: deleteResult,
        insertedRecords: 0,
        operation: "delete_only",
        tableName: tableName
      };
    }

    // Step 2: Fetch fresh data from external source
    const freshData = await this.fetchExternalData(tableName, tableConfig);

    // Step 3: Insert fresh data
    const insertResult = await this.insertTableData(tableName, tableConfig, freshData, db);

    return {
      deletedRecords: deleteResult,
      insertedRecords: insertResult,
      operation: "delete_and_recreate",
      tableName: tableName
    };
  },

  /**
   * Get table configuration based on table name
   * @param {string} tableName Name of the table
   * @param {object} srv Service object
   * @returns {object|null} Table configuration or null if not found
   */
  getTableConfiguration: function (tableName, srv) {
    // Validate service object and entities
    if (!srv || !srv.entities) {
      //console.error(`Service object or entities not available for table: ${tableName}`);
      throw new Error(`Service object or entities not available for table: ${tableName}`);
    }

    const configs = {
      // ECLAIMS Tables
      "ECLAIMS_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "eclaims::Tables.ECLAIMS_DATA",
        entity: srv.entities.HEADER_DATA,
        primaryKeys: ["DRAFT_ID"]
      },
      "ECLAIMS_ITEMS_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "eclaims::Tables.ECLAIMS_ITEMS_DATA",
        entity: srv.entities.ITEMS_DATA,
        primaryKeys: ["ITEM_ID"]
      },
      "TAX_BFT_CLAIMS_GRP": {
        schema: "NUS_BTP_APPNS",
        table: "eclaims::Tables.TAX_BFT_CLAIMS_GRP",
        entity: srv.entities.TAX_BFT_CLAIMS_GRP,
        primaryKeys: ["BEN_TYPE"]
      },

      // CWS Tables
      "CWS_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "cwsned::Tables.CWS_DATA",
        entity: srv.entities.CWS_HEADER_DATA,
        primaryKeys: ["REQ_UNIQUE_ID"]
      },
      "CWS_ASSISTANCE_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "cwsned::Tables.CWS_ASSISTANCE_DATA",
        entity: srv.entities.CWS_ASSISTANCE_DATA,
        primaryKeys: ["ASSISTANCE_ID"]
      },
      "CWS_PAYMENT_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "cwsned::Tables.CWS_PAYMENT_DATA",
        entity: srv.entities.CWS_PAYMENT_DATA,
        primaryKeys: ["PAYMENT_ID"]
      },
      "CWS_WBS_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "cwsned::Tables.CWS_WBS_DATA",
        entity: srv.entities.CWS_WBS_DATA,
        primaryKeys: ["ID"]
      },
      "CWS_YEAR_SPLIT_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "cwsned::Tables.CWS_YEAR_SPLIT_DATA",
        entity: srv.entities.CWS_YEAR_SPLIT_DATA,
        primaryKeys: ["SPLIT_ID"]
      },
      "OPWN_PAYMENT_IMG_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "cwsned::Tables.OPWN_PAYMENT_IMG_DATA",
        entity: srv.entities.OPWN_PAYMENT_IMG_DATA,
        primaryKeys: ["ID"]
      },
      "OPWN_OTP_CONSOLIDATED_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "cwsned::Tables.OPWN_OTP_CONSOLIDATED_DATA",
        entity: srv.entities.OPWN_OTP_CONSOLIDATED_DATA,
        primaryKeys: ["ID"]
      },
      "OPWN_OTP_CONSOLIDATED_ERR_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "cwsned::Tables.OPWN_OTP_CONSOLIDATED_ERR_DATA",
        entity: srv.entities.OPWN_OTP_CONSOLIDATED_ERR_DATA,
        primaryKeys: ["ID"]
      },
      "CWS_REPORT_EXTRACT_DATA": {
        schema: "NUS_BTP_APPNS",
        table: "cwsned::Tables.CWS_REPORT_EXTRACT_DATA",
        entity: srv.entities.CWS_REPORT_EXTRACT_DATA,
        primaryKeys: ["ID"]
      },

      // CHRS Tables
      "CHRS_JOB_INFO": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_JOB_INFO",
        entity: srv.entities.CHRS_JOB_INFO,
        primaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "SEQ_NUMBER", "START_DATE", "END_DATE"]
      },
      "CHRS_COST_DIST": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_COST_DIST",
        entity: srv.entities.CHRS_COST_DIST,
        primaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE"]
      },
      "CHRS_HRP_INFO": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_HRP_INFO",
        entity: srv.entities.CHRS_HRP_INFO,
        primaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE"]
      },
      "CHRS_FDLU_ULU": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_FDLU_ULU",
        entity: srv.entities.CHRS_FDLU_ULU,
        primaryKeys: ["FDLU_C"]
      },
      "CHRS_COMP_INFO": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_COMP_INFO",
        entity: srv.entities.CHRS_COMP_INFO,
        primaryKeys: ["SF_STF_NUMBER", "START_DATE", "END_DATE", "RATE_TYPE_C"]
      },
      "MASTER_CLAIM_TYPE": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.MASTER_CLAIM_TYPE",
        entity: srv.entities.MASTER_CLAIM_TYPE,
        primaryKeys: ["CLAIM_TYPE_C"]
      },
      "CHRS_ELIG_CRITERIA": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_ELIG_CRITERIA",
        entity: srv.entities.CHRS_ELIG_CRITERIA,
        primaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE", "CLAIM_TYPE", "STF_CLAIM_TYPE_CAT"]
      },
      "RATE_TYPE_MASTER_DATA": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.RATE_TYPE_MASTER_DATA",
        entity: srv.entities.RATE_TYPE_MASTER_DATA,
        primaryKeys: ["ID"]
      },
      "CHRS_REPLICATION_JOB_INFO": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_REPLICATION_JOB_INFO",
        entity: srv.entities.CHRS_REPLICATION_JOB_INFO,
        primaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "SEQ_NUMBER", "START_DATE", "END_DATE", "MODIFIED_ON"]
      },
      "CHRS_REPLICATION_HRP_INFO": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_REPLICATION_HRP_INFO",
        entity: srv.entities.CHRS_REPLICATION_HRP_INFO,
        primaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE", "MODIFIED_ON"]
      },
      "CHRS_REPLICATION_COMP_INFO": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_REPLICATION_COMP_INFO",
        entity: srv.entities.CHRS_REPLICATION_COMP_INFO,
        primaryKeys: ["SF_STF_NUMBER", "START_DATE", "END_DATE", "RATE_TYPE_C", "MODIFIED_ON"]
      },
      "CHRS_REPLICATION_COST_DIST": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_REPLICATION_COST_DIST",
        entity: srv.entities.CHRS_REPLICATION_COST_DIST,
        primaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE", "MODIFIED_ON"]
      },
      "CHRS_PARAM_ENTRIES": {
        schema: "NUS_BTP_EC_MASTERDATA",
        table: "nusmasterdata::Tables.CHRS_PARAM_ENTRIES",
        entity: srv.entities.CHRS_PARAM_ENTRIES,
        primaryKeys: ["REF_KEY"]
      },

      // UTILITY Tables
      "APP_CONFIGS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.APP_CONFIGS",
        entity: srv.entities.APP_CONFIGS,
        primaryKeys: ["ACFG_ID"]
      },
      "CWS_APP_CONFIGS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.CWS_APP_CONFIGS",
        entity: srv.entities.CWS_APP_CONFIGS,
        primaryKeys: ["CWS_ACFG_ID"]
      },
      "CHRS_APPROVER_MATRIX": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.CHRS_APPROVER_MATRIX",
        entity: srv.entities.CHRS_APPROVER_MATRIX,
        primaryKeys: ["AUTH_ID"]
      },
      "CHRS_ROLE_MASTER": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.CHRS_ROLE_MASTER",
        entity: srv.entities.CHRS_ROLE_MASTER,
        primaryKeys: ["ROLE_ID"]
      },
      "PROCESS_CONFIG": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.PROCESS_CONFIG",
        entity: srv.entities.PROCESS_CONFIG,
        primaryKeys: ["PROCESS_CODE"]
      },
      "CHRS_EXTERNAL_USERS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.CHRS_EXTERNAL_USERS",
        entity: srv.entities.CHRS_EXTERNAL_USERS,
        primaryKeys: ["STF_NUMBER", "SF_STF_NUMBER", "START_DATE", "END_DATE"]
      },
      "REMARKS_DATA": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.REMARKS_DATA",
        entity: srv.entities.REMARKS_DATA,
        primaryKeys: ["ID"]
      },
      "PROCESS_DETAILS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.PROCESS_DETAILS",
        entity: srv.entities.PROCESS_DETAILS,
        primaryKeys: ["PROCESS_INST_ID"]
      },
      "TASK_DETAILS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.TASK_DETAILS",
        entity: srv.entities.TASK_DETAILS,
        primaryKeys: ["TASK_INST_ID"]
      },
      "DASHBOARD_CONFIG": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.DASHBOARD_CONFIG",
        entity: srv.entities.DASHBOARD_CONFIG,
        primaryKeys: ["DS_ACFG_ID"]
      },
      "BTP_CREDENTIALS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.BTP_CREDENTIALS",
        entity: srv.entities.BTP_CREDENTIALS,
        primaryKeys: ["CID"]
      },
      "EMAIL_TEMPLATES": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.EMAIL_TEMPLATES",
        entity: srv.entities.EMAIL_TEMPLATES,
        primaryKeys: ["TEMPLATE_NAME"]
      },
      "EMAIL_CONFIGS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.EMAIL_CONFIGS",
        entity: srv.entities.EMAIL_CONFIGS,
        primaryKeys: ["ECONFIG_ID"]
      },
      "EMAIL_PLACEHOLDER_CONFIG": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.EMAIL_PLACEHOLDER_CONFIG",
        entity: srv.entities.EMAIL_PLACEHOLDER_CONFIG,
        primaryKeys: ["EPH_ID"]
      },
      "AUDIT_LOG_DATA": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.AUDIT_LOG_DATA",
        entity: srv.entities.AUDIT_LOG_DATA,
        primaryKeys: ["AUDIT_ID"]
      },
      "ATTACHMENTS_DATA": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.ATTACHMENTS_DATA",
        entity: srv.entities.ATTACHMENTS_DATA,
        primaryKeys: ["ATTCHMNT_ID"]
      },
      "NOTIFICATION_LOG_DATA": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.NOTIFICATION_LOG_DATA",
        entity: srv.entities.NOTIFICATION_LOG_DATA,
        primaryKeys: ["NOTIF_ID"]
      },
      "STATUS_CONFIG": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.STATUS_CONFIG",
        entity: srv.entities.STATUS_CONFIG,
        primaryKeys: ["STATUS_CODE"]
      },
      "TASKS_CONFIG": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.TASKS_CONFIG",
        entity: srv.entities.TASKS_CONFIG,
        primaryKeys: ["TCFG_ID"]
      },
      "TASK_ACTION_CONFIG": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.TASK_ACTION_CONFIG",
        entity: srv.entities.TASK_ACTION_CONFIG,
        primaryKeys: ["TACTION_ID"]
      },
      "CLAIM_REQUEST_DURATION_CONFIG": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.CLAIM_REQUEST_DURATION_CONFIG",
        entity: srv.entities.CLAIM_REQUEST_DURATION_CONFIG,
        primaryKeys: ["CONFIG_ID"]
      },
      "PROCESS_PARTICIPANTS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.PROCESS_PARTICIPANTS",
        entity: srv.entities.PROCESS_PARTICIPANTS,
        primaryKeys: ["PPNT_ID"]
      },
      "TASK_DELEGATION_DETAILS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.TASK_DELEGATION_DETAILS",
        entity: srv.entities.TASK_DELEGATION_DETAILS,
        primaryKeys: ["ID"]
      },
      "REQUEST_LOCK_DETAILS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.REQUEST_LOCK_DETAILS",
        entity: srv.entities.REQUEST_LOCK_DETAILS,
        primaryKeys: ["LOCK_INST_ID"]
      },
      "FEEDBACK_DETAILS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.FEEDBACK_DETAILS",
        entity: srv.entities.FEEDBACK_DETAILS,
        primaryKeys: ["SEQ_NO"]
      },
      "NUS_CHRS_HOLIDAYS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.NUS_CHRS_HOLIDAYS",
        entity: srv.entities.NUS_CHRS_HOLIDAYS,
        primaryKeys: ["SEQ_NO"]
      },
      "DATE_TO_WEEK": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.DATE_TO_WEEK",
        entity: srv.entities.DATE_TO_WEEK,
        primaryKeys: ["WEEK"]
      },
      "TICKET_MGMT_DETAILS": {
        schema: "NUS_BTP_UTILS",
        table: "utilities::Tables.TICKET_MGMT_DETAILS",
        entity: srv.entities.TICKET_MGMT_DETAILS,
        primaryKeys: ["TCKT_ID"]
      }
    };

    const config = configs[tableName];

    // Validate that the entity exists for the requested table
    if (config && !config.entity) {
      //console.error(`Entity not found for table: ${tableName}. Available entities:`, Object.keys(srv.entities));
      throw new Error(`Entity not found for table: ${tableName}. Please check if the entity is properly defined in the service.`);
    }

    return config || null;
  },

  /**
   * Delete all data from a table
   * @param {string} tableName Name of the table
   * @param {object} tableConfig Table configuration
   * @param {object} db Database connection
   * @returns {Promise<number>} Number of deleted records
   */
  deleteTableData: async function (tableName, tableConfig, db) {
    try {
      // Validate table configuration
      if (!tableConfig) {
        throw new Error(`Table configuration is missing for table: ${tableName}`);
      }

      // Use the entity from table config to delete all records
      const entity = tableConfig.entity;

      // Validate entity
      if (!entity) {
        //console.error(`Entity is undefined for table: ${tableName}. Table config:`, tableConfig);
        throw new Error(`Entity is undefined for table: ${tableName}. Please check the table configuration.`);
      }

      // For CAP DELETE operations, we need to use the entity name as a string
      // The entity object contains the query information, but DELETE.from expects the entity name
      let entityName;

      // Extract entity name from the entity object
      if (entity.query && entity.query.SELECT && entity.query.SELECT.from && entity.query.SELECT.from.ref) {
        // Get the entity name from the ref array
        entityName = entity.query.SELECT.from.ref[0];
      } else {
        // Fallback: use the table name as entity name
        entityName = tableName;
      }

      // Convert to uppercase and replace dots with underscores
      entityName = entityName.toUpperCase().replace(/\./g, '_');

      //console.log(`Deleting from entity: ${entityName} for table: ${tableName}`);

      // Delete all records from the table using CAP's DELETE operation
      const deleteResult = await cds.run(DELETE.from(entityName));

      return deleteResult.affectedRows || 0;
    } catch (error) {
      //console.error(`Error deleting data from table ${tableName}:`, error);
      throw new Error(`Failed to delete data from table ${tableName}: ${error.message}`);
    }
  },

  /**
   * Fetch data from external source
   * @param {string} tableName Name of the table
   * @param {object} tableConfig Table configuration
   * @returns {Promise<Array>} Array of data records
   */
  fetchExternalData: async function (tableName, tableConfig) {
    try {
      // Get credentials
      const credentials = await this.getCredentials();

      // Prepare API call
      const url = credentials.metadata + "/eclaims/services/migration_node.xsjs?cmd=fetchData";
      const payload = {
        SCHEMA: tableConfig.schema,
        TABLE: tableConfig.table
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${credentials.auth}`,
        },
      };

      // Make API call
      const response = await ExternalApiCall._fnAxiosCall("POST", url, payload, config);

      if (!response.data || !response.data.result) {
        throw new Error(`No data received from external source for table: "${tableName}"`);
      }

      return response.data.result;
    } catch (error) {
      //console.error(`Error fetching data for table ${tableName}:`, error);
      throw new Error(`Failed to fetch data for table ${tableName}: ${error.message}`);
    }
  },

  /**
   * Transform data to match target database schema
   * @param {Array} data Array of data records
   * @param {object} entity Entity definition from CAP
   * @param {string} tableName Name of the table
   * @returns {Array} Transformed data array
   */
  transformDataForSchema: function (data, entity, tableName) {
    if (!data || data.length === 0) {
      return data;
    }

    // Get the valid columns from the entity definition
    const validColumns = new Set();
    const requiredColumns = new Set();
    const keyColumns = new Set();

    if (entity.elements) {
      Object.keys(entity.elements).forEach(columnName => {
        const element = entity.elements[columnName];

        // Skip association fields (they are not actual database columns)
        if (element && (element.isAssociation || element.isComposition || element.target)) {
          //console.log(`Skipping association field: ${columnName} for table: ${tableName}`);
          return;
        }

        validColumns.add(columnName.toUpperCase());

        // Check if column is required (not nullable)
        if (element && !element.nullable && !element.default) {
          requiredColumns.add(columnName.toUpperCase());
        }

        // Check if column is a key
        if (element && element.key) {
          keyColumns.add(columnName.toUpperCase());
        }
      });
    }

    //console.log(`Valid columns for ${tableName}:`, Array.from(validColumns));
    //console.log(`Required columns for ${tableName}:`, Array.from(requiredColumns));
    //console.log(`Key columns for ${tableName}:`, Array.from(keyColumns));

    // Transform each record to only include valid columns and handle missing required columns
    return data.map((record, index) => {
      const transformedRecord = {};

      // First, add all valid columns from the source data
      Object.keys(record).forEach(columnName => {
        const upperColumnName = columnName.toUpperCase();
        if (validColumns.has(upperColumnName)) {
          // Use the original column name (preserve case)
          transformedRecord[columnName] = record[columnName];
        } else {
          //console.log(`Filtering out invalid column: ${columnName} for table: ${tableName}`);
        }
      });

      // Then, handle missing required columns
      requiredColumns.forEach(requiredColumn => {
        const originalColumnName = Object.keys(entity.elements).find(col =>
          col.toUpperCase() === requiredColumn
        );

        if (!transformedRecord[originalColumnName]) {
          // Handle specific required columns
          if (requiredColumn === 'ID') {
            // Generate a unique ID for cuid fields
            transformedRecord[originalColumnName] = uuidv4();
            //console.log(`Generated ID for record ${index} in table ${tableName}: ${transformedRecord[originalColumnName]}`);
          } else if (requiredColumn === 'CREATEDAT' || requiredColumn === 'MODIFIEDAT') {
            // Set timestamp for managed fields
            transformedRecord[originalColumnName] = new Date().toISOString();
            //console.log(`Set timestamp for ${originalColumnName} in table ${tableName}`);
          } else if (requiredColumn === 'CREATEDBY' || requiredColumn === 'MODIFIEDBY') {
            // Set default user for managed fields
            transformedRecord[originalColumnName] = 'MIGRATION_SYSTEM';
            //console.log(`Set default user for ${originalColumnName} in table ${tableName}`);
          } else {
            // For other required columns, set a default value based on type
            const element = entity.elements[originalColumnName];
            if (element && element.type) {
              if (element.type.includes('String')) {
                transformedRecord[originalColumnName] = '';
              } else if (element.type.includes('Integer') || element.type.includes('Decimal')) {
                transformedRecord[originalColumnName] = 0;
              } else if (element.type.includes('Date')) {
                transformedRecord[originalColumnName] = new Date().toISOString().split('T')[0];
              } else if (element.type.includes('Timestamp')) {
                transformedRecord[originalColumnName] = new Date().toISOString();
              } else {
                transformedRecord[originalColumnName] = '';
              }
            } else {
              transformedRecord[originalColumnName] = '';
            }
            //console.log(`Set default value for required column ${originalColumnName} in table ${tableName}`);
          }
        }
      });

      return transformedRecord;
    });
  },

  /**
   * Insert data into a table
   * @param {string} tableName Name of the table
   * @param {object} tableConfig Table configuration
   * @param {Array} data Array of data records to insert
   * @param {object} db Database connection
   * @returns {Promise<number>} Number of inserted records
   */
  insertTableData: async function (tableName, tableConfig, data, db) {
    try {
      if (!data || data.length === 0) {
        return 0;
      }

      // Validate table configuration
      if (!tableConfig) {
        throw new Error(`Table configuration is missing for table: ${tableName}`);
      }

      // Use the entity from table config
      const entity = tableConfig.entity;

      // Validate entity
      if (!entity) {
        //console.error(`Entity is undefined for table: ${tableName}. Table config:`, tableConfig);
        throw new Error(`Entity is undefined for table: ${tableName}. Please check the table configuration.`);
      }

      // Transform data to match the target schema
      const transformedData = this.transformDataForSchema(data, entity, tableName);

      if (transformedData.length === 0) {
        //console.log(`No valid data to insert for table: ${tableName}`);
        return 0;
      }

      // For CAP INSERT operations, we need to use the entity name as a string
      let entityName;

      // Extract entity name from the entity object
      if (entity.query && entity.query.SELECT && entity.query.SELECT.from && entity.query.SELECT.from.ref) {
        // Get the entity name from the ref array
        entityName = entity.query.SELECT.from.ref[0];
      } else {
        // Fallback: use the table name as entity name
        entityName = tableName;
      }

      // Convert to uppercase and replace dots with underscores
      entityName = entityName.toUpperCase().replace(/\./g, '_');

      //console.log(`Inserting into entity: ${entityName} for table: ${tableName}`);

      // Insert data in batches to avoid memory issues
      const batchSize = 1000;
      let totalInserted = 0;

      for (let i = 0; i < transformedData.length; i += batchSize) {
        const batch = transformedData.slice(i, i + batchSize);

        // Insert batch using CAP's INSERT operation
        const insertResult = await cds.run(INSERT.into(entityName).entries(batch));
        totalInserted += batch.length;
      }

      return totalInserted;
    } catch (error) {
      //console.error(`Error inserting data into table ${tableName}:`, error);
      throw new Error(`Failed to insert data into table ${tableName}: ${error.message}`);
    }
  },

  /**
   * Get credentials for external API calls
   * @returns {Promise<object>} Credentials object
   */
  getCredentials: async function () {
    try {
      const credStoreBinding = JSON.parse(process.env.VCAP_SERVICES).credstore[0].credentials;
      const credPassword = {
        name: "hana_login_password"
      };

      const oRetCredential = await credStore.readCredential(credStoreBinding, "hana_db", "password", credPassword.name);

      if (!oRetCredential || !oRetCredential.metadata || !oRetCredential.username || !oRetCredential.value) {
        throw new Error("Client Credentials Not Available");
      }

      const auth = Buffer.from(`${oRetCredential.username}:${oRetCredential.value}`).toString("base64");

      return {
        metadata: oRetCredential.metadata,
        username: oRetCredential.username,
        password: oRetCredential.value,
        auth: auth
      };
    } catch (error) {
      //console.error("Error getting credentials:", error);
      throw new Error("Failed to get credentials: " + error.message);
    }
  },



  // Keep the original method for backward compatibility
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
};