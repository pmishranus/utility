const cds = require("@sap/cds");
const CommonRepo = require("../repository/util.repo");
const CommonUtils = require("../util/commonUtil");
const RequestLockDetailsRepo = require("../repository/requestLockDetails.repo");
const { ApplicationConstants, MessageConstants } = require("../util/constant").default;
const TaskDetailsRepo = require("../repository/taskDetails.repo");
const TaskConfigRepo = require("../repository/taskConfig.repo");
const TaskActionConfigRepo = require("../repository/taskActionConfig.repo");
const ProcessConfigType = require("../enum/processConfigType");
const ConfigurationType = require("../enum/configurationType");
const CwsDataRepo = require("../repository/cwsData.repo");
const EclaimsHeaderDataRepo = require("../repository/eclaimsData.repo");
const ProcessParticipantsRepo = require("../repository/processParticipants.repo");
const EmailService = require("../external/emailService")
async function massTaskAction(request, systemUserName,action) {
  let approveTasksRes = [];
  try {
    const tx = cds.tx(request);
    const user = request.user.id;
    const userName = "PTT_CA1";
    const upperNusNetId = userName.toUpperCase();
    let userInfoDetails = await CommonRepo.fetchUserInfo(upperNusNetId);
    if (!userName) {
      throw new Error("User not found..!!");
    }


    // let taskApprovalDtoList = [{ "REQUEST_ID": "CM2502000017", "DRAFT_ID": "DT2502000025", "TASK_INST_ID": "T2505000008", "ACTION_CODE": "APPROVE", "REJECT_REMARKS": "", "PROCESS_CODE": "103", "staffId": ["151292"], "loggedInStaffId": "913437" }]

    let taskApprovalDtoList = request.data.data ? request.data.data : [];

    if (!Array.isArray(taskApprovalDtoList) || taskApprovalDtoList.length === 0) {
      throw new Error("Task Approval Request is not valid.");
    }
    for (const taskApproval of taskApprovalDtoList) {
      let taskApprovalResponseDto = {};
      let taskDetailsById = null;
      let taskActionConfig = null;
      let nextTaskConfig = null;
      let processDetails = null;
      let taskHelperResponse = null;
      let nextTaskName = null;
      let requestorGroup = null;
      let pType = null;
      let sourceProcess = "";
      let isNextTask = false;
      let loggedInUserName = "";

      if (systemUserName) {
        loggedInUserName = systemUserName
      } else if (userInfoDetails.NUSNET_ID) {
        loggedInUserName = userInfoDetails.NUSNET_ID;
      }


      try {
        // 1. Validate Task Approval Operations from Application
        await validateApprovalTaskInput(taskApproval, userInfoDetails);

        // 2. Validate All Task Details Operations
        taskDetailsById = await validateTaskDetails(taskApproval, userInfoDetails);

        // 3. Fetch Process Details
        processDetails = await retrieveNCheckProcessData(taskApproval.TASK_INST_ID);

        //Start implmenting from here Pankaj
        // 4. Process Config Type and branching
        pType = ProcessConfigType.fromValue(taskApproval.PROCESS_CODE);

        switch (pType) {
          case "PTT":
          case "CW":
          case "OT":
          case "HM":
          case "TB":
            sourceProcess = ApplicationConstants.ECLAIMS_PROCESS;
            requestorGroup = await TaskDetailsRepo.fetchEclaimsDataRequestorGrpByTaskInstId(taskApproval.TASK_INST_ID);
            if (Array.isArray(requestorGroup)) {
              requestorGroup = requestorGroup.length ? requestorGroup[0].REQUESTOR_GRP : ""
            }
            taskHelperResponse = await retrieveEClaimsTaskConfig(
              taskDetailsById.TASK_NAME,
              processDetails.REFERENCE_ID,
              processDetails.PROCESS_CODE,
              taskApproval.ACTION_CODE,
              requestorGroup,
              taskApproval.ROLE
            );
            break;
          case "CWS":
          case "NED":
          case "OPWN":
            sourceProcess = ApplicationConstants.CWS_PROCESS;
            requestorGroup = await TaskDetailsRepo.fetchCwsDataRequestorGrpByTaskInstId(taskApproval.TASK_INST_ID);
            // Handle submission type for rejection
            if (taskApproval.ACTION_CODE === ApplicationConstants.ACTION_REJECT &&
              !taskApproval.SUBMISSION_TYPE) {
              const submissionType = await CwsDataRepo.fetchSubmissionType(taskApproval.DRAFT_ID);
              taskApproval.SUBMISSION_TYPE = submissionType;
            }
            taskHelperResponse = await retrieveCWTaskConfig(
              taskApproval,
              taskDetailsById.TASK_NAME,
              processDetails.REFERENCE_ID,
              processDetails.PROCESS_CODE,
              requestorGroup
            );
            break;
          default:
            break;
        }
        taskActionConfig = taskHelperResponse.taskActionConfig;
        nextTaskConfig = taskHelperResponse.nextTaskConfig;

        await completeCurrentTask(
          taskDetailsById,
          loggedInUserName,
          taskActionConfig.TO_BE_TASK_SEQUENCE,
          taskApproval.ACTION_CODE,
          userInfoDetails,
          tx
        );

        if (nextTaskConfig && nextTaskConfig.TASK_NAME) {
          nextTaskName = nextTaskConfig.TASK_NAME;
          isNextTask = true;
          await initializeNextTask(
            loggedInUserName,
            taskDetailsById.PROCESS_INST_ID,
            nextTaskName,
            nextTaskConfig.TASK_GRP,
            taskHelperResponse.taskAssignedTo,
            taskHelperResponse.taskAssignedToStaffId,
            taskActionConfig.TO_BE_TASK_SEQUENCE,
            userInfoDetails,
            tx
          );
        } else if (taskActionConfig && taskActionConfig.TO_BE_TASK_SEQUENCE < 0) {
          await processDetailsRepository.updateProcessDetailsStatus(
            tx,
            taskDetailsById.PROCESS_INST_ID,
            ApplicationConstants.STATUS_PROCESS_COMPLETED
          );
        }

        if (!systemUserName) {
          await requestStatusNRemarksUpdateHandler(
            loggedInUserName,
            taskApproval.DRAFT_ID,
            taskApproval.REJECT_REMARKS,
            taskActionConfig.TO_BE_REQUEST_STATUS,
            taskApproval.ACTION_CODE,
            taskDetailsById.TASK_NAME,
            taskApproval.IS_REMARKS_UPDATE,
            sourceProcess,
            taskApproval.REQUEST_ID,
            isNextTask,
            userInfoDetails,
            tx
          );

          if (!action) {
            await emailNotificationHandler(
              taskApproval,
              processDetails.PROCESS_CODE,
              requestorGroup,
              loggedInUserName,
              taskApproval.ROLE,
              taskDetailsById.TASK_NAME,
              nextTaskName,
              userInfoDetails,
              tx
            );
          }
        }

        if (CommonUtils.equalsIgnoreCase(sourceProcess, ApplicationConstants.CWS_PROCESS)) {
          await deleteRequestLocks(
            taskApproval.DRAFT_ID,
            null,
            taskApproval.PROCESS_CODE,
            tx
          );
        }

        // Copy properties and generate success response
        Object.assign(taskApprovalResponseDto, taskApproval);
        generateResponseMessageWithActionCode(taskApprovalResponseDto, "S", taskApproval.ACTION_CODE);

      } catch (err) {
        // Error for this task; generate error response
        generateResponseMessage(taskApprovalResponseDto, "E", err.message);
        tx.rollback();
      }


      approveTasksRes.push(taskApprovalResponseDto);
    }

  } catch (err) {
    // If there is a global error, rethrow or return as per your CAP error handling
    throw err;
  }

  console.log("InboxServiceImpl approveRejectTasks end()");
  return approveTasksRes;
}
async function deleteRequestLocks(draftId, requestorGrp, processCode, tx) {
  const requestDto = {
    DRAFT_ID: draftId,
    REQUESTOR_GRP: requestorGrp,
    PROCESS_CODE: processCode
  };

  await deleteLock(requestDto, tx);
}
async function deleteLock(requestDto, tx) {
  const responseDto = {};

  if (!requestDto.DRAFT_ID || requestDto.DRAFT_ID.trim() === "") {
    responseDto.message = "Reference ID is not provided";
    responseDto.statusCode = "E";
  } else {
    await RequestLockDetailsRepo.deleteByDraftId(requestDto.DRAFT_ID, tx);
    responseDto.statusCode = "S";
    responseDto.message = "All locks for Reference ID are deleted successfully";
  }

  return responseDto;
}
function generateResponseMessageWithActionCode(dto, status, actionCode, ApplicationConstants) {
  dto.STATUS = status;
  let message = ApplicationConstants.ackMessageApprove;

  if (actionCode && actionCode.toUpperCase() === ApplicationConstants.ACTION_RETRACT) {
    message = ApplicationConstants.ackMessageRetract;
  }
  if (actionCode && actionCode.toUpperCase() === ApplicationConstants.ACTION_REJECT) {
    message = ApplicationConstants.ackMessageReject;
  }
  if (actionCode && actionCode.toUpperCase() === ApplicationConstants.TASK_ACTION_CODE_WITHDRAW) {
    message = ApplicationConstants.ackMessageWithdrawn;
  }

  dto.message = message;
  dto.RESPONSE_MESSAGE = message;
}

