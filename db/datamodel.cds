namespace com.nus.edu.sg;

context REUSE_CONTEXT_TYPES {


}

context ECLAIMS {
    Entity HEADER_DATA	 {
        key DRAFT_ID        : String;
		REQUEST_ID		    : String;
		CLAIM_TYPE          : String;
        STAFF_ID            : String;
        STAFF_NUSNET_ID     : String;
        CONCURRENT_STAFF_ID : String;
        ULU                 : String;
        FDLU                : String;
        EMPLOYEE_GRP        : String;
        DATE_JOINED         : String;
        EMP_RATE_TYPE       : String;
        CLAIM_YEAR          : String;
        CLAIM_MONTH         : String;
        REQUEST_STATUS      : String;
        SUBMITTED_ON        : Date;
        SUBMITTED_BY        : String;
        SUBMITTED_BY_NID    : String;
        REQUESTOR_GRP       : String;
        CREATED_ON          : DateTime;
        ULU_T               : String;
        FULL_NM             : String;
        CLAIM_REQUEST_TYPE  : String;
        MODIFIED_BY         : String;
        MODIFIED_BY_NID     : String;
        MODIFIED_ON         : DateTime;
        WORKING_HOURS       : String;
        STF_CLAIM_TYPE_CAT  : String;
        APPOINTMENT_TRACK   : String;
    };
}


context CWNED {
    
}

context UTILITY {
    
}

context MASTER_DATA {

}