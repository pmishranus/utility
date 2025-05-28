const cds = require("@sap/cds");

async function fetchConfigValue(CONFIG_KEY, PROCESS_CODE) {
    const fetchConfigValue = await cds.run(
        SELECT.from('NUSEXT_UTILITY_APP_CONFIGS').where({ CONFIG_KEY, PROCESS_CODE })
    );
    return fetchConfigValue || null;
}

async function fetchConfigValueByConfigKey(CONFIG_KEY) {
    const fetchConfigValue = await cds.run(
        SELECT.from('NUSEXT_UTILITY_APP_CONFIGS').where({ CONFIG_KEY, })
    );
    return fetchConfigValue || null;
}


module.exports = {
    fetchConfigValue,fetchConfigValueByConfigKey
}