function generateResponseMessage(dto, status, message) {
  dto.STATUS = status;
  dto.RESPONSE_MESSAGE = message;
  dto.message = message;
}
async function requestStatusNRemarksUpdateHandler(
  loggedInUserName,
  draftId,
  rejectionRemarks,
  requestStatus,
  actionCode,
  taskName,
  isRemarksUpdated,
  sourceProcess,
  requestId,
  isNextTask,
  userInfoDetails,
  tx
) {
  try {
    // let userInfoDetails = await userUtil.getUserDetails(loggedInUserName);

    if (draftId && CommonUtils.isNotBlank(draftId)) {
      // Set UTC date/time now for modification
      const modifiedOn = new Date();

      if (CommonUtils.equalsIgnoreCase(sourceProcess, ApplicationConstants.ECLAIMS_PROCESS)) {
        await EclaimsHeaderDataRepo.updateEClaimsDataOnTaskCompletion(
          tx,
          requestStatus,
          draftId,
          userInfoDetails.STF_NUMBER,
          loggedInUserName,
          modifiedOn
        );
      } else if (CommonUtils.equalsIgnoreCase(sourceProcess, ApplicationConstants.CWS_PROCESS)) {
        // userInfoDetails = await userUtil.getUserDetails(loggedInUserName);

        await CwsDataRepo.updateCwsRequestStatus(
          requestStatus,
          draftId,
          userInfoDetails.STF_NUMBER,
          modifiedOn
        );

        // Update Old Request TO_DISPLAY to N, If there is no Next Task
        if (!isNextTask) {
          if (CommonUtils.equalsIgnoreCase(actionCode, ApplicationConstants.ACTION_REJECT)) {
            await CwsDataRepo.updateCurReqToDisplayOnTaskCompletion(
              tx,
              requestId,
              draftId,
              userInfoDetails.STF_NUMBER,
              modifiedOn
            );
          } else {
            await CwsDataRepo.updateOldReqToDisplayOnTaskCompletion(
              tx,
              requestId,
              draftId,
              userInfoDetails.STF_NUMBER,
              modifiedOn
            );
          }
        }
        // Add OPWN payment update logic here if needed
      }

      // Handle Remarks on Reject
      if (
        CommonUtils.equalsIgnoreCase(actionCode, ApplicationConstants.TASK_ACTION_CODE_REJECT) &&
        rejectionRemarks &&
        CommonUtils.isNotBlank(rejectionRemarks) &&
        !isRemarksUpdated
      ) {
        // Construct remark ID pattern: RMKyyMM + sequence
        const now = new Date();
        const reqMonth = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-based
        const reqYear = String(now.getFullYear()).slice(-2);
        const remarkIdPattern = `RMK${reqYear}${reqMonth}`;
        const remarkId = await CommonRepo.fetchSequenceNumber(remarkIdPattern, 5);

        // Build RemarksData object
        const inputData = {
          ID: remarkId,
          NUSNET_ID: loggedInUserName,
          REFERENCE_ID: draftId,
          STAFF_ID: (userInfoDetails && userInfoDetails.STF_NUMBER) ? userInfoDetails.STF_NUMBER : loggedInUserName,
          STAFF_NAME: userInfoDetails.FULL_NM,
          REMARKS: rejectionRemarks.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
          REMARKS_UPDATE_ON: new Date().toISOString(), // or your preferred format
          STAFF_USER_TYPE: taskName,
          IS_EDITABLE: 0
        };

        //Insert Remarks Data
        await CommonRepo.upsertOperationChained(tx, "NUSEXT_UTILITY_REMARKS_DATA", inputData);
      }
    }
  } catch (exception) {
    throw new Error(exception.message);
  }
}

