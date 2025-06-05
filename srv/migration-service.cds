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

    entity CHRS_JOB_INFO                  as select * from db.MASTER_DATA.CHRS_JOB_INFO;
    entity CHRS_COST_DIST                 as select * from db.MASTER_DATA.CHRS_COST_DIST;
    entity CHRS_HRP_INFO                  as select * from db.MASTER_DATA.CHRS_HRP_INFO;
    entity CHRS_FDLU_ULU                  as select * from db.MASTER_DATA.CHRS_FDLU_ULU;
    entity CHRS_COMP_INFO                 as select * from db.MASTER_DATA.CHRS_COMP_INFO;
    entity CHRS_REPLICATION_JOB_INFO      as select * from db.MASTER_DATA.CHRS_REPLICATION_JOB_INFO;
    entity CHRS_REPLICATION_HRP_INFO      as select * from db.MASTER_DATA.CHRS_REPLICATION_HRP_INFO;
    entity CHRS_REPLICATION_COMP_INFO     as select * from db.MASTER_DATA.CHRS_REPLICATION_COMP_INFO;
    entity CHRS_REPLICATION_COST_DIST     as select * from db.MASTER_DATA.CHRS_REPLICATION_COST_DIST;
    entity CHRS_PARAM_ENTRIES             as select * from db.MASTER_DATA.CHRS_PARAM_ENTRIES;
    entity CHRS_ELIG_CRITERIA             as select * from db.MASTER_DATA.CHRS_ELIG_CRITERIA;
    entity HEADER_DATA                    as select * from db.ECLAIMS.HEADER_DATA;
    entity ITEMS_DATA                     as select * from db.ECLAIMS.ITEMS_DATA;
    entity TAX_BFT_CLAIMS_GRP             as select * from db.ECLAIMS.TAX_BFT_CLAIMS_GRP;
    entity CWS_HEADER_DATA                as select * from db.CWNED.HEADER_DATA;
    entity CWS_ASSISTANCE_DATA            as select * from db.CWNED.ASSISTANCE_DATA;
    entity CWS_PAYMENT_DATA               as select * from db.CWNED.PAYMENT_DATA;
    entity CWS_WBS_DATA                   as select * from db.CWNED.WBS_DATA;
    entity OPWN_PAYMENT_IMG_DATA          as select * from db.CWNED.OPWN_PAYMENT_IMG_DATA;
    entity OPWN_OTP_CONSOLIDATED_DATA     as select * from db.CWNED.OPWN_OTP_CONSOLIDATED_DATA;
    entity OPWN_OTP_CONSOLIDATED_ERR_DATA as select * from db.CWNED.OPWN_OTP_CONSOLIDATED_ERR_DATA;
    entity CWS_YEAR_SPLIT_DATA            as select * from db.CWNED.YEAR_SPLIT_DATA;
    entity CWS_REPORT_EXTRACT_DATA        as select * from db.CWNED.REPORT_EXTRACT_DATA;
    entity BTP_CREDENTIALS                as select * from db.UTILITY.BTP_CREDENTIALS;
    entity EMAIL_TEMPLATES                as select * from db.UTILITY.EMAIL_TEMPLATES;
    entity EMAIL_CONFIGS                  as select * from db.UTILITY.EMAIL_CONFIGS;
    entity EMAIL_PLACEHOLDER_CONFIG       as select * from db.UTILITY.EMAIL_PLACEHOLDER_CONFIG;
    entity AUDIT_LOG_DATA                 as select * from db.UTILITY.AUDIT_LOG_DATA;
    entity ATTACHMENTS_DATA               as select * from db.UTILITY.ATTACHMENTS_DATA;
    entity NOTIFICATION_LOG_DATA          as select * from db.UTILITY.NOTIFICATION_LOG_DATA;
    entity STATUS_CONFIG                  as select * from db.UTILITY.STATUS_CONFIG;
    entity TASKS_CONFIG                   as select * from db.UTILITY.TASKS_CONFIG;
    entity TASK_ACTION_CONFIG             as select * from db.UTILITY.TASK_ACTION_CONFIG;
    entity CLAIM_REQUEST_DURATION_CONFIG  as select * from db.UTILITY.CLAIM_REQUEST_DURATION_CONFIG;
    entity PROCESS_PARTICIPANTS           as select * from db.UTILITY.PROCESS_PARTICIPANTS;
    entity TASK_DELEGATION_DETAILS        as select * from db.UTILITY.TASK_DELEGATION_DETAILS;
    entity REQUEST_LOCK_DETAILS           as select * from db.UTILITY.REQUEST_LOCK_DETAILS;
    entity FEEDBACK_DETAILS               as select * from db.UTILITY.FEEDBACK_DETAILS;
    entity NUS_CHRS_HOLIDAYS              as select * from db.UTILITY.NUS_CHRS_HOLIDAYS;
    entity DATE_TO_WEEK                   as select * from db.UTILITY.DATE_TO_WEEK;
    entity APP_CONFIGS                    as select * from db.UTILITY.APP_CONFIGS;
    entity CWS_APP_CONFIGS                as select * from db.UTILITY.CWS_APP_CONFIGS;
    entity CHRS_APPROVER_MATRIX           as select * from db.UTILITY.CHRS_APPROVER_MATRIX;
    entity CHRS_EXTERNAL_USERS            as select * from db.UTILITY.CHRS_EXTERNAL_USERS;
    entity CHRS_ROLE_MASTER               as select * from db.UTILITY.CHRS_ROLE_MASTER;
    entity PROCESS_CONFIG                 as select * from db.UTILITY.PROCESS_CONFIG;
    entity MASTER_CLAIM_TYPE              as select * from db.MASTER_DATA.MASTER_CLAIM_TYPE;
    entity REMARKS_DATA                   as select * from db.UTILITY.REMARKS_DATA;
    entity PROCESS_DETAILS                as select * from db.UTILITY.PROCESS_DETAILS;
    entity TASK_DETAILS                   as select * from db.UTILITY.TASK_DETAILS;
    entity DASHBOARD_CONFIG               as select * from db.UTILITY.DASHBOARD_CONFIG;
    entity TICKET_MGMT_DETAILS            as select * from db.UTILITY.TICKET_MGMT_DETAILS;
    entity RATE_TYPE_MASTER_DATA          as select * from db.MASTER_DATA.RATE_TYPE_MASTER_DATA;

    @open
    type object {};

    function loadTableData(Tablename : String) returns object;

}
