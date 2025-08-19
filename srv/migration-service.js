/**
 * Implementation for DataMigrationService defined in ./migration-service.cds
 */
const cds = require("@sap/cds");
const migrationHandler = require("./util/migration/migration-handler");

/**
 * Hooks for srv application
 * @module srv
 */
module.exports = cds.service.impl(async (srv) => {
  const db = await cds.connect.to("db");

  // Original function handler for backward compatibility
  srv.on("loadTableData", async (request) => {
    return await migrationHandler.loadMigratedData(request, db, srv);
  });

  // New action handler for multiple tables
  srv.on("loadMultipleTableData", async (request) => {
    return await migrationHandler.loadMultipleTableData(request, db, srv);
  });

});
