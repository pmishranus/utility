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


service UtilService @(path: '/util') {

  entity CHRS_JOB_INFO                                                               as select * from db.MASTER_DATA.CHRS_JOB_INFO;
  entity CHRS_EXTERNAL_USERS                                                         as select * from db.UTILITY.CHRS_EXTERNAL_USERS;
  entity CHRS_COST_DIST                                                              as select * from db.MASTER_DATA.CHRS_COST_DIST;

  entity CHECK_COST_DIST_EXISTS(nusnetId : String, startDate : Date, endDate : Date) as
    select from CHRS_COST_DIST
    where
          STF_NUMBER in (
        select STF_NUMBER from CHRS_JOB_INFO
        where
          (
               UPPER(NUSNET_ID) = UPPER(
              :nusnetId
            )
            or STF_NUMBER       = :nusnetId
          )
      )
      and START_DATE <= :endDate
      and END_DATE   >= :startDate;

  function userInfo()       returns userType;
  function getUserDetails() returns UtilResponse;

}
