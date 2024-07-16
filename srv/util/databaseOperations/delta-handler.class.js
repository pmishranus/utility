const compareObjects = require("../databaseOperations/compare-object");


module.exports = class DeltaHandler {

	constructor(oUpsertHandler) {
		//libs
		this.oUpsertHandler = oUpsertHandler;
	}



	calculateDelta(aExistingData, aModifiedIDs) {

		//compare existing data with current data and merge for bulk insert/update
		const { aNewEntries } = this.detectModifications(aExistingData, aModifiedIDs);
		const aDeletedEntries = this.detectDeletions(aExistingData);


		return {
			aNewEntries: aNewEntries,
			aDeletedEntries: aDeletedEntries
		};

	}


	detectModifications(aExistingData, aModifiedIDs) {
		const { oTableConfig } = this.oUpsertHandler;

		const aNewEntries = [];
		//iterate through each entry
		if (this.oUpsertHandler.aData.length && this.oUpsertHandler.aData.length > 0) {
			this.oUpsertHandler.aData.forEach(oNewData => {
				aNewEntries.push(oNewData);
			});
		} else {
			const oNewData = this.oUpsertHandler.aData;
			aNewEntries.push(oNewData);
		}
		
		return {
			aNewEntries: aNewEntries
		};
	}

	detectDeletions(aExistingData) {
		const aDeletedEntries = [];
		const { oTableConfig } = this.oUpsertHandler;
		//check for deletions if configured
		if (oTableConfig.sDelete === 'hard' || oTableConfig.sDelete === 'flag') {
			//check if current data has entries which are not present in new data
			aExistingData.forEach(oExistingData => {
					aDeletedEntries.push(oExistingData);
			});
		}
		return aDeletedEntries;
	}

	//get current data form database
	async getCurrentData(aParentIDs) {
		let oRes;
		oRes = await this.getCurrentDataSingle();
		return oRes;
	}

	async getCurrentDataSingle() {
		let oNewEntry;
		
		if (this.oUpsertHandler.aData && this.oUpsertHandler.aData.length) {
			oNewEntry = this.oUpsertHandler.aData[0];
		} else {
			oNewEntry = this.oUpsertHandler.aData;
		}
		const { aPrimaryKeys } = this.oUpsertHandler.oTableConfig;
		return this.selectDataFromTable(oNewEntry, aPrimaryKeys, aPrimaryKeys, "*");
	}

	/*
	 * Generic Function to create Select Statements in order to compare if data is modified/new/notModified
	 * @param {object} oNewEntry Array with entries, which should be selected (js object)
	 * @param {*} aPrimaryKeysTable Primary keys which should be used for where condition
	 * @param {*} oTable CAP Table Oject
	 * @param {*} sTableName Table Name
	 * @param {*} aEntryKeys Array with Propety Names of aNewEntries, usually same as aPrimaryKeys
	 * @param {*} sSelectStatement Select Statement, default *
	 * @returns DB result as Array
	 */
	async selectDataFromTable(oNewEntry, aPrimaryKeys, aEntryKeys, sSelectStatement = "*") {

		//GET all existing Entries and split by 500
		const sWhereCondition = aPrimaryKeys.map(sKey => sKey + "=?").join(" AND ");
		const aSelectPromises = [];
		let sWhereStatement = "";
		const aSelectVariables = [];
		sWhereStatement = sWhereCondition;
		aEntryKeys.forEach(sKey => aSelectVariables.push(oNewEntry[sKey]));
		const pQueryResult = this.oUpsertHandler.prepareAndExecSelectStatement(sSelectStatement, sWhereStatement, aSelectVariables);
		aSelectPromises.push(pQueryResult);



		return Promise.all(aSelectPromises).then(aSelectResult => aSelectResult.flat());
	}
	async selectAllEntriesFromTable() {
		//GET all existing Table Entries 
		//		const sSelectStatement = this.oUpsertHandler.oTableConfig.aPrimaryKeys.map(sKey => sKey + ' AS "' + sKey + '"').join(",");
		return this.oUpsertHandler.prepareAndExecSelectStatement('*', undefined, []);
	}
};