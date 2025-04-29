const swaggerUi = require('swagger-ui-express');
const cds = require("@sap/cds");
const cov2ap = require("@sap/cds-odata-v2-adapter-proxy");
const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');
const passport = require('passport');
const JWTStrategy = require('@sap/xssec').JWTStrategy;

const debug = cds.debug('openapi');

var recursive = require("recursive-readdir");

Object.defineProperty(cds.compile.to, 'openapi', { configurable: true, get: () => require('@sap/cds-dk/lib/compile/openapi') });
const multer = require('multer');
const path = require('path');
const cors = require('cors');
let app, docCache = {}

cds.on("bootstrap", (_app) => {
    app = _app;
    app.use(cov2ap());

    app.use(cors());
    xsenv.loadEnv();
    passport.use(new JWTStrategy(xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa));
    app.use(passport.initialize());
    app.use(passport.authenticate('JWT', { session: false }));


    recursive(__dirname, function (err, files) {
        console.log("Files from:"+__dirname);
        console.log(files);
    });

    recursive('/home/vcap/app/', function (err, files) {
      console.log("Files from: /home/vcap/app/");
      console.log(files);
  });

}
);


module.exports = cds.server;