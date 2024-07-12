"use strict";

module.exports = {

	compareJSONObjects: function (oNewObject, oExistingObject, oTable, aExcludeProperties = []) {
		let bResult = true;
		if (oNewObject) {
			Object.keys(oNewObject).forEach(sKey => {

				if (!aExcludeProperties.includes(sKey)) {
					//get Element Type
					const sType = oTable.elements[sKey] && oTable.elements[sKey].type;
					let bTempResult;
					switch (sType) {
						case "cds.Date":
							bTempResult = this.compareDateObjects(oNewObject[sKey], oExistingObject[sKey]);
							break;
						case "cds.DateTime":
						case "cds.Timestamp":
							bTempResult = this.compareDateTimeObjects(oNewObject[sKey], oExistingObject[sKey]);
							break;
						case "cds.Time":
							bTempResult = this.compareTimeObjects(oNewObject[sKey], oExistingObject[sKey]);
							break;
						case "cds.String":
						default:
							bTempResult = oNewObject[sKey] === oExistingObject[sKey];
							break;
					}
					if (bTempResult === false) {
						bResult = false;
					}
				}
			});
		}
		return bResult;
	},

	compareJSONObjectsWithInclude: function (oNewObject, oExistingObject, oTable, aIncludeProperties) {
		let bResult = true;
		if (oNewObject) {
			aIncludeProperties.forEach(sKey => {

				//get Element Type
				const sType = oTable.elements[sKey] && oTable.elements[sKey].type;
				let bTempResult;
				switch (sType) {
					case "cds.Date":
						bTempResult = this.compareDateObjects(oNewObject[sKey], oExistingObject[sKey]);
						break;
					case "cds.DateTime":
						bTempResult = this.compareDateTimeObjects(oNewObject[sKey], oExistingObject[sKey]);
						break;
					case "cds.Time":
						bTempResult = this.compareTimeObjects(oNewObject[sKey], oExistingObject[sKey]);
						break;
					case "cds.String":
					default:
						bTempResult = oNewObject[sKey] === oExistingObject[sKey];
						break;
				}
				if (bTempResult === false) {
					bResult = false;
				}
			});
		}
		return bResult;
	},

	compareInital: function (sNew, sOld) {
		return !sNew && !sOld;
	},

	compareTimeObjects: function (sNewTime, sOldTime) {
		if (!sNewTime || !sOldTime) {
			return this.compareInital(sNewTime, sOldTime);
		}
		return new Date("2000-01-01T" + sNewTime).getTime() === new Date("2000-01-01T" + sOldTime).getTime();
	},

	compareDateTimeObjects: function (sNewTimestamp, sOldTimestamp) {
		if (!sNewTimestamp || !sOldTimestamp) {
			return this.compareInital(sNewTimestamp, sOldTimestamp);
		}
		const oOldTimestampFormatted = sOldTimestamp + "Z";
		return new Date(sNewTimestamp).getTime() === new Date(oOldTimestampFormatted).getTime();
	},

	checkLastChangedEntry: function (sNewTimestamp, sOldTimestamp) {
		if (!sNewTimestamp || !sOldTimestamp) {
			return true;
		}
		const oOldTimestampFormatted = sOldTimestamp + "Z";
		return new Date(sNewTimestamp).getTime() > new Date(oOldTimestampFormatted).getTime();
	},

	compareDateObjects: function (sNewTimestamp, sOldTimestamp) {
		if (!sNewTimestamp || !sOldTimestamp) {
			return this.compareInital(sNewTimestamp, sOldTimestamp);
		}
		return new Date(sNewTimestamp).getTime() === new Date(sOldTimestamp).getTime();
	},
	compareObjectswithProperties: function (aProperties, oSource, oTarget) {
		let bResult = true;
		aProperties.forEach(sProperty => {
			if (oSource[sProperty] !== oTarget[sProperty]) {
				bResult = false;
			}
		});
		return bResult;
	},

	checkIfEntryExists: function (aModifiedIDs, oNewData, aPrimaryKeys) {
		const iIndex = aModifiedIDs.findIndex(oElem => {
			let bEqual = true;
			aPrimaryKeys.forEach(sKey => {
				if (oElem[sKey] !== oNewData[sKey]) {
					bEqual = false;
				}
			});
			return bEqual;
		})
		return iIndex >= 0;
	},

	addPropagation: function (aChildEntries, aChildKeys, aPrimaryKeys, aPropagation = []) {

		aChildEntries.forEach(oChildEntry => {
			const oNewPropagation = {};
			aChildKeys.forEach((sChildKey, iIndex) => {
				oNewPropagation[aPrimaryKeys[iIndex]] = oChildEntry[sChildKey];
			});
			aPropagation.push(oNewPropagation);
		});

		aPropagation = this.deDuplicateEntries(aPropagation, aPrimaryKeys);

		return aPropagation;
	},

	deDuplicateEntries: function (aEntries, aPrimaryKeys) {
		const oUniqueEntrySet = new Set();

		return aEntries.filter(oEntry => {
			let id = "";
			aPrimaryKeys.forEach(sKey => id += oEntry[sKey]);
			const bDuplicate = oUniqueEntrySet.has(id);
			if (!bDuplicate) {
				oUniqueEntrySet.add(id);
			}
			return !bDuplicate;
		});
	}
};