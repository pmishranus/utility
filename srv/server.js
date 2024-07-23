const cds = require("@sap/cds");
const cov2ap = require("@sap/cds-odata-v2-adapter-proxy");
const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');
const passport = require('passport');
const JWTStrategy = require('@sap/xssec').JWTStrategy;

cds.on("bootstrap", (app) => {
    app.use(cov2ap());
    xsenv.loadEnv();
    passport.use(new JWTStrategy(xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa));
    app.use(passport.initialize());
    app.use(passport.authenticate('JWT', { session: false }));
}
);

module.exports = cds.server;