async function emailNotificationHandler(
  taskApproval,
  processCode,
  requestorGrp,
  loggedInUserName,
  role,
  taskName,
  nextTaskName,
  userInfoDetails,
  tx
) {
  // Get user details (assumed async)
  // const userInfoDetails = await userUtil.getUserDetails(loggedInUserName);

  const targetStaffId =
    userInfoDetails && userInfoDetails.STF_NUMBER
      ? userInfoDetails.STF_NUMBER
      : loggedInUserName;

  await EmailService.sendOnDemandEmails(
    taskApproval.DRAFT_ID,
    processCode,
    taskApproval.ACTION_CODE,
    requestorGrp,
    targetStaffId,
    taskApproval.REJECT_REMARKS,
    role,
    taskName,
    nextTaskName,
    null, // for the final argument
    userInfoDetails,
    tx
  );
}

async function completeCurrentTask(taskDetailsById, loggedInUserName, toBeTaskSequence, actionCode, userInfoDetails, tx) {
  // Get user details
  // const userInfoDetails = await userUtil.getUserDetails(loggedInUserName);

  // Set task status based on action code
  if (
    CommonUtils.equalsIgnoreCase(actionCode, ApplicationConstants.ACTION_RETRACT) ||
    CommonUtils.equalsIgnoreCase(actionCode, ApplicationConstants.ACTION_REVERT)
  ) {
    taskDetailsById.TASK_STATUS = ApplicationConstants.STATUS_TASK_CANCELLED;
  } else {
    taskDetailsById.TASK_STATUS = ApplicationConstants.STATUS_TASK_COMPLETED;
  }

  // Set to-be task sequence and action code
  taskDetailsById.TO_BE_TASK_SEQUENCE = toBeTaskSequence;
  taskDetailsById.ACTION_CODE = actionCode;

  // If not WITHDRAW, set completed by info and timestamp
  if (CommonUtils.notEqualsIgnoreCase(actionCode, ApplicationConstants.ACTION_WITHDRAW)) {
    taskDetailsById.TASK_COMPLETED_BY_NID = loggedInUserName;
    taskDetailsById.TASK_COMPLETED_BY =
      userInfoDetails && userInfoDetails.STF_NUMBER && userInfoDetails.STF_NUMBER !== ''
        ? userInfoDetails.STF_NUMBER
        : loggedInUserName;
    // Set UTC timestamp (CAP uses JS Date objects)
    taskDetailsById.TASK_ACTUAL_DOC = new Date();
  }

  // Save/update the task (assuming repository has an upsert/update/save function)
  await CommonRepo.upsertOperationChained(tx, "NUSEXT_UTILITY_TASK_DETAILS", taskDetailsById);

  // If you want to return the updated object:
  // return taskDetailsById;
}

