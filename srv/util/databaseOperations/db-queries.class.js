"use strict";
const DBUtils = require("./db-utils.class");

module.exports = class DBQueries extends DBUtils {


	async prepareAndExecBulkUpdateStatement(sWhereClause, aQueryVariables, aTimestamps) {
		let oRes;
		const { oTable, sTableName } = this.oTableConfig;
		const { dbConn } = this.oConnection;

		let sSetStatement = this.getDatabasePropertiesArray(oTable, aTimestamps).map(sKey => sKey + "=?").join(", ");
		//SET Timestamps on DB level
		if (aTimestamps && aTimestamps.length > 0) {
			aTimestamps.forEach((sProperty, iIndex) => {
				if (iIndex === 0) {
					sSetStatement += ",";
				}
				sSetStatement += sProperty + " = CURRENT_UTCTIMESTAMP";
				if (iIndex !== aTimestamps.length - 1) {
					sSetStatement += ",";
				}
			});
		}
		let updateStatement;
		try {
			updateStatement = await dbConn.preparePromisified("UPDATE " + sTableName + " SET " + sSetStatement + " WHERE " + sWhereClause);
			oRes = await dbConn.statementExecBatchPromisified(updateStatement, aQueryVariables);
			await this.dropPreparedStatement(updateStatement);
		} catch (oError) {
			await this.handleDBError(oError, updateStatement);
		}
		return oRes;

	}
	async prepareAndExecBulkUpdateStatementCustomSet(sSetStatement, sWhereClause, aQueryVariables) {
		let updateStatement;
		let oRes;
		const { sTableName } = this.oTableConfig;
		const { dbConn } = this.oConnection;

		try {
			updateStatement = await dbConn.preparePromisified("UPDATE " + sTableName + " SET " + sSetStatement + " WHERE " + sWhereClause);
			oRes = await dbConn.statementExecBatchPromisified(updateStatement, aQueryVariables);
			await this.dropPreparedStatement(updateStatement);
		} catch (oError) {
			await this.handleDBError(oError, updateStatement);
		}
		return oRes;
	}
	async prepareAndExecBulkDeleteStatement(sWhereClause, aQueryVariables) {
		let oRes;
		let deleteStatement;
		const { sTableName } = this.oTableConfig;
		const { dbConn } = this.oConnection;
		try {
			deleteStatement = await dbConn.preparePromisified("DELETE FROM " + sTableName + " WHERE " + sWhereClause);
			oRes = await dbConn.statementExecBatchPromisified(deleteStatement, aQueryVariables);
			await this.dropPreparedStatement(deleteStatement);
		} catch (oError) {
			await this.handleDBError(oError, deleteStatement);
		}
		return oRes;

	}
	async prepareAndExecBulkInsertStatement(aQueryVariables, aTimestamps) {
		let oRes;
		const { oTable, sTableName } = this.oTableConfig;
		const { dbConn } = this.oConnection;

		let sEntries = this.getDatabasePropertiesString(oTable, aTimestamps);
		let sValues = this.getDatabaseValuesString(oTable, aTimestamps);

		//SET Timestamps on DB level
		if (aTimestamps && aTimestamps.length > 0) {
			aTimestamps.forEach((sProperty, iIndex) => {
				if (iIndex === 0) {
					sEntries += ",";
					sValues += ",";
				}
				sEntries += sProperty;
				sValues += "CURRENT_UTCTIMESTAMP";
				if (iIndex !== aTimestamps.length - 1) {
					sEntries += ",";
					sValues += ",";
				}
			});
		}

		let insertStatement;
		try {
			insertStatement = await dbConn.preparePromisified("INSERT INTO " + sTableName + " (" + sEntries + ") VALUES (" + sValues + ")");
			oRes = await dbConn.statementExecBatchPromisified(insertStatement, aQueryVariables);
			await this.dropPreparedStatement(insertStatement);
		} catch (oError) {
			await this.handleDBError(oError, insertStatement);
		}
		return oRes;

	}
	async prepareAndExecSelectStatement(sSelectStatement, sWhereClause, aQueryVariables) {
		let oRes;
		//get table config
		const { oTable, sTableName } = this.oTableConfig;
		const { dbConn } = this.oConnection;

		if (sSelectStatement === "*") {
			sSelectStatement = this.buildCaseSensitiveSelect(oTable);
		}
		let sQuery = "SELECT " + sSelectStatement + " FROM " + sTableName;
		if (sWhereClause) {
			sQuery += " WHERE " + sWhereClause;
		}
		sQuery += " FOR UPDATE";
		let oPreparedStatement;
		try {
			oPreparedStatement = await dbConn.preparePromisified(sQuery);
			oRes = await dbConn.statementExecPromisified(oPreparedStatement, aQueryVariables);
			await this.dropPreparedStatement(oPreparedStatement);
		} catch (oError) {
			await this.handleDBError(oError, oPreparedStatement);
		}
		return oRes;

	}
	buildCaseSensitiveSelect(oTable) {
		let aProperties = this.getDatabasePropertiesArray(oTable);
		aProperties = aProperties.map(sProperty => sProperty + ' AS "' + sProperty + '"');
		return aProperties.join(",");
	}
	async handleDBError(oError, oPreparedStatement) {
		await this.dropPreparedStatement(oPreparedStatement);
		let sMessage = "DB Error: SQL Statement failed! ";
		sMessage = oError.message ? sMessage + oError.message : sMessage;
		oError.message = sMessage;
		throw oError;
	}
	dropPreparedStatement(oPreparedStatement) {
		return new Promise((resolve, reject) => {
			if (oPreparedStatement) {
				oPreparedStatement.drop(error => {
					if (error) {
						reject(error);
					}
					resolve();
				});
			} else {
				resolve();
			}
		});
	}

};