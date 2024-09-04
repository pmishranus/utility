@cds.persistence.exists
@cds.persistence.calcview
entity APPROVAL_MATRIX {
    key AUTH_ID         : String(15)  @title: 'AUTH_ID: AUTH_ID';
        PROCESS_CODE    : String(6)   @title: 'PROCESS_CODE: PROCESS_CODE';
        ULU             : String(15)  @title: 'ULU: ULU';
        FDLU            : String(15)  @title: 'FDLU: FDLU';
        STAFF_USER_GRP  : String(50)  @title: 'STAFF_USER_GRP: STAFF_USER_GRP';
        STAFF_NUSNET_ID : String(15)  @title: 'STAFF_NUSNET_ID: STAFF_NUSNET_ID';
        STAFF_ID        : String(15)  @title: 'STAFF_ID: STAFF_ID';
        VALID_FROM      : Date        @title: 'VALID_FROM: VALID_FROM';
        VALID_TO        : Date        @title: 'VALID_TO: VALID_TO';
        UPDATED_BY      : String(15)  @title: 'UPDATED_BY: UPDATED_BY';
        UPDATED_BY_NID  : String(15)  @title: 'UPDATED_BY_NID: UPDATED_BY_NID';
        UPDATED_ON      : String      @title: 'UPDATED_ON: UPDATED_ON';
        APM_VALID_FROM  : String      @title: 'APM_VALID_FROM: APM_VALID_FROM';
        APM_VALID_TO    : String      @title: 'APM_VALID_TO: APM_VALID_TO';
        PROCESS_TYPE    : String(20)  @title: 'PROCESS_TYPE: PROCESS_TYPE';
        FULL_NM         : String(256) @title: 'FULL_NM: FULL_NM';
        STAFF_STATUS    : String(1)   @title: 'STAFF_STATUS: STAFF_STATUS';
        STAFF_ULU_C     : String(100) @title: 'STAFF_ULU_C: ULU_C';
        STAFF_ULU_T     : String(100) @title: 'STAFF_ULU_T: ULU_T';
        STAFF_FDLU_C    : String(100) @title: 'STAFF_FDLU_C: FDLU_C';
        STAFF_FDLU_T    : String(100) @title: 'STAFF_FDLU_T: FDLU_T';
        FDLU_T          : String(100) @title: 'FDLU_T: FDLU_T';
        ULU_T           : String(100) @title: 'ULU_T: ULU_T';
        PROCESS_TITLE   : String(100) @title: 'PROCESS_TITLE: PROCESS_TITLE';
        ROLE_CODE_LBL   : String(100) @title: 'ROLE_CODE_LBL: ROLE_CODE_LBL';
};