async function initializeNextTask(
  username,
  processInstId,
  taskName,
  taskAssignGroup,
  taskAssignedTo,
  taskAssignedToStaffId,
  nextTaskSequence,
  userInfoDetails,
  tx
) {
  // Get user details
  // const userInfoDetails = await userUtil.getUserDetails(username);

  // Build current month and year in 'yyMM' format
  const now = new Date();
  const reqMonth = String(now.getMonth() + 1).padStart(2, '0'); // JS months are 0-based
  const requestYear = String(now.getFullYear()).slice(-2);
  const taskIdPattern = `T${requestYear}${reqMonth}`;

  // Get sequence number for task instance id
  let taskInstId = await CommonRepo.fetchSequenceNumber(taskIdPattern, 6);

  if (taskInstId.RUNNINGNORESULT) {
    taskInstId = taskInstId.RUNNINGNORESULT
  } else {
    throw new Error('Task sequence generator is not available. Please check the configuration.');
  }


  // Prepare task details object
  const updatedTaskDetails = {};

  updatedTaskDetails.TASK_ASSGN_TO =
    taskAssignedTo && CommonUtils.isNotBlank(taskAssignedTo)
      ? taskAssignedTo
      : ApplicationConstants.ALL;
  updatedTaskDetails.TASK_ASSGN_TO_STF_NUMBER =
    taskAssignedToStaffId && CommonUtils.isNotBlank(taskAssignedToStaffId)
      ? taskAssignedToStaffId
      : ApplicationConstants.ALL;

  updatedTaskDetails.TASK_INST_ID = taskInstId;
  updatedTaskDetails.PROCESS_INST_ID = processInstId;
  updatedTaskDetails.TASK_NAME = taskName;
  updatedTaskDetails.TASK_ASSGN_GRP = taskAssignGroup;
  updatedTaskDetails.TASK_STATUS = ApplicationConstants.STATUS_TASK_ACTIVE;
  updatedTaskDetails.TASK_SEQUENCE = nextTaskSequence;

  // CAP expects JS Date objects for timestamps (in UTC by default)
  updatedTaskDetails.TASK_CREATED_ON = new Date();

  updatedTaskDetails.TASK_CREATED_BY =
    userInfoDetails && userInfoDetails.STF_NUMBER ? userInfoDetails.STF_NUMBER : username;
  updatedTaskDetails.TASK_CREATED_BY_NID =
    userInfoDetails && userInfoDetails.NUSNET_ID ? userInfoDetails.NUSNET_ID : username;

  // Save the new TaskDetails (implement save, insert, or upsert accordingly)
  await CommonRepo.upsertOperationChained(tx, "NUSEXT_UTILITY_TASK_DETAILS", updatedTaskDetails);

  // If you want to return the created object:
  // return updatedTaskDetails;
}

