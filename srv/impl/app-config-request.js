const { application } = require("express");
const Connection = require("../util/request/connection.class");
const ApplicationConstants = require("../util/app-constant");
const CommonUtils = require("../util/common-utils");
const cds = require("@sap/cds");
const appConfigQuery = require("../query/query-app-config");
const commonQuery = require("../query/query-common");
const queryCommon = require("../query/query-common");
module.exports = {
    /**
     *
     * @param {object} request CAP Request Object
     * @param {oject} db CAP DB Object
     * @param {object} srv CAP DB Object
     * @returns {Promise<Object>} Result of Updated Entries in JSON
     */
    createConfigEntry: function (request, db, srv) {
        const oConnection = new Connection(request, db, srv);
        return this.persistAppConfigEntry(oConnection);
    },

    persistAppConfigEntry: async function (oConnection) {
        const tx = cds.tx();
        try {
            const user = oConnection.request.user.id;
            // const userName = user.split('@')[0];
            const userName = "PTT_CA1";

            //fetch logged in user information

            let loggedInUserDetails = await commonQuery.fetchLoggedInUser(userName);

            if (!userName) {
                throw new Error("User not found..!!");
            }

            const inputRequest = oConnection.request.data.data;

            inputRequest.forEach(async configRequest => {
                if (CommonUtils.equalsIgnoreCase(configRequest.SRC_CONFIG, ApplicationConstants.SRC_CWS_APP_CONFIG)) {
                    const existingcwsAppConfigList = appConfigQuery.checkForDuplicateWithValidityForCWS(configRequest.PROCESS_CODE, configRequest.CONFIG_KEY, configRequest.CONFIG_VALUE);
                    // Check if the existingcwsAppConfigList is not null, not empty, and if configRequest.ACFG_ID is empty
                    if (existingcwsAppConfigList && existingcwsAppConfigList.length > 0 && !configRequest.ACFG_ID) {
                        throw new Error("This is a Duplicate Configuration, please modify the existing configuration");
                    }

                    const authId = CommonUtils.isEmpty(configRequest.CWS_ACFG_ID)
                        ? await commonQuery.fetchSequenceNumber("CWSACFG", 4)
                        : configRequest.CWS_ACFG_ID;
                    let cwsAppConfiguration = {};
                    cwsAppConfiguration.CWS_ACFG_ID = authId;
                    cwsAppConfiguration.CFG_TYPE = ApplicationConstants.A;
                    cwsAppConfiguration = CommonUtils.copyObjectProperties(configRequest, cwsAppConfiguration, []);

                    if (CommonUtils.isEmpty(configRequest.CWS_ACFG_ID)) {
                        cwsAppConfiguration.CREATED_ON = new Date().toISOString();
                        cwsAppConfiguration.CREATED_BY = loggedInUserDetails.STF_NUMBER;
                    }
                    cwsAppConfiguration.MODIFIED_ON = new Date().toISOString();
                    cwsAppConfiguration.MODIFIED_BY = loggedInUserDetails.STF_NUMBER;
                    cwsAppConfiguration.UPDATED_BY = loggedInUserDetails.STF_NUMBER;
                    await queryCommon.upsertOperationChained(tx, "NUSEXT_UTILITY_CWS_APP_CONFIG", cwsAppConfiguration);
                } else {
                    const existingConfigList = appConfigQuery.checkForDuplicateWithValidity(configRequest.PROCESS_CODE, configRequest.CONFIG_KEY, configRequest.CONFIG_VALUE);
                    // Check if the existingcwsAppConfigList is not null, not empty, and if configRequest.ACFG_ID is empty
                    if (existingConfigList && existingConfigList.length > 0 && !configRequest.ACFG_ID) {
                        throw new Error("This is a Duplicate Configuration, please modify the existing configuration");
                    }

                    const authId = CommonUtils.isEmpty(configRequest.ACFG_ID)
                        ? await commonQuery.fetchSequenceNumber("ACFGS", 4)
                        : configRequest.ACFG_ID;
                    let appConfiguration = {};
                    appConfiguration.ACFG_ID = authId;
                    appConfiguration.IS_MAINT_BY_USER = ApplicationConstants.INT_ACTIVE;
                    appConfiguration = CommonUtils.copyObjectProperties(configRequest, appConfiguration, []);
                    appConfiguration.UPDATED_ON = new Date().toISOString();
                    appConfiguration.UPDATED_BY = loggedInUserDetails.STF_NUMBER;
                    appConfiguration.UPDATED_BY_NID = loggedInUserDetails.NUSNET_ID;
                    await queryCommon.upsertOperationChained(tx, "NUSEXT_UTILITY_APP_CONFIG", appConfiguration);
                }
            });

        } catch (oError) {
            // this.handleError(oConnection.request, oError);
            await tx.rollback();
        }
    }
}