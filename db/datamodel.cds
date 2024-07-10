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
    Entity ITEMS_DATA	 {
        key ITEM_ID         : String; // Primary key of Items Data (DRAFT ID + 2 digit sequence no.)
        DRAFT_ID            : String; // Foreign reference with the parent table
        CLAIM_START_DATE    : String; // Claim Start Date selection
        CLAIM_END_DATE      : String; // Claim End Date (for Consolidated submission, else it is )
        CLAIM_DAY_TYPE      : String; // Workday or Rest Day or Public Holiday
        IS_PH               : Integer; //Is Public Holiday Indicator
        START_TIME          : String; // Start Time in HH:mm format entered per day wise
        END_TIME            : String; // End Time in HH:mm format entered per day wise
        HOURS_COMPUTED      : String; // Actual Hours Computed on the form after entering Start and End Time
        HOURS               : String; // Same as Hours Computed. If edited by user, then capture the changed value.
        CLAIM_MONTH         : String; // Copy the Claim Month from the Header Table
        CLAIM_WEEK_NO       : String; // Auto-populate the Week No. of the Year and populate for showing the view of Week
        CLAIM_YEAR          : String; // Populate the Claim Year when the month is selected for submission
        WBS                 : String;
        WBS_DESC            : String;
        RATE_TYPE           : String; //Rate Type 
        RATE_TYPE_AMOUNT    : Decimal(10,2); //Populate Rate Type Amount or Rate Unit based on Rate Type selected
        IS_DISCREPENCY      : Integer;
        DISC_RATETYPE_AMOUNT: String; // Discrepency Rate Type Amount
        TOTAL_AMOUNT        : Decimal(10,2);
        IS_MULTIPLE         : Integer; // '1' if same claim day has multiple records else '0'
        IS_MARK_DELETION    : Integer; // Used as a flag to indicate that it's marked for deletion for Audit Log Purpose
        REMARKS             : String; //Capture remarks at each Claim Date
        UPDATED_BY          : String; //Capture the logged in user name
        UPDATED_ON          : Date; //Capture the timestamp of the action taken.
        CLAIM_DAY           : String; // claim day
        RATE_UNIT           : String;
        HOURS_UNIT          : Decimal(5,2);
        IS_DELETED          : String; // Column added for soft deleting item data
        WAGE_CODE           : String;
        OBJECT_ID           : String;
        OBJECT_TYPE         : String;
    };
     Entity TAX_BFT_CLAIMS_GRP	 {
        key BEN_TYPE        : String;
        START_DATE          : Date;
        END_DATE            : Date;
        TITLE               : String;
        BEN_GROUP           : String;
     };
}


