using {nusext as db} from '../db/datamodel';

@protocol       : 'rest'
@cds.query.limit: {default: 1000}


service MigrationService {
    /*
        Enhancement : All the data loading from any third party api will be added over here
        Author : Pankaj
        Relative path will be added in an incremental way.
        --> Tablename parameter must be matched with the entity name of the source database table.
        1. /rest/migration/loadTableData(Tablename='ECLAIMS_DATA')
        2. /rest/migration/loadTableData(Tablename='ECLAIMS_ITEMS_DATA')
    */

    entity HEADER_DATA          as select * from db.ECLAIMS.HEADER_DATA;
    entity ITEMS_DATA           as select * from db.ECLAIMS.ITEMS_DATA;
    entity TAX_BFT_CLAIMS_GRP   as select * from db.ECLAIMS.TAX_BFT_CLAIMS_GRP;
    entity CHRS_JOB_INFO        as select * from db.MASTER_DATA.CHRS_JOB_INFO;
    entity CHRS_COST_DIST       as select * from db.MASTER_DATA.CHRS_COST_DIST;
    entity CHRS_HRP_INFO        as select * from db.MASTER_DATA.CHRS_HRP_INFO;
    entity CHRS_FDLU_ULU        as select * from db.MASTER_DATA.CHRS_FDLU_ULU;
    entity CHRS_COMP_INFO       as select * from db.MASTER_DATA.CHRS_COMP_INFO;
    entity APP_CONFIGS          as select * from db.UTILITY.APP_CONFIGS;
    entity CWS_APP_CONFIGS      as select * from db.UTILITY.CWS_APP_CONFIGS;
    entity CHRS_APPROVER_MATRIX as select * from db.UTILITY.CHRS_APPROVER_MATRIX;
    entity CHRS_EXTERNAL_USERS  as select * from db.UTILITY.CHRS_EXTERNAL_USERS;
    entity CHRS_ROLE_MASTER     as select * from db.UTILITY.CHRS_ROLE_MASTER;
    entity PROCESS_CONFIG       as select * from db.UTILITY.PROCESS_CONFIG;
    entity MASTER_CLAIM_TYPE    as select * from db.MASTER_DATA.MASTER_CLAIM_TYPE;
    entity REMARKS_DATA         as select * from db.UTILITY.REMARKS_DATA;
    @open
    type object {};

    function loadTableData(Tablename : String) returns object;

}
