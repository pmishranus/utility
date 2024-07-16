"use strict";


module.exports = class DBUtils {

	getPrimaryKeyWhereClause() {
		return this.oTableConfig.aPrimaryKeys
			.map((sKey) => sKey + "=?")
			.join(" AND ");

	}

	getPropertiesOfElemAsArray(oElem, aProperties) {
		const aRes = [];
		aProperties.forEach(sProperty => {
			aRes.push(oElem[sProperty]);
		});
		return aRes;
	}
	prepareUpdateVariables(sFlagAttribute, aEntries) {
		const { oTable, aPrimaryKeys } = this.oTableConfig;
		const bDeltaHandling = this.oTableConfig.sTimestamps === 'standard';
		const aQueries = [];
		aEntries.forEach(oElem => {

			const oEntry = oElem;
			const aExcludeProps = [];
			//perapre update statement product
			if (bDeltaHandling) {
				aExcludeProps.push("lastSeenAt", "modifiedAt");

				//modified/lastSeenAttribute
				//oEntry.modifiedBy = this.oConnection.request.user.id;
				//oEntry.lastSeenBy = this.oConnection.request.user.id;
			}

			if (sFlagAttribute !== "") {
				aExcludeProps.push(sFlagAttribute);
			}
			//get query array
			const aVariables = this.orderSetUpdateObjectVariables(oEntry, oTable, aExcludeProps);
			//Where variables
			aPrimaryKeys.forEach(sKey => aVariables.push(oEntry[sKey]));
			aQueries.push(aVariables);
		});
		return aQueries;
	}

	getDatabasePropertiesArray(oEntity, aExcludeProperties) {
		const aElements = [];
		const oElements = oEntity.elements;
		Object.keys(oElements).forEach((sKey, iIndex) => {
			if (oElements[sKey] && oElements[sKey].type && oElements[sKey].type !== "cds.Association" && oElements[sKey].type !== "cds.Composition") {
				if (aExcludeProperties && aExcludeProperties.length > 0 && aExcludeProperties.includes(sKey)) {
					return;
				}
				aElements.push(sKey);
			}
		});
		return aElements;
	}
	getDatabasePropertiesString(oEntity, aExcludeProperties) {
		return this.getDatabasePropertiesArray(oEntity, aExcludeProperties).join(",");
	}
	getDatabaseValuesString(oEntity, aExcludeProperties) {
		return this.getDatabasePropertiesArray(oEntity, aExcludeProperties).map(sEntry => "?").join(",");
	}
	mergeInsertObjectWithNull(oInsertObject, aExcludeProperties = []) {
		const aResult = [];
		const { oTable } = this.oTableConfig;
		const aEntries = this.getDatabasePropertiesArray(oTable);
		aEntries.forEach(sEntry => {
			if (aExcludeProperties.length > 0 && aExcludeProperties.includes(sEntry)) {
				return;
			}
			if (oInsertObject[sEntry] === undefined) {
				aResult.push(null);
			} else {
				aResult.push(oInsertObject[sEntry]);
			}
		});
		return aResult;
	}
	orderSetUpdateObjectVariables(oUpdateObject, oEntity, aExcludeProperties) {
		const aResult = [];
		const aEntries = this.getDatabasePropertiesArray(oEntity, aExcludeProperties);
		aEntries.forEach(sEntry => {
			if (oUpdateObject[sEntry] === undefined) {
				aResult.push(null);
			} else {
				aResult.push(oUpdateObject[sEntry]);
			}
		});
		return aResult;
	}

	mergeObjects(oNewObject, oCurrObject) {
		//iterate through oCurrObject.keys
		Object.keys(oCurrObject).forEach(sKey => {
			if (oNewObject[sKey] === undefined) {
				oNewObject[sKey] = oCurrObject[sKey];
			}
		});
		return oNewObject;
	}
};