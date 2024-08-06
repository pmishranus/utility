@protocol :'rest'
type approverMatrixType {
    PROCESS_CODE     : String;
    PROCESS_TYPE     : String;
    // PROCESS_TITLE    : String;
    // ULU              : String;
    // ULU_T            : String;
    // FDLU             : String;
    // FDLU_T           : String;
    // STAFF_USER_GRP   : String;
    // STAFF_USER_ALIAS : String;
    // STAFF_NUSNET_ID  : String;
    // STAFF_ID         : String;
    // FULL_NM          : String;
    // AUTH_ID          : String;
    // VALID_FROM       : String;
    // VALID_TO         : String;
    // IS_EXCLUDED      : Integer;
    // STATUS_CODE      : String;
    // MESSAGE          : String;
    // REQUESTOR_GRP    : String;
    // S_NO             : Integer;
    // IS_DELETED       : String;
}


service ApproverMatrix @(path: '/approvermatrix') {

  @open
  type object {};
  // type array [];
  action createEntry(data : object) returns String;
  action deleteEntry() returns String;
  action matrixReqUpload() returns String;

}