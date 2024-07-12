/**
 * Implementation for DataMigrationService defined in ./migration-service.cds
 */
const cds = require("@sap/cds");
const migrationHandler = require("../util/migration/migration-handler");

/**
 * Hooks for srv application
 * @module srv
 */
module.exports = cds.service.impl(async (srv) => {
  const db = await cds.connect.to("db");
  srv.on("loadTableData", async (request) => {
    return await migrationHandler.loadMigratedData(request, db, srv);
  });
  
});
