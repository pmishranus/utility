using {nusext as db} from '../db/datamodel';

@protocol: 'rest'
type approverMatrixType {
    PROCESS_CODE : String;
    PROCESS_TYPE : String;
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
    action createEntry(data : object)                                                                                                              returns String;
    action deleteEntry()                                                                                                                           returns String;
    action matrixReqUpload(matrixFile : Binary, requestorGrp : String, ulu : String, fdlu : String, processCode : String, noOfHeaderRows : String) returns String;

    entity staff_based_usergroup_ulu_fdlu(staffId : String, userGroup : String) as
        select from db.UTILITY.CHRS_APPROVER_MATRIX as am
        left outer join db.MASTER_DATA.CHRS_JOB_INFO as u
            on  u.ULU_C  = am.ULU
            and u.FDLU_C = case
                               when
                                   am.FDLU = 'ALL'
                               then
                                   u.FDLU_C
                               else
                                   am.FDLU
                           end

        {
            key cast(
                    concat(
                        concat(
                            u.ULU_T, '('
                        ), concat(
                            u.ULU_C, ')'
                        )
                    ) || ' / ' || concat(
                        concat(
                            u.FDLU_T, '('
                        ), concat(
                            u.FDLU_C, ')'
                        )
                    ) as String(2000)
                ) as UluFdlu
        }
        where
                am.IS_DELETED     = 'N'
            and (
                $now between am.VALID_FROM and am.VALID_TO
            )
            and am.STAFF_ID       = :staffId
            and am.STAFF_USER_GRP = :userGroup

}
