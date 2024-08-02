const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
module.exports = {
    checkForDuplicateWithValidityForCWS: function (processCode,configKey,configValue) {
        const queryParameter = ` ca.PROCESS_CODE = '${processCode} and ca.CONFIG_KEY = '${configKey}' and ca.CONFIG_VALUE = '${configValue}' `;
        let checkForDuplicateWithValidityForCWS = cds.run( 
            SELECT
            .from(' NUSEXT_UTILITY_CWS_APP_CONFIG as ca ')
            .where(queryParameter));
        return checkForDuplicateWithValidityForCWS;
    },
    checkForDuplicateWithValidity: function (processCode,configKey,configValue) {
        const queryParameter = ` ca.PROCESS_CODE = '${processCode} and ca.CONFIG_KEY = '${configKey}' and ca.CONFIG_VALUE = '${configValue}' `;
        let checkForDuplicateWithValidity = cds.run( 
            SELECT
            .from(' NUSEXT_UTILITY_APP_CONFIG as ca ')
            .where(queryParameter));
        return checkForDuplicateWithValidity;
    },
    
}