const cds = require("@sap/cds");
const eclaimsOverviewDashboardImpl = require("./impl/eclaims-overview-dashboard");

module.exports = cds.service.impl(async (srv) => {
  const db = await cds.connect.to("db");

  srv.on("userInfo", (req) => {
    // let results = {};
    // results.user = req.user.id;
    // if (req.user.hasOwnProperty("locale")) {
    //   results.locale = req.user.locale;
    // }
    // results.scopes = {};
    // results.scopes.identified = req.user.is("identified-user");
    // results.scopes.authenticated = req.user.is("authenticated-user");
    // results.scopes.Viewer = req.user.is("Viewer");
    let results = {
        "name" : "Eclaims"
    }
    return results;
  });

  srv.on("eclaimsOverviewDashboard", async (request) => {
    return await eclaimsOverviewDashboardImpl.createConnectionOverviewDashboard(request, db, srv);
  });

  
});
