const { application } = require("express");
const Connection = require("../util/request/connection.class");
const ApplicationConstants = require("../util/app-constant");
const CommonUtils = require("../util/common-utils")
const cds = require("@sap/cds");
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
        try {
            const user = oConnection.request.user.id;
            // const userName = user.split('@')[0];
            const userName = "PTT_CA1";

            if (!userName) {
                throw new Error("User not found..!!");
            }

            const inputRequest = oConnection.request.data.data;

            inputRequest.forEach(configRequest => {
                if(CommonUtils.equalsIgnoreCase(configRequest.SRC_CONFIG,ApplicationConstants.SRC_CWS_APP_CONFIG)){

                }else{

                }
            });

            return await this._fnFetchLoggedInUserDetails(userName, oConnection, oConnection.srv);
        } catch (oError) {
            this.handleError(oConnection.request, oError);
        }
    }
}