context CWNED {
     Entity HEADER_DATA	 {
        key REQ_UNIQUE_ID   : String;
		REQUEST_ID		    : String;
		PROCESS_CODE        : String;
		TYPE                : String;
		REQUEST_TYPE        : String;
		START_DATE          : Date;
		END_DATE            : Date; 
		START_DATE_CAL      : DateTime; //To populate UTC time of Start Date (can be used for OData Filter)
		END_DATE_CAL        : DateTime; //To populate UTC time of End Date (can be used for OData Filter)
		FACULTY_C           : String; //Faculty Code on header data
        DEPT_C              : String; // Department Code on header data
        DURATION_DAYS       : Decimal(5,2);
		DURATION_HOURS      : Decimal(5,2);
        SUB_TYPE            : String;
        CLIENT_NAME         : String;
        LOCATION            : String;
        WORK_DETAILS        : String;
        WORK_HOURS          : String;
        TIME_OFF_REQD       : String;
        PROPERTY_USAGE      : String;
        PROPERTY_DETAILS    : String;
        STAFF_ID            : String;
        CONCURRENT_STAFF_ID : String;
        OFFLINE_APPROVAL    : String;
        IS_REQUEST_CLOSED   : String;
        REQUEST_STATUS      : String;
        REQUESTOR_GRP       : String;
        SUBMITTED_BY        : String;
        SUBMITTED_ON        : Date;
        MODIFIED_BY         : String;
        MODIFIED_ON         : DateTime;
        STAFF_NUSNET_ID     : String;
		ULU                 : String;
        FDLU                : String;
        SUBMITTED_ON_TS     : DateTime;
        SUBMITTED_BY_NID    : String;
        SUBMISSION_TYPE     : String;
        TO_DISPLAY          : String;
        PROGRAM_NAME        : String;
        AMOUNT              : Decimal(10,2);
        AGREED_AMOUNT       : Decimal(10,2);
        CURRENCY            : String;
        AGREED_CURRENCY     : String;
        MIGRATED            : String;
        MASS_REF_VAL        : String; //This is to link between Mass Upload Request and ZIP files
        MASS_REF_UPLOAD_ID  : String; //ZIP Upload ID Reference for the Scheduled Program
        SOURCE              : String;
        IS_OFN_EXECUTED     : String;
        OFN_EXTRACT_DATE    : DateTime; 
        IS_WAIVED           : String; //Y or N
        IS_ZIP_PROCESSED    : String;
     };
     Entity YEAR_SPLIT_DATA	 {
        key SPLIT_ID        : String;
		REFERENCE_ID		: String;
		YEAR                : String;
		DURATION            : Decimal(5,2);
		TOTAL_UTILIZATION_YR: Decimal(5,2);
        CREATED_BY          : String;
        CREATED_ON          : DateTime;
        MODIFIED_BY         : String;
        MODIFIED_ON         : DateTime;
        IS_DELETED          : String; // Column added for Soft Deletion
     };
     Entity ASSISTANCE_DATA	 {
        key ASSISTANCE_ID   : String;
		REFERENCE_ID		: String;
		STAFF_ID            : String;
		STAFF_NAME          : String;
		STAFF_ULU           : String;
		STAFF_FDLU          : String;
		CREATED_BY          : String;
        CREATED_ON          : DateTime;
        MODIFIED_BY         : String;
        MODIFIED_ON         : DateTime;
        IS_DELETED          : String; // Column added for Soft Deletion
     };
     Entity WBS_DATA	 {
        key ID              : String;
		REFERENCE_ID		: String;
		WBS                 : String;
        VALUE               : Decimal(5,2);
        UNIT                : String;
		CREATED_BY          : String;
        CREATED_ON          : DateTime;
        MODIFIED_BY         : String;
        MODIFIED_ON         : DateTime;
        IS_DELETED          : String; // Column added for Soft Deletion
		WBS_CODE            : String;
     };
     Entity PAYMENT_DATA	 {
        key PAYMENT_ID      : String;
		REFERENCE_ID		: String;
		REQUEST_TYPE        : String;
		YEAR                : String;
		PAYMENT_DATE        : Date;
		PAYMENT_DATE_CAL    : DateTime;
		PAYMENT_REF_NO      : String;
		REMUNERATION_TYPE   : String;
		STOCK_QNTY          : Integer;
		STOCK_OPTION_QNTY   : Integer;
		UNIT_TYPE           : String;
		SHARES              : Decimal(10,2);
		CURRENCY            : String;
		AMOUNT              : Decimal(10,2);
		DESCRIPTION         : String;
		LEVY_AMOUNT         : Decimal(10,2);
		IS_WAIVED           : String; //Y or N
		BIZ_EXP_CRNCY       : String;
		BIZ_EXP_AMT         : Decimal(10,2);
		PAYMENT_REQ_STATUS  : String;
		CREATED_BY          : String;
        CREATED_ON          : DateTime;
        MODIFIED_BY         : String;
        MODIFIED_ON         : DateTime;
        PAYMENT_TYPE        : String;
        IS_DELETED          : String; // Column added for Soft Deletion
        MONTH               : String;
        WBS                 : String;
        OBJ_KEY 	    	: String;
        INVOICE_NO	    	: String;
		CLR_DOC_NO          : String;
     };
     Entity OPWN_PAYMENT_IMG_DATA {
        key PAYMENT_ID      : String;
		REFERENCE_ID		: String;
		REQ_REFERENCE_ID    : String;
		STAFF_ID            : String;
		MONTH               : String;
		YEAR                : String;
        WBS                 : String;
        ALLOTMENT_VAL       : Decimal(5,2);
        PAYMENT_TYPE_R      : String;
        PAYMENT_TYPE_C      : String;
		AMOUNT              : Decimal(10,2);
		CURRENCY            : String;
		PAYMENT_DATE        : Date;
		PAYMENT_DATE_CAL    : DateTime;
		PAYMENT_REQ_STATUS  : String;
		ADMIN_LAPSE         : String;
        MODIFIED_BY         : String;
        MODIFIED_ON         : DateTime;
        SF_SEQUENCE         : String;
        MESSAGE_LOG         : String;
     };
     Entity OPWN_OTP_CONSOLIDATED_DATA	 {
        key SF_SEQUENCE     : String;
		STAFF_ID            : String;
		CURRENCY            : String;
		WBS                 : String;
		REQ_REFERENCE_ID    : String;
		REFERENCE_ID        : String;
		PAYMENT_TYPE_C      : String;
		PAYMENT_DATE        : String;
		PAYMENT_DATE_CAL    : DateTime;
		VALUE               : Decimal(10,2);
	    POSTING_STATUS      : String;
        MODIFIED_BY         : String;
        MODIFIED_ON         : DateTime;
        MESSAGE_LOG         : String;
        MONTH               : String;
		YEAR                : String;
     };
     Entity OPWN_OTP_CONSOLIDATED_ERR_DATA	 {
        key SF_SEQUENCE     : String;
		STAFF_ID            : String;
		CURRENCY            : String;
		WBS                 : String;
		REQ_REFERENCE_ID    : String;
		REFERENCE_ID        : String;
		PAYMENT_TYPE_C      : String;
		PAYMENT_DATE        : String;
		PAYMENT_DATE_CAL    : DateTime;
		VALUE               : Decimal(10,2);
	    POSTING_STATUS      : String;
        MODIFIED_BY         : String;
        MODIFIED_ON         : DateTime;
        MESSAGE_LOG         : String;
        MONTH               : String;
		YEAR                : String;
     };
}

context UTILITY {
    
}

context MASTER_DATA {

}