@cds.persistence.exists
@cds.persistence.calcview
entity BASE_ECLAIM_REQUEST_VIEW {
    key DRAFT_ID            : String(15)  @title: 'DRAFT_ID: DRAFT_ID';
    key REQUEST_ID          : String(15)  @title: 'REQUEST_ID: REQUEST_ID';
    key CLAIM_TYPE          : String(6)   @title: 'CLAIM_TYPE: CLAIM_TYPE';
    key STAFF_ID            : String(15)  @title: 'STAFF_ID: STAFF_ID';
    key STAFF_NUSNET_ID     : String(15)  @title: 'STAFF_NUSNET_ID: STAFF_NUSNET_ID';
    key CONCURRENT_STAFF_ID : String(15)  @title: 'CONCURRENT_STAFF_ID: CONCURRENT_STAFF_ID';
    key ULU                 : String(15)  @title: 'ULU: ULU';
    key FDLU                : String(15)  @title: 'FDLU: FDLU';
    key EMPLOYEE_GRP        : String(20)  @title: 'EMPLOYEE_GRP: EMPLOYEE_GRP';
    key DATE_JOINED         : String(25)  @title: 'DATE_JOINED: DATE_JOINED';
    key EMP_RATE_TYPE       : String(10)  @title: 'EMP_RATE_TYPE: EMP_RATE_TYPE';
    key CLAIM_YEAR          : String(4)   @title: 'CLAIM_YEAR: CLAIM_YEAR';
    key CLAIM_MONTH         : String(2)   @title: 'CLAIM_MONTH: CLAIM_MONTH';
    key REQUEST_STATUS      : String(2)   @title: 'REQUEST_STATUS: REQUEST_STATUS';
    key SUBMITTED_ON        : Date        @title: 'SUBMITTED_ON: SUBMITTED_ON';
    key SUBMITTED_BY        : String(15)  @title: 'SUBMITTED_BY: SUBMITTED_BY';
    key SUBMITTED_BY_NID    : String(15)  @title: 'SUBMITTED_BY_NID: SUBMITTED_BY_NID';
    key REQUESTOR_GRP       : String(50)  @title: 'REQUESTOR_GRP: REQUESTOR_GRP';
    key CREATED_ON          : String      @title: 'CREATED_ON: CREATED_ON';
    key CLAIM_REQUEST_TYPE  : String(10)  @title: 'CLAIM_REQUEST_TYPE: CLAIM_REQUEST_TYPE';
    key MODIFIED_BY_NID     : String(15)  @title: 'MODIFIED_BY_NID: MODIFIED_BY_NID';
    key MODIFIED_ON         : String      @title: 'MODIFIED_ON: MODIFIED_ON';
    key WORKING_HOURS       : String(100) @title: 'WORKING_HOURS: WORKING_HOURS';
    key STF_CLAIM_TYPE_CAT  : String(10)  @title: 'STF_CLAIM_TYPE_CAT: STF_CLAIM_TYPE_CAT';
    key APPOINTMENT_TRACK   : String(10)  @title: 'APPOINTMENT_TRACK: APPOINTMENT_TRACK';
    key CLAIM_TYPE_T        : String(100) @title: 'CLAIM_TYPE_T: CLAIM_TYPE_T';
    key STATUS_CODE         : String(2)   @title: 'STATUS_CODE: STATUS_CODE';
    key STATUS_TYPE         : String(10)  @title: 'STATUS_TYPE: STATUS_TYPE';
    key STATUS_ALIAS        : String(100) @title: 'STATUS_ALIAS: STATUS_ALIAS';
        STATUS_COLOR_CODE   : Integer     @title: 'STATUS_COLOR_CODE: STATUS_COLOR_CODE';
    key EMP_GP_C            : String(100) @title: 'EMP_GP_C: EMP_GP_C';
    key EMP_GP_T            : String(100) @title: 'EMP_GP_T: EMP_GP_T';
    key FDLU_C              : String(100) @title: 'FDLU_C: FDLU_C';
    key FULL_NM             : String(256) @title: 'FULL_NM: FULL_NM';
    key JOIN_DATE           : Date        @title: 'JOIN_DATE: JOIN_DATE';
    key SF_STF_NUMBER       : String(100) @title: 'SF_STF_NUMBER: SF_STF_NUMBER';
};

define view PRJ_BASE_ECLAIM_REQUEST_VIEW as select * from BASE_ECLAIM_REQUEST_VIEW;


