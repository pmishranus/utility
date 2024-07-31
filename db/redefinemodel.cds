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
}

@cds.persistence.exists
@cds.persistence.udf
entity CHECK_COST_DIST_EXISTS_F {
        key STF_NUMBER    : String(100);
        key SF_STF_NUMBER : String(100);
        key START_DATE    : Date;
        key END_DATE      : Date;
            COST_DIST_FLG : String(10);
            NUSNET_ID : String(100);
};
