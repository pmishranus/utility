using {nusext as db} from '../db/datamodel';

using {
  PRJ_BASE_ECLAIM_REQUEST_VIEW,
  ECLAIM_REQUEST_VIEW,
  ECLAIMS_ITEM_VIEW,
  OT_VERIFIER_APPROVER_LIST,
  TASK_INBOX
} from '../db/redefinemodel';

@(impl : 'srv/eclaims-service.js')
service EclaimsService @(path: '/eclaims') {

  @open
  type object {};


  /********************************************************************* Functions ***************************************************************************************************/
 function dummy()         returns {};
  /********************************************************************* Actions ***************************************************************************************************/

  action eclaimsOverviewDashboard(data : object) returns String;
  /******************************************************************** Calculation Views Exposed *********************************************************************************/

  @readonly
  entity v_base_eclaim_request_view as projection on PRJ_BASE_ECLAIM_REQUEST_VIEW;

  @readonly
  entity v_eclaim_request_view      as
    projection on ECLAIM_REQUEST_VIEW {
      *,
      ![MasterClaimTypeDetails] : Association to many db.MASTER_DATA.MASTER_CLAIM_TYPE on ![MasterClaimTypeDetails].CLAIM_TYPE_C = CLAIM_TYPE,
      ![EclaimsItemDataDetails] : Association to many db.ECLAIMS.ITEMS_DATA on ![EclaimsItemDataDetails].DRAFT_ID = DRAFT_ID,
      ![StatusConfigDetails]    : Association to many db.UTILITY.STATUS_CONFIG on ![StatusConfigDetails].STATUS_CODE = REQUEST_STATUS
    }

  @readonly
  entity v_eclaim_item_view         as projection on ECLAIMS_ITEM_VIEW;

  @readonly
  entity v_ot_approver_lists        as projection on OT_VERIFIER_APPROVER_LIST;

  /********************************************************************************************************************************************************************************/


  /******************************************************************** Custom Views Exposed *********************************************************************************/
  define view v_eclaim_item_cons as
    select from db.ECLAIMS.ITEMS_DATA as A
    inner join db.ECLAIMS.HEADER_DATA as B
      on A.![DRAFT_ID] = B.![DRAFT_ID]

    left outer join db.UTILITY.PROCESS_DETAILS as PROCESS
      on PROCESS.REFERENCE_ID = A.![DRAFT_ID]

    left outer join db.UTILITY.TASK_DETAILS as TASKS
      on  PROCESS.PROCESS_INST_ID = TASKS.PROCESS_INST_ID
      and TASKS.TASK_NAME         = 'APPROVER'
      and TASKS.ACTION_CODE       = 'APPROVE'

    left outer join db.UTILITY.PROCESS_PARTICIPANTS as VERIFIER
      on  VERIFIER.REFERENCE_ID     = A.DRAFT_ID
      and VERIFIER.USER_DESIGNATION = 'VERIFIER'
      and VERIFIER.IS_DELETED       = 'N'

    left outer join db.UTILITY.PROCESS_PARTICIPANTS as ADDITIONAL_APP_1
      on  ADDITIONAL_APP_1.REFERENCE_ID     = A.DRAFT_ID
      and ADDITIONAL_APP_1.USER_DESIGNATION = 'ADDITIONAL_APP_1'
      and ADDITIONAL_APP_1.IS_DELETED       = 'N'

    left outer join db.UTILITY.PROCESS_PARTICIPANTS as ADDITIONAL_APP_2
      on  ADDITIONAL_APP_2.REFERENCE_ID     = A.DRAFT_ID
      and ADDITIONAL_APP_2.USER_DESIGNATION = 'ADDITIONAL_APP_2'
      and ADDITIONAL_APP_2.IS_DELETED       = 'N'

    left outer join (
      select
        RATE_CODE,
        RATE_DESC
      from db.MASTER_DATA.RATE_TYPE_MASTER_DATA
    ) as RATE_TYPE
      on RATE_TYPE.RATE_CODE = A.RATE_TYPE

    left outer join db.MASTER_DATA.CHRS_FDLU_ULU as CHRS_FDLU_ULU
      on  CHRS_FDLU_ULU.FDLU_C = B.FDLU
      and CHRS_FDLU_ULU.ULU_C  = B.ULU

    left outer join db.MASTER_DATA.MASTER_CLAIM_TYPE as CLAIM_TYPE
      on CLAIM_TYPE.CLAIM_TYPE_C = B.CLAIM_TYPE

    left outer join db.UTILITY.STATUS_CONFIG as STATUS_CONFIG
      on STATUS_CONFIG.STATUS_CODE = B.![REQUEST_STATUS]
    {
          B.CLAIM_TYPE,
          TO_VARCHAR(
            B.DATE_JOINED, 'DD.MM.YYYY'
          )                                as DATE_JOINED  : Date,
          B.EMPLOYEE_GRP,
          B.FDLU,
          B.FULL_NM,
          B.REQUEST_ID,
          B.REQUEST_STATUS,
          B.STAFF_ID,
          B.ULU,
          B.SUBMITTED_ON,
          A.CLAIM_MONTH,
          A.CLAIM_YEAR,
      key A.DRAFT_ID,
          A.RATE_TYPE,
          A.WBS,
          A.RATE_TYPE_AMOUNT,
          SUM(
            A.HOURS_UNIT
          )                                as HOURS_UNIT   : Int64,
          SUM(
            A.TOTAL_AMOUNT
          )                                as TOTAL_AMOUNT : Decimal(10, 2),
          PROCESS.PROCESS_INST_ID,
          TASKS.TASK_COMPLETED_BY          as APPROVER_STAFF_ID,
          TASKS.TASK_COMPLETED_BY_NID      as APPROVER_NUSNET_ID,
          VERIFIER.STAFF_ID                as VERIFIER_STAFF_ID,
          VERIFIER.NUSNET_ID               as VERIFIER_NUSNET_ID,
          VERIFIER.STAFF_FULL_NAME         as VERIFIER_STAFF_FULL_NAME,
          ADDITIONAL_APP_1.STAFF_ID        as ADDITIONAL_APP_1_STAFF_ID,
          ADDITIONAL_APP_1.NUSNET_ID       as ADDITIONAL_APP_1_NUSNET_ID,
          ADDITIONAL_APP_1.STAFF_FULL_NAME as ADDITIONAL_APP_1_STAFF_FULL_NAME,
          ADDITIONAL_APP_2.STAFF_ID        as ADDITIONAL_APP_2_STAFF_ID,
          ADDITIONAL_APP_2.NUSNET_ID       as ADDITIONAL_APP_2_NUSNET_ID,
          ADDITIONAL_APP_2.STAFF_FULL_NAME as ADDITIONAL_APP_2_STAFF_FULL_NAME,
          RATE_TYPE.RATE_DESC,
          CHRS_FDLU_ULU.FDLU_T,
          CHRS_FDLU_ULU.ULU_T,
          CLAIM_TYPE.CLAIM_TYPE_T,
          STATUS_CONFIG.STATUS_ALIAS,
          STATUS_CONFIG.STATUS_COLOR_CODE,
          STATUS_CONFIG.STATUS_CODE
    }
    where
          B.REQUEST_ID              <> ''
      and A.IS_DELETED              =  'N'
      and STATUS_CONFIG.STATUS_TYPE =  'ECLAIMS'
    group by
      B.REQUEST_ID,
      B.CLAIM_TYPE,
      B.STAFF_ID,
      B.FULL_NM,
      B.ULU,
      B.FDLU,
      B.EMPLOYEE_GRP,
      B.DATE_JOINED,
      B.REQUEST_STATUS,
      B.SUBMITTED_ON,
      A.DRAFT_ID,
      A.CLAIM_YEAR,
      A.CLAIM_MONTH,
      A.WBS,
      A.RATE_TYPE,
      A.CLAIM_YEAR,
      A.RATE_TYPE_AMOUNT,
      PROCESS.PROCESS_INST_ID,
      TASKS.TASK_COMPLETED_BY,
      TASKS.TASK_COMPLETED_BY_NID,
      VERIFIER.STAFF_ID,
      VERIFIER.NUSNET_ID,
      VERIFIER.STAFF_FULL_NAME,
      ADDITIONAL_APP_1.STAFF_ID,
      ADDITIONAL_APP_1.NUSNET_ID,
      ADDITIONAL_APP_1.STAFF_FULL_NAME,
      ADDITIONAL_APP_2.STAFF_ID,
      ADDITIONAL_APP_2.NUSNET_ID,
      ADDITIONAL_APP_2.STAFF_FULL_NAME,
      RATE_TYPE.RATE_DESC,
      CHRS_FDLU_ULU.FDLU_T,
      CHRS_FDLU_ULU.ULU_T,
      CLAIM_TYPE.CLAIM_TYPE_T,
      STATUS_CONFIG.STATUS_ALIAS,
      STATUS_CONFIG.STATUS_COLOR_CODE,
      STATUS_CONFIG.STATUS_CODE;


/********************************************************************************************************************************************************************************/

}
