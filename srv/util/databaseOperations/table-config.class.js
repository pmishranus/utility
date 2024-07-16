"use strict";
module.exports = class TableConfig {

	constructor(oTableConfig) {

		this.sTableName = oTableConfig.sTableName; //full table name with namespace
		this.aPrimaryKeys = oTableConfig.aPrimaryKeys; //primary keys of the table
		this.oTable = oTableConfig.oTable; //CAP DB Object
		this.sCardinality = oTableConfig.sCardinality; //single or many
		this.sDelete = oTableConfig.sDelete; //hard|flag|none -> hard deletion/set deletion flag/no deletion
		this.sTimestamps = oTableConfig.sTimestamps; //standard|none -> standard = modifiedAt/createdAt/lastSeenAt timestamps |none = no timestamps
		
	}
};