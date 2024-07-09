const cds = require("@sap/cds");

module.exports = cds.service.impl(async (srv) => {
    const db = await cds.connect.to("db");
});