// Assuming you have a logger, constants and utility modules required
// Import necessary utility functions and constants (e.g., isBlank, ApplicationConstants, logger, etc.)

async function validateApprovalTaskInput(taskApproval, userInfoDetails) {
  console.log('InboxServiceImpl validateApprovalTaskInput start()');

  if (!taskApproval) {
    throw new Error('Task Approval Request is not valid.');
  }

  if (CommonUtils.isBlank(taskApproval.TASK_INST_ID)) {
    throw new Error('TaskId is empty');
  }

  if (CommonUtils.isBlank(taskApproval.ACTION_CODE)) {
    throw new Error('Task Action is empty');
  }

  if (CommonUtils.isBlank(taskApproval.REQUEST_ID) ||
    CommonUtils.isBlank(taskApproval.DRAFT_ID)) {
    throw new Error('Request ID is empty');
  }

  // Simulate repository/service call to check request lock
  const userLockDetails = await requestLockCheck(taskApproval.DRAFT_ID);
  if (
    userLockDetails &&
    userInfoDetails &&
    userInfoDetails.STF_NUMBER &&
    CommonUtils.equalsIgnoreCase(userLockDetails.STF_NUMBER) !== CommonUtils.equalsIgnoreCase(userInfoDetails.STF_NUMBER)
  ) {
    throw new Error(
      MessageConstants.MSG_REQUEST_LOCKED +
      userLockDetails.FULL_NM + "(" + userLockDetails.NUSNET_ID + ")"
    );
  }

  if (
    taskApproval.ACTION_CODE &&
    taskApproval.ACTION_CODE.toUpperCase() === (ApplicationConstants.TASK_STATUS_REJECT || "REJECT") &&
    (!taskApproval.REJECT_REMARKS || CommonUtils.isNullOrEmpty(taskApproval.REJECT_REMARKS))
  ) {
    throw new Error('Please provide remarks for Rejection');
  }

  console.log('InboxServiceImpl validateApprovalTaskInput end()');
}
// Assume: 
// - requestLockDetailsRepository.fetchLockedRequestsByDraftId is async and returns an array
// - userInfoUtils.getUserDetails is async and returns user details

async function requestLockCheck(draftId) {
  let fetchRequestLockedUser = null;
  let userLockDetails = null;

  // Get lock details for this draftId (returns an array)
  const requestLockDetails = await RequestLockDetailsRepo.fetchLockedRequestsByDraftId(draftId);

  if (requestLockDetails && Array.isArray(requestLockDetails)) {
    for (const rLock of requestLockDetails) {
      if (rLock.LOCKED_BY_USER_NID && rLock.LOCKED_BY_USER_NID.trim() !== '') {
        fetchRequestLockedUser = rLock.LOCKED_BY_USER_NID;
        // Get user details for the locked user (assuming async)
        userLockDetails = await CommonRepo.fetchUserInfo(fetchRequestLockedUser);
        break;
      }
    }
  }

  return userLockDetails || null;
}


// Assume: 
// - Repositories/functions are async and imported (taskDetailsRepository, CwsDataRepo, userUtil, etc.).
// - ApplicationConstants are defined somewhere.
// - ProcessConfigType is an enum or object mapping codes to types and has a fromValue method.

