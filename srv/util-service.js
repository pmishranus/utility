const cds = require("@sap/cds");
const userDetails = require("./util/userinfo/getUserDetails");
const appConfig = require("./impl/app-config-request");
const AuditLogController = require("./controller/auditLog.controller");
const ReleaseLockedRequestsController = require("./controller/releaseLockedRequests.controller");

module.exports = cds.service.impl(async (srv) => {
  const db = await cds.connect.to("db");

  srv.on("userInfo", (req) => {
    let results = {};
    results.user = req.user.id;
    if (req.user.hasOwnProperty("locale")) {
      results.locale = req.user.locale;
    }
    results.scopes = {};
    results.scopes.identified = req.user.is("identified-user");
    results.scopes.authenticated = req.user.is("authenticated-user");
    results.scopes.Viewer = req.user.is("Viewer");
    return results;
  });

  srv.on("iasUserInfo", (req) => {
    let results = {};
    results.user = req.user.id;
    if (req.user.hasOwnProperty("locale")) {
      results.locale = req.user.locale;
    }
    results.scopes = {};
    results.scopes.identified = req.user.is("identified-user");
    results.scopes.authenticated = req.user.is("authenticated-user");
    results.scopes.Viewer = req.user.is("Viewer");
    results.completeRequest = req.user;
    results.wholebody = req;
    return results;
  });

  srv.on("getUserDetails", async (request) => {
    return await userDetails.getUserDetails(request, db, srv);
  });

  srv.on("appConfigCreateEntry", async (request) => {
    return await appConfig.createConfigEntry(request, db, srv);
  });

  srv.on("getAuditLogData", async (request) => {
    const { referenceId, processCode } = request.data;
    return await AuditLogController.retrieveAuditLogEntries(request, referenceId, processCode);
  });

  srv.on("releaseLockedRequests", async (request) => {
    const { draftId } = request.data;
    return await ReleaseLockedRequestsController.unlockRequests(request, draftId);
  });


});
