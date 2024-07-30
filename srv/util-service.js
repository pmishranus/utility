const cds = require("@sap/cds");
const userDetails = require("./util/userinfo/getUserDetails");

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

  srv.on("getUserDetails", async (request) => {
    return await userDetails.getUserDetails(request, db, srv);
  });

  
});