async function validateTaskDetails(taskApproval, userInfoDetails) {
  // Fetch task details by TASK_INST_ID
  const taskDetailsById = await TaskDetailsRepo.fetchByTaskInstanceId(taskApproval.TASK_INST_ID);

  if (!taskDetailsById || !taskDetailsById.TASK_STATUS || CommonUtils.isNullOrEmpty(taskDetailsById.TASK_STATUS)) {
    throw new Error("No Task details available for the TaskId provided.");
  }

  const actionCode = (taskApproval.ACTION_CODE || '').toUpperCase();

  // If not withdraw or close, do detailed checks
  if (actionCode !== ApplicationConstants.ACTION_WITHDRAW && actionCode !== ApplicationConstants.ACTION_CLOSE) {

    if ((taskDetailsById.TASK_STATUS || '').toUpperCase() === ApplicationConstants.STATUS_TASK_COMPLETED) {
      // Fetch user info for completed by
      userInfoDetails = await CommonRepo.fetchUserInfo(taskDetailsById.TASK_COMPLETED_BY);

      if (!userInfoDetails) {
        throw new Error(
          "This Task has already been completed by an Unknown User, Please contact system administrator for NUSNET ID "
          + taskDetailsById.TASK_COMPLETED_BY_NID);
      }

      throw new Error(
        "This Task has already been completed by " + userInfoDetails.FULL_NM
        + "(" + userInfoDetails.NUSNET_ID + ")"
      );
    }

    // Process type logic
    const pType = ProcessConfigType.fromValue(taskApproval.PROCESS_CODE);

    switch (pType) {
      case 'PTT':
      case 'CW':
      case 'OT':
      case 'HM':
      case 'TB':
        if (CommonUtils.notEqualsIgnoreCase((taskDetailsById.TASK_STATUS || ''), ApplicationConstants.STATUS_TASK_ACTIVE)) {
          throw new Error("This task is not in Active status.");
        }
        break;

      case 'CWS':
      case 'NED':
      case 'OPWN':
        if (
          actionCode === ApplicationConstants.ACTION_APPROVE ||
          actionCode === ApplicationConstants.ACTION_REJECT
        ) {
          // Fetch CWS saved data by DRAFT_ID
          const cwsSavedData = await CwsDataRepo.fetchByUniqueId(taskApproval.DRAFT_ID);

          if (
            cwsSavedData &&
            cwsSavedData.SUBMITTED_BY &&
            cwsSavedData.STAFF_ID
          ) {
            if (
              userInfoDetails.STF_NUMBER &&
              (
                CommonUtils.equalsIgnoreCase(userInfoDetails.STF_NUMBER, cwsSavedData.STAFF_ID) ||
                CommonUtils.equalsIgnoreCase(userInfoDetails.STF_NUMBER, cwsSavedData.SUBMITTED_BY)
              )
            ) {
              throw new Error("You're not authorised to take any action on this request.");
            }
          }
        }

        if (CommonUtils.equalsIgnoreCase(taskDetailsById.TASK_STATUS || ''), ApplicationConstants.STATUS_TASK_CANCELLED) {
          throw new Error("The request is no longer available for review/approval as (task is already completed or staff has retracted it)");
        }

        if (CommonUtils.notEqualsIgnoreCase(taskDetailsById.TASK_STATUS || ''), ApplicationConstants.STATUS_TASK_ACTIVE) {
          throw new Error("This task is not in Active status.");
        }
        break;
      default:
        // No extra check for other types
        break;
    }
  }

  return taskDetailsById;
}


async function retrieveNCheckProcessData(taskInstID) {
  // Fetch process details by Task Instance ID
  const processDetails = await TaskDetailsRepo.fetchProcessDetailsByTaskInstId(taskInstID);

  if (!processDetails || !processDetails.PROCESS_STATUS || CommonUtils.isBlank(processDetails.PROCESS_STATUS)) {
    throw new Error('No Process details available for this Task.');
  }

  return processDetails;
}

