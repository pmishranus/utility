"use strict";
const DBOperations = require("./db-queries.class");
const compareObjects = require("./compare-object.js");
const DeltaHandler = require("./delta-handler.class");

/**
 * Class UpsertHandler 
 * Takes care of orchestrating generic upserts
 * Has references to other classes like Connection/TableConfig/DeltaHandler
 * 
 */
module.exports = class UpsertHandler extends DBOperations {

	/**
	 * 
	 * @param {array<object>} aData Array of Data Objects that should be upserted
	 * @param {object} oConnection Connection Class 
	 * @param {object} oDeltaHandler DeltaHandler Class
	 */
	constructor(aData, oConnection, oTableConfig, oDeltaHandler = DeltaHandler) {
		super();
		//libs
		// this.compareObjects = compareObjects;

		//Class References
		this.oConnection = oConnection;
		this.oDeltaHandler = new oDeltaHandler(this);
        this.oTableConfig = oTableConfig;

		//Data that should be updated
		this.aData = aData;


		//config for bulk select (how many entries should be used in where statement in one select query)
		this.iBulkSelect = 100;

	}
	/**
	 * This function upserts data (this.aData).
	 * @param {Array<object>} aModifiedIDs IDs which are already marked as modified by dependent data and will be forwared to delta handler
	 * @returns {Promise<Object>} JSON Object indicating changes, how many entries have been created/updated/deleted/notModified/ + all entries which have been modified
	 */
	async handleRequest(aModifiedIDs = [], aParent = []) {
		//get existing Data
		const aCurrData = await this.oDeltaHandler.getCurrentData(aParent);
		const { aNewEntries, aDeletedEntries } = this.oDeltaHandler.calculateDelta(aCurrData, aModifiedIDs);

        let iDeletedEntries;
		if (this.oTableConfig.sDelete === "flag" || this.oTableConfig.sDelete === "hard") {
			iDeletedEntries = await this.deleteData(aDeletedEntries);
		}

		const iNewEntries = await this.insertData(aNewEntries);

		return {
			iNewEntries: iNewEntries,
			iDeletedEntries: iDeletedEntries
		};
	}

    /**
	 * This function deletes existing data (on basis of InternalID).
	 * @param {Array<object>} aModifiedIDs IDs which are already marked as modified by dependent data and will be forwared to delta handler
	 * @returns {Promise<Object>} JSON Object indicating changes, how many entries have been created/updated/deleted/notModified/ + all entries which have been modified
	 */
	async deleteExistingData(aModifiedIDs = [], aParent = []) {
		//get existing Data
		const aCurrData = await this.oDeltaHandler.getCurrentData(aParent);
		const { aDeletedEntries } = this.oDeltaHandler.calculateDelta(aCurrData, aModifiedIDs);

        let iDeletedEntries;
		if (this.oTableConfig.sDelete === "flag" || this.oTableConfig.sDelete === "hard") {
			iDeletedEntries = await this.deleteData(aDeletedEntries);
		}

		return {
			iDeletedEntries: iDeletedEntries
		};
	}

	async insertData(aNewEntries) {
		let iRes = 0;
		if (aNewEntries.length > 0) {

			const aExcludeProperties = [];
			if (this.oTableConfig.sTimestamps === 'standard') {
				aExcludeProperties.push("createdAt");
			}

			const aInsertQueries = aNewEntries.map(oNewEntry => {
				return this.mergeInsertObjectWithNull(oNewEntry, aExcludeProperties);
			});

			const aTimestamps = this.oTableConfig.sTimestamps === 'standard' ? ["createdAt"] : [];

			
			iRes = await this.prepareAndExecBulkInsertStatement(aInsertQueries, aTimestamps);

		}
		return iRes;
	}

	async deleteData(aDeletedEntries) {
		let iRes = 0;

		if (aDeletedEntries.length > 0 && this.oTableConfig.sDelete === 'flag') {
			iRes = await this.setDeletedFlag(aDeletedEntries);
		} else if (aDeletedEntries.length > 0 && this.oTableConfig.sDelete === 'hard') {
			iRes = await this.hardDeleteEntries(aDeletedEntries);
		}
		return iRes;
	}

	async setDeletedFlag(aDeletedEntries) {
		const aQueryVariables = aDeletedEntries.map(oElem => this.getPropertiesOfElemAsArray(oElem, this.oTableConfig.aPrimaryKeys));
		const sWhereClause = this.getPrimaryKeyWhereClause();
		return this.prepareAndExecBulkUpdateStatementCustomSet("active=false, modifiedAt=CURRENT_UTCTIMESTAMP, lastSeenAt=CURRENT_UTCTIMESTAMP", sWhereClause, aQueryVariables);
	}

	async hardDeleteEntries(aDeletedEntries) {
		const aQueryVariables = aDeletedEntries.map(oElem => this.getPropertiesOfElemAsArray(oElem, this.oTableConfig.aPrimaryKeys));
		const sWhereClause = this.getPrimaryKeyWhereClause();
		return this.prepareAndExecBulkDeleteStatement(sWhereClause, aQueryVariables);
	}

};