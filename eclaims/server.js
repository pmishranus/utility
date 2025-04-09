const swaggerUi = require('swagger-ui-express');
const cds = require("@sap/cds");
const cov2ap = require("@sap/cds-odata-v2-adapter-proxy");
const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');
const passport = require('passport');
const JWTStrategy = require('@sap/xssec').JWTStrategy;

const debug = cds.debug('openapi');

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



// // Configure Multer for file uploads
// const upload = multer({ dest: 'uploads/' });

// // Middleware to handle multipart/form-data
// app.post('/approvermatrix/matrixReqUploads', upload.single('matrixFile'), async (req, res, next) => {
//   const file = req.file;
//   const { requestorGrp, ulu, fdlu, processCode, noOfHeaderRows } = req.body;

//   // Call CAPM action with req.data
//   const srv = await cds.connect.to('ApproverMatrix');
//   try {
//     const result = await srv.tx(req).run(
//       srv.actions.matrixReqUpload({
//         matrixFile: file,
//         requestorGrp,
//         ulu,
//         fdlu,
//         processCode,
//         noOfHeaderRows
//       })
//     );
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// });







}
)
.on('serving', service => {
    const apiPath = '/api-docs' + service.path
    console.log(`[Open API] - serving ${service.name} at ${apiPath}`)
    app.use(apiPath, async (req, _, next) => {
        req.swaggerDoc = await toOpenApiDoc(service, docCache)
        next()
    }, swaggerUi.serve, swaggerUi.setup())
    addLinkToIndexHtml(service, apiPath)

    app.use('/model/', async (req, res) => {
        const csn = await cds.load('db')
        const model = cds.reflect(csn)
        res.type('json')
        res.send(JSON.stringify(model))
    })
})


async function toOpenApiDoc(service, cache) {
    if (!cache[service.name]) {
        const spec = await openApiFromFile(service)
        if (spec) {  // pre-compiled spec file available?
            cache[service.name] = spec
        }
        // On-the-fly exporter available?  Needs @sap/cds-dk >= 3.3.0
        else if (cds.compile.to.openapi) {
            console.log('Compiling Open API spec for', service.name)
            cache[service.name] = cds.compile.to.openapi(service.model, {
                service: service.name,
                'openapi:url': service.path,
                'openapi:diagram': true
            })
        }
    }

    return cache[service.name]
}

async function openApiFromFile(service) {
    const fileName = resolve(`docs/${service.name}.openapi3.json`)
    const file = await readFile(fileName).catch(() => {/*no such file*/ })
    if (file) {
        debug && debug('Using Open API spec from file', fileName)
        return JSON.parse(file)
    }
}

function addLinkToIndexHtml(service, apiPath) {
    const provider = (entity) => {
        if (entity) return // avoid link on entity level, looks too messy
        return { href: apiPath, name: 'Swagger UI', title: 'Show in Swagger UI' }
    }
    // Needs @sap/cds >= 4.4.0
    service.$linkProviders ? service.$linkProviders.push(provider) : service.$linkProviders = [provider]
}


module.exports = cds.server;