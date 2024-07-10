using { com.nus.edu.sg as db } from '../db/datamodel';

service CatalogService @(path : '/catalog') {
  
  entity eclaims_data as projection on db.ECLAIMS.HEADER_DATA;
  entity eclaims_items_data as projection on db.ECLAIMS.ITEMS_DATA;
  entity tax_benefit_grps as projection on db.ECLAIMS.TAX_BFT_CLAIMS_GRP;

  entity cwsned_data as projection on db.CWNED.HEADER_DATA;
  entity cwsyearsplit_data as projection on db.CWNED.YEAR_SPLIT_DATA;
  entity cwsassistance_data as projection on db.CWNED.ASSISTANCE_DATA;
  entity cwspayment_data as projection on db.CWNED.PAYMENT_DATA;
  entity opwncons_data as projection on db.CWNED.OPWN_OTP_CONSOLIDATED_DATA;
  entity opwnconserr_data as projection on db.CWNED.OPWN_OTP_CONSOLIDATED_ERR_DATA;
  entity opwnpayimg_data as projection on db.CWNED.OPWN_PAYMENT_IMG_DATA;


  entity appconfig_data as projection on db.UTILITY.APP_CONFIGS;
  entity attachments_data as projection on db.UTILITY.ATTACHMENTS_DATA;
  entity auditlog_data as projection on db.UTILITY.AUDIT_LOG_DATA;
  entity crdtnls_data as projection on db.UTILITY.BTP_CREDENTIALS;
  entity appmatrix_data as projection on db.UTILITY.CHRS_APPROVER_MATRIX;
  entity extusers_data as projection on db.UTILITY.CHRS_EXTERNAL_USERS;
  entity rolemaster_data as projection on db.UTILITY.CHRS_ROLE_MASTER;
  entity claimdurationcfg_data as projection on db.UTILITY.CLAIM_REQUEST_DURATION_CONFIG;
  entity cwsappconfig_data as projection on db.UTILITY.CWS_APP_CONFIGS;
  entity uluemail_data as projection on db.UTILITY.CWS_ULU_EMAIL_CONFIG;
  entity dashboard_data as projection on db.UTILITY.DASHBOARD_CONFIG;
  entity datetoweek_data as projection on db.UTILITY.DATE_TO_WEEK;
  entity emailconfigs_data as projection on db.UTILITY.EMAIL_CONFIGS;
  entity emailplholdercfg_data as projection on db.UTILITY.EMAIL_PLACEHOLDER_CONFIG;
  entity emailtemplate_data as projection on db.UTILITY.EMAIL_TEMPLATES;
  

}