async function retrieveEClaimsTaskConfig(taskName, referenceId, processCode, actionCode, requestorGroup, role) {
  // Retrieve Tasks Configuration Details
  const existingTaskConfig = await TaskConfigRepo.fetchCurrentTaskConfig(processCode, requestorGroup, taskName);

  let taskHelperResponse = {};

  let actionConfig = null;
  let nextTaskConfig = null;

  // Handling for Retract Action
  if (CommonUtils.equalsIgnoreCase(actionCode, ApplicationConstants.ACTION_RETRACT)) {
    actionConfig = await TaskActionConfigRepo.fetchTaskConfigValues(
      requestorGroup,
      getTaskNameDuringRetract(role),
      actionCode,
      processCode
    );

    if (actionConfig.TO_BE_TASK_SEQUENCE > -1) {
      nextTaskConfig = await TaskConfigRepo.fetchTasksConfig(
        processCode, requestorGroup, actionConfig.TO_BE_TASK_SEQUENCE
      );
    }

    if (CommonUtils.equalsIgnoreCase(nextTaskConfig.TASK_NAME || ''), ApplicationConstants.CLAIMANT) {
      const staffNusNetId = await EclaimsHeaderDataRepo.fetchStaffId(referenceId);
      const claimUserInfoDetails = await CommonRepo.fetchUserInfo(staffNusNetId);

      if (claimUserInfoDetails && claimUserInfoDetails.STF_NUMBER) {
        taskHelperResponse.taskAssignedTo = claimUserInfoDetails.NUSNET_ID;
        taskHelperResponse.taskAssignedToStaffId = claimUserInfoDetails.STF_NUMBER;
      }
    }
    taskHelperResponse.taskActionConfig = actionConfig;
    taskHelperResponse.nextTaskConfig = nextTaskConfig;

  } else {
    // For All Active Tasks

    const configType = ConfigurationType.fromValue(taskName);

    switch (configType) {
      case ConfigurationType.CLAIMANT:
      case ConfigurationType.APPROVER:
      case ConfigurationType.REPORTING_MGR:
      case ConfigurationType.FINANCE_LEAD:
        actionConfig = await TaskActionConfigRepo.fetchTaskConfigValues(
          requestorGroup, taskName, actionCode, processCode
        );

        if (
          CommonUtils.equalsIgnoreCase(taskName, ApplicationConstants.CLAIMANT) &&
          CommonUtils.equalsIgnoreCase(actionCode, ApplicationConstants.ACTION_SUBMIT) &&
          CommonUtils.equalsIgnoreCase(processCode, ApplicationConstants.CLAIM_TYPE_102)
        ) {
          taskHelperResponse = await getTaskConfigurationForEClaimsByTaskCase(
            referenceId, requestorGroup, processCode, actionCode, taskName, existingTaskConfig
          );
          break;
        }

        if (!actionConfig) {
          throw new Error(
            'No Task Action Configuration available for the current Task. Requestor group-' +
            requestorGroup + ' Task Name - ' + taskName + ' Action-' + actionCode
          );
        }

        if (actionConfig.TO_BE_TASK_SEQUENCE > -1) {
          nextTaskConfig = await TaskConfigRepo.fetchTasksConfig(
            processCode, requestorGroup, actionConfig.TO_BE_TASK_SEQUENCE
          );
        }
        taskHelperResponse.taskAssignedTo = ApplicationConstants.ALL;
        taskHelperResponse.taskAssignedToStaffId = ApplicationConstants.ALL;

        if (
          CommonUtils.equalsIgnoreCase(processCode, ApplicationConstants.CLAIM_TYPE_102) &&
          CommonUtils.equalsIgnoreCase(taskName, ApplicationConstants.REPORTING_MGR) &&
          CommonUtils.equalsIgnoreCase(actionCode, ApplicationConstants.ACTION_REJECT) &&
          CommonUtils.equalsIgnoreCase(requestorGroup, ApplicationConstants.NUS_CHRS_ECLAIMS_ESS)
        ) {
          const staffNusNetId = await EclaimsHeaderDataRepo.fetchStaffId(referenceId);
          const claimUserInfoDetails = await CommonRepo.fetchUserInfo(staffNusNetId);

          if (claimUserInfoDetails && claimUserInfoDetails.STF_NUMBER) {
            taskHelperResponse.taskAssignedTo = claimUserInfoDetails.NUSNET_ID;
            taskHelperResponse.taskAssignedToStaffId = claimUserInfoDetails.STF_NUMBER;
          }
        }
        taskHelperResponse.taskActionConfig = actionConfig;
        taskHelperResponse.nextTaskConfig = nextTaskConfig;
        break;
      default:
        if (
          actionCode.toUpperCase() === ApplicationConstants.ACTION_REJECT ||
          actionCode.toUpperCase() === ApplicationConstants.ACTION_REVERT
        ) {
          actionConfig = await TaskActionConfigRepo.fetchTaskConfigValues(
            requestorGroup, taskName, actionCode, processCode
          );
          if (actionConfig.TO_BE_TASK_SEQUENCE > -1) {
            nextTaskConfig = await TaskConfigRepo.fetchTasksConfig(
              processCode, requestorGroup, actionConfig.TO_BE_TASK_SEQUENCE
            );
          }
          taskHelperResponse.taskActionConfig = actionConfig;
          taskHelperResponse.nextTaskConfig = nextTaskConfig;
        } else {
          // Task Configurations By Existing Task Case
          taskHelperResponse = await getTaskConfigurationForEClaimsByTaskCase(
            referenceId, requestorGroup, processCode, actionCode, taskName, existingTaskConfig
          );
        }
        break;
    }
  }

  if (
    !taskHelperResponse.taskActionConfig ||
    !taskHelperResponse.taskActionConfig.TACTION_ID
  ) {
    throw new Error('Error found : Unable to Identify the next level of Approver');
  }

  return taskHelperResponse;
}

function getTaskNameDuringRetract(role) {
  let retractTaskName = "";
  switch (role) {
    case ApplicationConstants.ESS:
      retractTaskName = ApplicationConstants.CLAIMANT;
      break;
    case ApplicationConstants.CA:
      retractTaskName = ApplicationConstants.CLAIM_ASSISTANT;
      break;
    case ApplicationConstants.CW_ESS:
      retractTaskName = ApplicationConstants.CW_ESS;
      break;
    case ApplicationConstants.CW_DEPTADMIN_GRP:
      retractTaskName = ApplicationConstants.CW_DEPTADMIN_GRP;
      break;
    case ApplicationConstants.CW_PROGRAM_ADMIN:
      retractTaskName = ApplicationConstants.CW_PROGRAM_ADMIN;
      break;
    case ApplicationConstants.CW_OHRSS:
      retractTaskName = ApplicationConstants.CW_OHRSS;
      break;
    default:
      retractTaskName = role;
  }
  return retractTaskName;
}

