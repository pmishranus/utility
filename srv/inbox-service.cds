type taskDetailsDto {
    TASK_INST_ID           : String;
    PROCESS_INST_ID        : String;
    TASK_NAME              : String;
    TASK_STATUS            : String;
    TASK_ALIAS_NAME        : String;
    TASK_CREATED_ON        : Timestamp;
    TASK_CREATED_BY        : String;
    TASK_USER_STAFF_ID     : String;
    TASK_USER_NID          : String;
    TASK_USER_FULLNAME     : String;
    TASK_ASSGN_TO          : String;
    TASK_DELEGATED_TO      : String;
    DELEGATED_TO_FULLNAME  : String;
    TASK_ASSGN_GRP         : String;
    TASK_COMPLETED_BY      : String;
    TASK_COMPLETED_BY_NID  : String;
    TASK_EXPECTED_DOC      : Date;
    TASK_ACTUAL_DOC        : Timestamp;
    TASK_ICON_TYPE         : String;
    COMPLETED_BY_FULL_NAME : String;
    TASK_SEQUENCE          : Integer;
    TASK_POSITION          : Integer;
    ACTION_CODE            : String;
    TO_BE_TASK_SEQUENCE    : Integer;
    REQUESTOR_GRP          : String;
    PROCESS_CODE           : String;
    DURATION_DAYS          : Decimal;
    MESSAGE                : String;
    statusCode             : String;
    STAFF_ID               : String;
    SUBMISSION_TYPE        : String;
    SUBMISSION_TYPE_ALIAS  : String;
    REQUEST_ID             : String;
    REQ_STATUS             : String;
    REQ_TYPE               : String;
    SUB_TYPE               : String;
    REQ_STATUS_ALIAS       : String;
    SUBMITTED_ON_TS        : Timestamp;
    MIGRATED               : String;
    OFFLINE_APPROVAL       : String;
    ULU                    : String;
    FDLU                   : String;
    TASK_NEW_ASSIGNEE      : String;
}

type taskDetailsStatusResponseDto {
    taskHistoryList  : array of taskDetailsDto;
    changeHistoryMap : String;
    requestMap       : String;
    isError          : Boolean;
    message          : String;
    statusCode       : String;
}

service InboxService @(path: '/task') {

    @open
    type object {};

    action   taskactions(data : object)                                       returns array of object;
    action   sendEmail(data : object)                                         returns String;
    action   echo(data : object)                                              returns object;
    function fetchTasksByProcessInstId(processInstId : String)                returns taskDetailsStatusResponseDto;
    function getProcessTrackerDetails(draftId : String, processCode : String) returns taskDetailsStatusResponseDto;

}