@cds.persistence.exists
@cds.persistence.calcview
entity ECLAIM_REQUEST_VIEW {
    key DRAFT_ID                   : String(15)  @title: 'DRAFT_ID: DRAFT_ID';
    key REQUEST_ID                 : String(15)  @title: 'REQUEST_ID: REQUEST_ID';
    key CLAIM_TYPE                 : String(6)   @title: 'CLAIM_TYPE: CLAIM_TYPE';
    key STAFF_ID                   : String(15)  @title: 'STAFF_ID: STAFF_ID';
    key STAFF_NUSNET_ID            : String(15)  @title: 'STAFF_NUSNET_ID: STAFF_NUSNET_ID';
    key CONCURRENT_STAFF_ID        : String(15)  @title: 'CONCURRENT_STAFF_ID: CONCURRENT_STAFF_ID';
    key ULU                        : String(15)  @title: 'ULU: ULU';
    key FDLU                       : String(15)  @title: 'FDLU: FDLU';
    key EMPLOYEE_GRP               : String(20)  @title: 'EMPLOYEE_GRP: EMPLOYEE_GRP';
    key DATE_JOINED                : String(25)  @title: 'DATE_JOINED: DATE_JOINED';
    key EMP_RATE_TYPE              : String(10)  @title: 'EMP_RATE_TYPE: EMP_RATE_TYPE';
    key CLAIM_YEAR                 : String(4)   @title: 'CLAIM_YEAR: CLAIM_YEAR';
    key CLAIM_MONTH                : String(2)   @title: 'CLAIM_MONTH: CLAIM_MONTH';
    key REQUEST_STATUS             : String(2)   @title: 'REQUEST_STATUS: REQUEST_STATUS';
    key SUBMITTED_ON               : Date        @title: 'SUBMITTED_ON: SUBMITTED_ON';
    key SUBMITTED_BY               : String(15)  @title: 'SUBMITTED_BY: SUBMITTED_BY';
    key SUBMITTED_BY_NID           : String(15)  @title: 'SUBMITTED_BY_NID: SUBMITTED_BY_NID';
    key REQUESTOR_GRP              : String(50)  @title: 'REQUESTOR_GRP: REQUESTOR_GRP';
    key CREATED_ON                 : String      @title: 'CREATED_ON: CREATED_ON';
    key CLAIM_REQUEST_TYPE         : String(10)  @title: 'CLAIM_REQUEST_TYPE: CLAIM_REQUEST_TYPE';
    key MODIFIED_BY_NID            : String(15)  @title: 'MODIFIED_BY_NID: MODIFIED_BY_NID';
    key MODIFIED_ON                : String      @title: 'MODIFIED_ON: MODIFIED_ON';
    key WORKING_HOURS              : String(100) @title: 'WORKING_HOURS: WORKING_HOURS';
    key STF_CLAIM_TYPE_CAT         : String(10)  @title: 'STF_CLAIM_TYPE_CAT: STF_CLAIM_TYPE_CAT';
    key APPOINTMENT_TRACK          : String(10)  @title: 'APPOINTMENT_TRACK: APPOINTMENT_TRACK';
    key CLAIM_TYPE_T               : String(100) @title: 'CLAIM_TYPE_T: CLAIM_TYPE_T';
    key STATUS_CODE                : String(2)   @title: 'STATUS_CODE: STATUS_CODE';
    key STATUS_TYPE                : String(10)  @title: 'STATUS_TYPE: STATUS_TYPE';
    key STATUS_ALIAS               : String(100) @title: 'STATUS_ALIAS: STATUS_ALIAS';
        STATUS_COLOR_CODE          : Integer     @title: 'STATUS_COLOR_CODE: STATUS_COLOR_CODE';
    key EMP_GP_C                   : String(100) @title: 'EMP_GP_C: EMP_GP_C';
    key EMP_GP_T                   : String(100) @title: 'EMP_GP_T: EMP_GP_T';
    key FDLU_C                     : String(100) @title: 'FDLU_C: FDLU_C';
    key FULL_NM                    : String(256) @title: 'FULL_NM: FULL_NM';
    key JOIN_DATE                  : Date        @title: 'JOIN_DATE: JOIN_DATE';
    key SF_STF_NUMBER              : String(100) @title: 'SF_STF_NUMBER: SF_STF_NUMBER';
    key VERIFIER_PPNT_ID           : String(15)  @title: 'VERIFIER_PPNT_ID: VERIFIER_PPNT_ID';
    key VERIFIER_REFERENCE_ID      : String(15)  @title: 'VERIFIER_REFERENCE_ID: VERIFIER_REFERENCE_ID';
    key VERIFIER_USER_DESIGNATION  : String(20)  @title: 'VERIFIER_USER_DESIGNATION: VERIFIER_USER_DESIGNATION';
    key VERIFIER_STAFF_ID          : String(15)  @title: 'VERIFIER_STAFF_ID: VERIFIER_STAFF_ID';
    key VERIFIER_NUSNET_ID         : String(15)  @title: 'VERIFIER_NUSNET_ID: VERIFIER_NUSNET_ID';
    key VERIFIER_STAFF_FULL_NAME   : String(50)  @title: 'VERIFIER_STAFF_FULL_NAME: VERIFIER_STAFF_FULL_NAME';
    key ADD_APP_1_PPNT_ID          : String(15)  @title: 'ADD_APP_1_PPNT_ID: ADD_APP_1_PPNT_ID';
    key ADD_APP_1_REFERENCE_ID     : String(15)  @title: 'ADD_APP_1_REFERENCE_ID: ADD_APP_1_REFERENCE_ID';
    key ADD_APP_1_USER_DESIGNATION : String(20)  @title: 'ADD_APP_1_USER_DESIGNATION: ADD_APP_1_USER_DESIGNATION';
    key ADD_APP_1_STAFF_ID         : String(15)  @title: 'ADD_APP_1_STAFF_ID: ADD_APP_1_STAFF_ID';
    key ADD_APP_1_NUSNET_ID        : String(15)  @title: 'ADD_APP_1_NUSNET_ID: ADD_APP_1_NUSNET_ID';
    key ADD_APP_1_STAFF_FULL_NAME  : String(50)  @title: 'ADD_APP_1_STAFF_FULL_NAME: ADD_APP_1_STAFF_FULL_NAME';
    key ADD_APP_2_PPNT_ID          : String(15)  @title: 'ADD_APP_2_PPNT_ID: ADD_APP_2_PPNT_ID';
    key ADD_APP_2_REFERENCE_ID     : String(15)  @title: 'ADD_APP_2_REFERENCE_ID: ADD_APP_2_REFERENCE_ID';
    key ADD_APP_2_USER_DESIGNATION : String(20)  @title: 'ADD_APP_2_USER_DESIGNATION: ADD_APP_2_USER_DESIGNATION';
    key ADD_APP_2_STAFF_ID         : String(15)  @title: 'ADD_APP_2_STAFF_ID: ADD_APP_2_STAFF_ID';
    key ADD_APP_2_NUSNET_ID        : String(15)  @title: 'ADD_APP_2_NUSNET_ID: ADD_APP_2_NUSNET_ID';
    key ADD_APP_2_STAFF_FULL_NAME  : String(50)  @title: 'ADD_APP_2_STAFF_FULL_NAME: ADD_APP_2_STAFF_FULL_NAME';
    key PROCESS_INST_ID            : String(12)  @title: 'PROCESS_INST_ID: PROCESS_INST_ID';
    key PROCESS_CODE               : String(6)   @title: 'PROCESS_CODE: PROCESS_CODE';
    key PROCESS_STATUS             : String(2)   @title: 'PROCESS_STATUS: PROCESS_STATUS';
    key PROCESS_ACTUAL_DOC         : Date        @title: 'PROCESS_ACTUAL_DOC: PROCESS_ACTUAL_DOC';
    key PROCESS_STATUS_ALIAS       : String(100) @title: 'PROCESS_STATUS_ALIAS: PROCESS_STATUS_ALIAS';
        PROCESS_STATUS_COLOR_CODE  : Integer     @title: 'PROCESS_STATUS_COLOR_CODE: PROCESS_STATUS_COLOR_CODE';
    key CAL_PROCESS_INST_ID        : String(12)  @title: 'CAL_PROCESS_INST_ID: CAL_PROCESS_INST_ID';
    key IS_LOCKED                  : String(2)   @title: 'IS_LOCKED: IS_LOCKED';
    key LOCKED_BY_USER_NID         : String(20)  @title: 'LOCKED_BY_USER_NID: LOCKED_BY_USER_NID';
    key LOCKED_STAFF_USER_GRP      : String(50)  @title: 'LOCKED_STAFF_USER_GRP: LOCKED_STAFF_USER_GRP';
    key FDLU_T                     : String(100) @title: 'FDLU_T: FDLU_T';
    key ULU_T                      : String(100) @title: 'ULU_T: ULU_T';
    key LOCKED_USER_FULL_NM        : String(256) @title: 'LOCKED_USER_FULL_NM: LOCKED_USER_FULL_NM';
};


