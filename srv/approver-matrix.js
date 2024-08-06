
const cds = require("@sap/cds");
const approverMatrixImpl = require("./impl/approver-matrix")

module.exports = cds.service.impl(async (srv) => {
  const db = await cds.connect.to("db");


  srv.on("createEntry", async (request) => {
    return await approverMatrixImpl.createConfigEntry(request, db, srv);
  });

  srv.on("deleteEntry", async (request) => {
    return await appConfig.createConfigEntry(request, db, srv);
  });

  
  srv.on("matrixReqUpload", async (request) => {
    return await appConfig.createConfigEntry(request, db, srv);
  });
  
});
