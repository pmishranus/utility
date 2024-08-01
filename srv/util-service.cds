type primaryAssignment {
  SF_STF_NUMBER  : String;
  STF_NUMBER     : String;
  ULU_C          : String;
  ULU_T          : String;
  FDLU_C         : String;
  FDLU_T         : String;
  JOIN_DATE      : Date;
  PAYSCALE_GRP_C : String;
  PAYSCALE_GRP_T : String;
  JOB_LVL_C      : String;
  JOB_LVL_T      : String;
  JOB_GRD_C      : String;
  JOB_GRD_T      : String;
  NUSNET_ID      : String;
  START_DATE     : Date;
  END_DATE       : Date;
};

type claimAuthorizations {
  ULU_C          : String;
  ULU_T          : String;
  FDLU_C         : String;
  FDLU_T         : String;
  STAFF_USER_GRP : String;
  VALID_FROM     : String;
  VALID_TO       : Date;
  PROCESS_CODE   : String;
};

type approverMatrixs {
  STF_NUMBER     : String;
  ULU_C          : String;
  ULU_T          : String;
  FDLU_C         : String;
  FDLU_T         : String;
  STAFF_USER_GRP : String;
  VALID_FROM     : String;
  VALID_TO       : Date;
  PROCESS_CODE   : String;
};

type staffInfo {
  ![primaryAssignment]   : primaryAssignment;
  BANK_INFO_FLG          : String;
  FULL_NM                : String;
  EMAIL                  : String;
  FIRST_NM               : String;
  LAST_NM                : String;
  STAFF_ID               : String;
  COST_DIST_FLG          : String;
  ![claimAuthorizations] : claimAuthorizations;
  ![approverMatrix]      : approverMatrixs;
  ![inboxApproverMatrix] : approverMatrixs;
  ![otherAssignment]     : array of primaryAssignment;
}

type UtilResponse {

  ![isError]          : String;
  ![message]          : String;
  ![staffInfo]        : staffInfo;
  ![IS_EXTERNAL_USER] : String;
}

type appConfigurationRequests {
  ACFG_ID          : String;
  CWS_ACFG_ID      : String;
  SRC_CONFIG       : String;
  PROCESS_CODE     : String;
  CONFIG_DESC      : String;
  CONFIG_KEY       : String;
  REFERENCE_KEY    : String;
  REFERENCE_VALUE  : String;
  CFG_TYPE         : String;
  CONFIG_VALUE     : String;
  IS_MAINT_BY_USER : String;
  IS_ACTIVE        : String;
  UPDATED_BY       : String;
  UPDATED_BY_NID   : String;
  UPDATED_ON       : Date;
  STATUS_CODE      : String;
  MESSAGE          : String;

}


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

using {nusext as db} from '../db/datamodel';
// using {CHECK_COST_DIST_EXISTS_F} from '../db/redefinemodel';


service UtilService @(path: '/util') {

  entity CHRS_JOB_INFO       as select * from db.MASTER_DATA.CHRS_JOB_INFO;
  entity CHRS_EXTERNAL_USERS as select * from db.UTILITY.CHRS_EXTERNAL_USERS;
  entity CHRS_COST_DIST      as select * from db.MASTER_DATA.CHRS_COST_DIST;

  // entity CHECK_COST_DIST_EXISTS(nusnetId : String, startDate: Date, endDate : Date)
  //  as select * from CHECK_COST_DIST_EXISTS_F where NUSNET_ID = :nusnetId and START_DATE <= :endDate and END_DATE >= :startDate;

  function userInfo()       returns userType;
  function getUserDetails() returns UtilResponse;

  action appConfigCreateEntry(data : appConfigurationRequests) returns String;

}