async function getTaskConfigurationForEClaimsByTaskCase(
  referenceId,
  requestorGroup,
  processCode,
  actionCode,
  taskName,
  existingTaskConfig
) {
  const response = {};

  // Fetch optional tasks
  const optionalTasks = await TaskConfigRepo.fetchOptionalTaskConfigs(
    processCode,
    requestorGroup,
    existingTaskConfig.TASK_SEQUENCE
  );

  const pType = ProcessConfigType.fromValue(processCode);

  let participant;

  switch (pType) {
    case 'PTT':
      response.participantTitle = ApplicationConstants.APPROVER;
      response.taskAssignedTo = ApplicationConstants.ALL;
      response.taskAssignedToStaffId = ApplicationConstants.ALL;

      for (const optionalTaskConfig of optionalTasks) {
        participant = await ProcessParticipantsRepo.fetchByUserDesignation(
          referenceId,
          optionalTaskConfig.TASK_NAME
        );
        if (participant && participant.USER_DESIGNATION && CommonUtils.isNotBlank(participant.USER_DESIGNATION)) {
          response.participantTitle = participant.USER_DESIGNATION;
          response.taskAssignedTo = participant.NUSNET_ID;
          response.taskAssignedToStaffId = participant.STF_NUMBER;
          break;
        }
      }
      break;

    case 'TB':
      response.participantTitle = ApplicationConstants.FINANCE_LEAD;
      response.taskAssignedTo = ApplicationConstants.ALL;
      response.taskAssignedToStaffId = ApplicationConstants.ALL;

      for (const optionalTaskConfig of optionalTasks) {
        participant = await ProcessParticipantsRepo.fetchByUserDesignation(
          referenceId,
          optionalTaskConfig.TASK_NAME
        );
        if (participant && participant.USER_DESIGNATION && CommonUtils.isNotBlank(participant.USER_DESIGNATION)) {
          response.participantTitle = participant.USER_DESIGNATION;
          response.taskAssignedTo = participant.NUSNET_ID;
          response.taskAssignedToStaffId = participant.STF_NUMBER;
          break;
        }
      }
      break;

    case 'CW':
    case 'OT':
    case 'HM':
      response.participantTitle = ApplicationConstants.REPORTING_MGR;
      const staffNusNetId = await EclaimsHeaderDataRepo.fetchStaffId(referenceId);
      const claimantUserInfoDetails = await CommonRepo.fetchUserInfo(staffNusNetId);
      if (claimantUserInfoDetails && claimantUserInfoDetails.RM_STF_N) {
        const taskUserDetailsDto = await CommonRepo.fetchUserInfo(claimantUserInfoDetails.RM_STF_N);
        if (taskUserDetailsDto && taskUserDetailsDto.STF_NUMBER && CommonUtils.isNotBlank(taskUserDetailsDto.STF_NUMBER)) {
          response.taskAssignedTo = taskUserDetailsDto.NUSNET_ID;
          response.taskAssignedToStaffId = taskUserDetailsDto.STF_NUMBER;
        }
      }

      for (const optionalTaskConfig of optionalTasks) {
        participant = await ProcessParticipantsRepo.fetchByUserDesignation(
          referenceId,
          optionalTaskConfig.TASK_NAME
        );
        if (participant && participant.USER_DESIGNATION && participant.USER_DESIGNATION.trim() !== '') {
          response.participantTitle = participant.USER_DESIGNATION;
          response.taskAssignedTo = participant.NUSNET_ID;
          response.taskAssignedToStaffId = participant.STF_NUMBER;
          break;
        } else if (
          optionalTaskConfig.TASK_NAME &&
          CommonUtils.equalsIgnoreCase(optionalTaskConfig.TASK_NAME, ApplicationConstants.VERIFIER)
        ) {
          response.participantTitle = optionalTaskConfig.TASK_NAME;
          response.taskAssignedTo = ApplicationConstants.ALL;
          response.taskAssignedToStaffId = ApplicationConstants.ALL;
          break;
        }
      }
      break;

    default:
      // Do nothing for default
      break;
  }

  // Fetch the Next Task Config
  response.nextTaskConfig = await TaskConfigRepo.fetchCurrentTaskConfig(
    processCode,
    requestorGroup,
    response.participantTitle
  );

  // Fetch the Current Task Action Config
  response.taskActionConfig = await TaskActionConfigRepo.fetchTaskActionConfigValuesByActionCodeNNextTask(
    requestorGroup,
    taskName,
    actionCode,
    response.nextTaskConfig.TASK_SEQUENCE,
    processCode,
    ApplicationConstants.NEW_SUBMISSION_TYPE
  );

  return response;
}


module.exports = { massTaskAction };
