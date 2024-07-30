using {nusext as db} from '../db/datamodel';

using {APPROVAL_MATRIX} from '../db/redefinemodel';

service CatalogService @(path: '/catalog') {
  @requires: 'authenticated-user'
  @readonly
  entity eclaims_data             as projection on db.ECLAIMS.HEADER_DATA;

  @requires: 'Admin'
  @restrict: [{grant: 'READ'}]
  @readonly
  entity eclaims_items_data       as projection on db.ECLAIMS.ITEMS_DATA;

  @readonly
  entity tax_benefit_grps         as projection on db.ECLAIMS.TAX_BFT_CLAIMS_GRP;

  @readonly
  entity cwsned_data              as projection on db.CWNED.HEADER_DATA;

  @readonly
  entity cwsyearsplit_data        as projection on db.CWNED.YEAR_SPLIT_DATA;

  @readonly
  entity cwsassistance_data       as projection on db.CWNED.ASSISTANCE_DATA;

  @readonly
  entity cwspayment_data          as projection on db.CWNED.PAYMENT_DATA;

  @readonly
  entity opwncons_data            as projection on db.CWNED.OPWN_OTP_CONSOLIDATED_DATA;

  @readonly
  entity opwnconserr_data         as projection on db.CWNED.OPWN_OTP_CONSOLIDATED_ERR_DATA;

  @readonly
  entity opwnpayimg_data          as projection on db.CWNED.OPWN_PAYMENT_IMG_DATA;

  @readonly
  entity appconfig_data           as projection on db.UTILITY.APP_CONFIGS;

  entity attachments_data         as projection on db.UTILITY.ATTACHMENTS_DATA;

  @readonly
  entity auditlog_data            as projection on db.UTILITY.AUDIT_LOG_DATA;

  entity crdtnls_data             as projection on db.UTILITY.BTP_CREDENTIALS;
  entity appmatrix_data           as projection on db.UTILITY.CHRS_APPROVER_MATRIX;
  entity extusers_data            as projection on db.UTILITY.CHRS_EXTERNAL_USERS;
  entity rolemaster_data          as projection on db.UTILITY.CHRS_ROLE_MASTER;

  @readonly
  entity claimdurationcfg_data    as projection on db.UTILITY.CLAIM_REQUEST_DURATION_CONFIG;

  entity cwsappconfig_data        as projection on db.UTILITY.CWS_APP_CONFIGS;
  entity uluemail_data            as projection on db.UTILITY.CWS_ULU_EMAIL_CONFIG;
  entity dashboard_data           as projection on db.UTILITY.DASHBOARD_CONFIG;

  @readonly
  entity datetoweek_data          as projection on db.UTILITY.DATE_TO_WEEK;

  @readonly
  entity emailcfg_data            as projection on db.UTILITY.EMAIL_CONFIGS;

  entity emailpholdercfg_data     as projection on db.UTILITY.EMAIL_PLACEHOLDER_CONFIG;
  entity emailtemplate_data       as projection on db.UTILITY.EMAIL_TEMPLATES;
  entity feedback_data            as projection on db.UTILITY.FEEDBACK_DETAILS;

  @readonly
  entity notiflog_data            as projection on db.UTILITY.NOTIFICATION_LOG_DATA;

  entity holidays_data            as projection on db.UTILITY.NUS_CHRS_HOLIDAYS;
  entity processcfg_data          as projection on db.UTILITY.PROCESS_CONFIG;
  entity processdetails_data      as projection on db.UTILITY.PROCESS_DETAILS;
  entity processparticipants_data as projection on db.UTILITY.PROCESS_PARTICIPANTS;
  entity remarks_data             as projection on db.UTILITY.REMARKS_DATA;
  entity reqlock_data             as projection on db.UTILITY.REQUEST_LOCK_DETAILS;
  entity seqgen_data              as projection on db.UTILITY.SEQ_GEN;
  entity statusconfig_data        as projection on db.UTILITY.STATUS_CONFIG;
  entity taskactioncfg_data       as projection on db.UTILITY.TASK_ACTION_CONFIG;
  entity taskdelegation_data      as projection on db.UTILITY.TASK_DELEGATION_DETAILS;
  entity taskdetails_data         as projection on db.UTILITY.TASK_DETAILS;
  entity taskcfg_data             as projection on db.UTILITY.TASKS_CONFIG;
  entity compinfo_data            as projection on db.MASTER_DATA.CHRS_COMP_INFO;
  entity costdist_data            as projection on db.MASTER_DATA.CHRS_COST_DIST;
  entity eligcriteria_data        as projection on db.MASTER_DATA.CHRS_ELIG_CRITERIA;
  entity fdluulu_data             as projection on db.MASTER_DATA.CHRS_FDLU_ULU;
  entity hrpinfo_data             as projection on db.MASTER_DATA.CHRS_HRP_INFO;
  entity jobinfo_data             as projection on db.MASTER_DATA.CHRS_JOB_INFO;
  entity param_entries_data       as projection on db.MASTER_DATA.CHRS_PARAM_ENTRIES;
  entity payroll_area_data        as projection on db.MASTER_DATA.CHRS_PAYROLL_AREA;
  entity pa_psa_data              as projection on db.MASTER_DATA.CHRS_ULU_FDLU_PA_PSA;
  entity emplist_data             as projection on db.MASTER_DATA.EMPLOYEE_LIST;
  entity emplist_concur_data      as projection on db.MASTER_DATA.EMPLOYEE_LISTING_CONCUR;
  entity claimtype_master_data    as projection on db.MASTER_DATA.MASTER_CLAIM_TYPE;
  entity ratetype_data            as projection on db.MASTER_DATA.RATE_TYPE_MASTER_DATA;
  entity repcompinfo_data         as projection on db.MASTER_DATA.CHRS_REPLICATION_COMP_INFO;
  entity repcostdist_data         as projection on db.MASTER_DATA.CHRS_REPLICATION_COST_DIST;
  entity rephrpinfo_data          as projection on db.MASTER_DATA.CHRS_REPLICATION_HRP_INFO;
  entity repjobinfo_data          as projection on db.MASTER_DATA.CHRS_REPLICATION_JOB_INFO;



/******************************************************************** Calculation Views Exposed *********************************************************************************/

@readonly
entity v_approval_maxtrix         as projection on APPROVAL_MATRIX;

/********************************************************************************************************************************************************************************/






  // Handling user info with the authentication and user scopes

  type userScopes {
    identified    : Boolean;
    authenticated : Boolean;
    Viewer        : Boolean;
    Admin         : Boolean;
  };

  type userType {
    user   : String;
    locale : String;
    scopes : userScopes;
  };

  function userInfo() returns userType;

  

}