@cds.persistence.exists
@cds.persistence.calcview
entity ECLAIMS_ITEM_VIEW {
        CC_1                       : Integer64    @title: 'CC_1: CC_1';
    key PROCESS_CODE               : String(6)    @title: 'PROCESS_CODE: PROCESS_CODE';
    key PROCESS_STATUS             : String(2)    @title: 'PROCESS_STATUS: PROCESS_STATUS';
    key PROCESS_INST_ID            : String(12)   @title: 'PROCESS_INST_ID: PROCESS_INST_ID';
    key IS_LOCKED                  : String(2)    @title: 'IS_LOCKED: IS_LOCKED';
    key LOCKED_BY_USER_NID         : String(20)   @title: 'LOCKED_BY_USER_NID: LOCKED_BY_USER_NID';
    key LOCKED_STAFF_USER_GRP      : String(50)   @title: 'LOCKED_STAFF_USER_GRP: LOCKED_STAFF_USER_GRP';
    key VERIFIER_STAFF_ID          : String(15)   @title: 'VERIFIER_STAFF_ID: VERIFIER_STAFF_ID';
    key VERIFIER_STAFF_FULL_NAME   : String(50)   @title: 'VERIFIER_STAFF_FULL_NAME: VERIFIER_STAFF_FULL_NAME';
    key VERIFIER_NUSNET_ID         : String(15)   @title: 'VERIFIER_NUSNET_ID: VERIFIER_NUSNET_ID';
    key SF_STF_NUMBER              : String(100)  @title: 'SF_STF_NUMBER: SF_STF_NUMBER';
    key ULU_T                      : String(100)  @title: 'ULU_T: ULU_T';
    key FULL_NM                    : String(256)  @title: 'FULL_NM: FULL_NM';
    key CLAIM_REQUEST_TYPE         : String(10)   @title: 'CLAIM_REQUEST_TYPE: CLAIM_REQUEST_TYPE';
    key ADD_APP_2_USER_DESIGNATION : String(20)   @title: 'ADD_APP_2_USER_DESIGNATION: ADD_APP_2_USER_DESIGNATION';
    key ADD_APP_2_STAFF_ID         : String(15)   @title: 'ADD_APP_2_STAFF_ID: ADD_APP_2_STAFF_ID';
    key ADD_APP_2_STAFF_FULL_NAME  : String(50)   @title: 'ADD_APP_2_STAFF_FULL_NAME: ADD_APP_2_STAFF_FULL_NAME';
    key ADD_APP_2_REFERENCE_ID     : String(15)   @title: 'ADD_APP_2_REFERENCE_ID: ADD_APP_2_REFERENCE_ID';
    key ADD_APP_2_NUSNET_ID        : String(15)   @title: 'ADD_APP_2_NUSNET_ID: ADD_APP_2_NUSNET_ID';
    key ADD_APP_1_REFERENCE_ID     : String(15)   @title: 'ADD_APP_1_REFERENCE_ID: ADD_APP_1_REFERENCE_ID';
    key ADD_APP_1_USER_DESIGNATION : String(20)   @title: 'ADD_APP_1_USER_DESIGNATION: ADD_APP_1_USER_DESIGNATION';
    key ADD_APP_1_STAFF_ID         : String(15)   @title: 'ADD_APP_1_STAFF_ID: ADD_APP_1_STAFF_ID';
    key ADD_APP_1_NUSNET_ID        : String(15)   @title: 'ADD_APP_1_NUSNET_ID: ADD_APP_1_NUSNET_ID';
    key ADD_APP_1_STAFF_FULL_NAME  : String(50)   @title: 'ADD_APP_1_STAFF_FULL_NAME: ADD_APP_1_STAFF_FULL_NAME';
    key VERIFIER_USER_DESIGNATION  : String(20)   @title: 'VERIFIER_USER_DESIGNATION: VERIFIER_USER_DESIGNATION';
    key VERIFIER_REFERENCE_ID      : String(15)   @title: 'VERIFIER_REFERENCE_ID: VERIFIER_REFERENCE_ID';
    key CLAIM_TYPE                 : String(6)    @title: 'CLAIM_TYPE: CLAIM_TYPE';
    key CLAIM_YEAR                 : String(4)    @title: 'CLAIM_YEAR: CLAIM_YEAR';
    key CLAIM_MONTH                : String(2)    @title: 'CLAIM_MONTH: CLAIM_MONTH';
    key CONCURRENT_STAFF_ID        : String(15)   @title: 'CONCURRENT_STAFF_ID: CONCURRENT_STAFF_ID';
    key DATE_JOINED                : String(25)   @title: 'DATE_JOINED: DATE_JOINED';
    key DRAFT_ID                   : String(15)   @title: 'DRAFT_ID: DRAFT_ID';
    key EMPLOYEE_GRP               : String(20)   @title: 'EMPLOYEE_GRP: EMPLOYEE_GRP';
    key EMP_RATE_TYPE              : String(10)   @title: 'EMP_RATE_TYPE: EMP_RATE_TYPE';
    key FDLU                       : String(15)   @title: 'FDLU: FDLU';
    key REQUESTOR_GRP              : String(50)   @title: 'REQUESTOR_GRP: REQUESTOR_GRP';
    key REQUEST_ID                 : String(15)   @title: 'REQUEST_ID: REQUEST_ID';
    key REQUEST_STATUS             : String(2)    @title: 'REQUEST_STATUS: REQUEST_STATUS';
    key STAFF_ID                   : String(15)   @title: 'STAFF_ID: STAFF_ID';
    key STAFF_NUSNET_ID            : String(15)   @title: 'STAFF_NUSNET_ID: STAFF_NUSNET_ID';
    key SUBMITTED_BY               : String(15)   @title: 'SUBMITTED_BY: SUBMITTED_BY';
    key SUBMITTED_BY_NID           : String(15)   @title: 'SUBMITTED_BY_NID: SUBMITTED_BY_NID';
    key ULU                        : String(15)   @title: 'ULU: ULU';
    key CLAIM_TYPE_T               : String(100)  @title: 'CLAIM_TYPE_T: CLAIM_TYPE_T';
    key STATUS_ALIAS               : String(100)  @title: 'STATUS_ALIAS: STATUS_ALIAS';
    key STATUS_CODE                : String(2)    @title: 'STATUS_CODE: STATUS_CODE';
    key STATUS_TYPE                : String(10)   @title: 'STATUS_TYPE: STATUS_TYPE';
    key EMP_GP_C                   : String(100)  @title: 'EMP_GP_C: EMP_GP_C';
    key EMP_GP_T                   : String(100)  @title: 'EMP_GP_T: EMP_GP_T';
    key FDLU_C                     : String(100)  @title: 'FDLU_C: FDLU_C';
    key FDLU_T                     : String(100)  @title: 'FDLU_T: FDLU_T';
    key JOIN_DATE                  : Date         @title: 'JOIN_DATE: JOIN_DATE';
        STATUS_COLOR_CODE          : Integer      @title: 'STATUS_COLOR_CODE: STATUS_COLOR_CODE';
    key CREATED_ON                 : String       @title: 'CREATED_ON: CREATED_ON';
    key SUBMITTED_ON               : Date         @title: 'SUBMITTED_ON: SUBMITTED_ON';
    key APPOINTMENT_TRACK          : String(10)   @title: 'APPOINTMENT_TRACK: APPOINTMENT_TRACK';
    key ITEM_ID                    : String(15)   @title: 'ITEM_ID: ITEM_ID';
    key CLAIM_START_DATE           : String(15)   @title: 'CLAIM_START_DATE: CLAIM_START_DATE';
    key CLAIM_END_DATE             : String(15)   @title: 'CLAIM_END_DATE: CLAIM_END_DATE';
    key CLAIM_DAY_TYPE             : String(20)   @title: 'CLAIM_DAY_TYPE: CLAIM_DAY_TYPE';
        IS_PH                      : Integer      @title: 'IS_PH: IS_PH';
    key START_TIME                 : String(10)   @title: 'START_TIME: START_TIME';
    key END_TIME                   : String(10)   @title: 'END_TIME: END_TIME';
    key HOURS_COMPUTED             : String(6)    @title: 'HOURS_COMPUTED: HOURS_COMPUTED';
    key HOURS                      : String(6)    @title: 'HOURS: HOURS';
    key CLAIM_MONTH_1              : String(10)   @title: 'CLAIM_MONTH_1: CLAIM_MONTH_1';
    key CLAIM_WEEK_NO              : String(6)    @title: 'CLAIM_WEEK_NO: CLAIM_WEEK_NO';
    key CLAIM_YEAR_1               : String(4)    @title: 'CLAIM_YEAR_1: CLAIM_YEAR_1';
    key WBS                        : String(20)   @title: 'WBS: WBS';
    key WBS_DESC                   : String(100)  @title: 'WBS_DESC: WBS_DESC';
    key RATE_TYPE                  : String(100)  @title: 'RATE_TYPE: RATE_TYPE';
        RATE_TYPE_AMOUNT           : Decimal(10)  @title: 'RATE_TYPE_AMOUNT: RATE_TYPE_AMOUNT';
        IS_DISCREPENCY             : Integer      @title: 'IS_DISCREPENCY: IS_DISCREPENCY';
        TOTAL_AMOUNT               : Decimal(10)  @title: 'TOTAL_AMOUNT: TOTAL_AMOUNT';
        IS_MARK_DELETION           : Integer      @title: 'IS_MARK_DELETION: IS_MARK_DELETION';
    key REMARKS                    : String(500)  @title: 'REMARKS: REMARKS';
    key CLAIM_DAY                  : String(20)   @title: 'CLAIM_DAY: CLAIM_DAY';
    key RATE_UNIT                  : String(15)   @title: 'RATE_UNIT: RATE_UNIT';
        HOURS_UNIT                 : Decimal(5)   @title: 'HOURS_UNIT: HOURS_UNIT';
    key IS_DELETED                 : String(2)    @title: 'IS_DELETED: IS_DELETED';
    key OBJECT_ID                  : String(15)   @title: 'OBJECT_ID: OBJECT_ID';
    key OBJECT_TYPE                : String(20)   @title: 'OBJECT_TYPE: OBJECT_TYPE';
    key CC_CLAIM_START_DATE        : Date         @title: 'CC_CLAIM_START_DATE: CC_CLAIM_START_DATE';
    key CC_CLAIM_END_DATE          : Date         @title: 'CC_CLAIM_END_DATE: CC_CLAIM_END_DATE';
    key VERIFIER_ON                : String       @title: 'VERIFIER_ON: VERIFIER_ON';
    key ADD_APRV_1_ON              : String       @title: 'ADD_APRV_1_ON: ADD_APRV_1_ON';
    key ADD_APRV_2_ON              : String       @title: 'ADD_APRV_2_ON: ADD_APRV_2_ON';
    key APPROVED_ON                : String       @title: 'APPROVED_ON: APPROVED_ON';
    key APPROVED_BY                : String(15)   @title: 'APPROVED_BY: APPROVED_BY';
    key CA_REMARKS                 : String(5000) @title: 'CA_REMARKS: CA_REMARKS';
    key VERIFIER_REMARKS           : String(5000) @title: 'VERIFIER_REMARKS: VERIFIER_REMARKS';
    key ADD_APP_1_REMARKS          : String(5000) @title: 'ADD_APP_1_REMARKS: ADD_APP_1_REMARKS';
    key ADD_APP_2_REMARKS          : String(5000) @title: 'ADD_APP_2_REMARKS: ADD_APP_2_REMARKS';
    key APP_REMARKS                : String(5000) @title: 'APP_REMARKS: APP_REMARKS';
    key RATE_DESC                  : String(20)   @title: 'RATE_DESC: RATE_DESC';
    key APPROVER_STAFF_FULL_NM     : String(256)  @title: 'APPROVER_STAFF_FULL_NM: APPROVER_STAFF_FULL_NM';
    key BEN_TYPE                   : String(2)    @title: 'BEN_TYPE: BEN_TYPE';
    key TITLE                      : String(250)  @title: 'TITLE: TITLE';
    key BEN_GROUP                  : String(4)    @title: 'BEN_GROUP: BEN_GROUP';
    key OBJECT_NAME                : String(256)  @title: 'OBJECT_NAME: FULL_NM1';
};

@cds.persistence.exists
@cds.persistence.calcview
entity OT_VERIFIER_APPROVER_LIST {
    key PROCESS_CODE             : String(6)   @title: 'PROCESS_CODE: PROCESS_CODE';
    key TASK_NAME                : String(40)  @title: 'TASK_NAME: TASK_NAME';
    key TASK_ASSGN_TO_STF_NUMBER : String(15)  @title: 'TASK_ASSGN_TO_STF_NUMBER: TASK_ASSGN_TO_STF_NUMBER';
        FULL_NM                  : String(256) @title: 'FULL_NM: FULL_NM';
    key TASK_ASSGN_TO            : String(15)  @title: 'TASK_ASSGN_TO: TASK_ASSGN_TO';
};


@cds.persistence.exists
@cds.persistence.udf
entity ECLAIMS_REMARKS_AGG_F {
    key REFERENCE_ID    : String(20);
    key STAFF_USER_TYPE : String(40);
    key REMARKS         : String(5000);
    key REMARKS_LENGTH  : Integer;
};
