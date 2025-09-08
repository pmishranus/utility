const cds = require("@sap/cds");
const taskActionsCtrl = require("./controller/taskActions.controller")
const TaskDetailsRepo = require("./repository/taskDetails.repo");
const EclaimsDataRepo = require('./repository/eclaimsData.repo');
const CwsDataRepo = require('./repository/cwsData.repo');
const CommonRepo = require('./repository/util.repo');
const TasksConfigRepo = require('./repository/tasksConfig.repo');
const { fromValue } = require('./enum/processConfigType');
const { ApplicationConstants } = require('./util/constant');
const nodemailer = require('nodemailer');
const { retrieveJwt, getDestination } = require('@sap-cloud-sdk/connectivity'); // 
const axios = require('axios');
const qs = require('qs');
class InboxService extends cds.ApplicationService {
  init() {
    this.on('taskactions', req => {
      let systemUserName = null; // this parameter is used for ECP_SYSTEM during retract
      return taskActionsCtrl.massTaskAction(req, systemUserName, null);
    }),

      this.on('echo', async (req) => {
        // Simple echo for connectivity testing
        req.data.data.Pankaj = {
          "name": "Pankaj",
          "id": req.user.id
        }
        return req.data && req.data.data ? req.data.data : req.data;
      }),

      this.on('fetchTasksByProcessInstId', async (req) => {
        try {
          const { processInstId } = req.data;

          if (!processInstId) {
            return {
              taskHistoryList: [],
              changeHistoryMap: {},
              requestMap: {},
              isError: true,
              message: "Process Inst Id is null/empty",
              statusCode: "ERROR"
            };
          }

          const taskDetails = await TaskDetailsRepo.fetchByProcessInstId(processInstId);

          return {
            taskHistoryList: taskDetails,
            changeHistoryMap: {},
            requestMap: {},
            isError: false,
            message: "Task details fetched successfully",
            statusCode: "SUCCESS"
          };
        } catch (error) {
          console.error('Error in fetchTasksByProcessInstId:', error);
          return {
            taskHistoryList: [],
            changeHistoryMap: {},
            requestMap: {},
            isError: true,
            message: error.message || "Generic Exception",
            statusCode: "ERROR"
          };
        }
      }),

      this.on('getProcessTrackerDetails', async (req) => {
        try {
          const { draftId, processCode } = req.data;

          if (!draftId || !processCode) {
            return {
              taskHistoryList: [],
              changeHistoryMap: "{}",
              requestMap: "{}",
              isError: true,
              message: "draftId/processCode is empty",
              statusCode: "ERROR"
            };
          }

          // Retrieve Existing Task Details
          const existingTaskDetailList = await TaskDetailsRepo.fetchByReferenceId(draftId);
          let taskDetailsHistoryList = [];
          let requestData = null;

          const pType = fromValue(processCode);
          switch (pType) {
            case 'PTT':
            case 'CW':
            case 'OT':
            case 'HM':
            case 'TB':
              requestData = await amendEClaimRequestData(draftId);
              taskDetailsHistoryList = await frameExistingTasksData(draftId, requestData.REQUESTOR_GRP,
                requestData.PROCESS_CODE, requestData.TASK_POSITION, requestData.STAFF_ID,
                existingTaskDetailList, requestData);
              taskDetailsHistoryList.unshift(requestData);
              break;
            case 'CWS':
            case 'NED':
              requestData = await amendCwsRequestData(draftId);
              taskDetailsHistoryList = await frameExistingTasksData(draftId, requestData.REQUESTOR_GRP,
                requestData.PROCESS_CODE, requestData.TASK_POSITION, requestData.STAFF_ID,
                existingTaskDetailList, requestData);
              taskDetailsHistoryList.unshift(requestData);
              break;
            case 'OPWN':
              requestData = await amendCwsRequestData(draftId);
              taskDetailsHistoryList = await frameExistingTasksData(draftId, requestData.REQUESTOR_GRP,
                requestData.PROCESS_CODE, requestData.TASK_POSITION, requestData.TASK_USER_STAFF_ID,
                existingTaskDetailList, requestData);
              taskDetailsHistoryList.unshift(requestData);
              break;
            default:
              break;
          }

          return {
            taskHistoryList: taskDetailsHistoryList,
            changeHistoryMap: "{}",
            requestMap: "{}",
            isError: false,
            message: "The Task history Details are retrieved successfully",
            statusCode: "SUCCESS"
          };
        } catch (error) {
          console.error('Error in getProcessTrackerDetails:', error);
          return {
            taskHistoryList: [],
            changeHistoryMap: "{}",
            requestMap: "{}",
            isError: true,
            message: error.message || "Generic Exception",
            statusCode: "ERROR"
          };
        }
      }),

      this.on('sendEmail', async (req) => {
        const { emailSubject, emailContent, mailMap, setPriority } = req.data.data;

        // === 1. Get Destination from BTP Destination Service ===
        const destinationName = 'BTP_EMAIL_OAUTH';
        let destination;
        try {
          // If running on BTP, pass req headers to get user JWT for principal propagation.
          const userJwt = retrieveJwt(req);
          destination = await getDestination({ destinationName, jwt: userJwt });
          if (!destination) throw new Error('Destination not found.');
        } catch (err) {
          return `Error fetching destination: ${err.message}`;
        }

        // === 2. (Optional) Fetch OAuth2 Token ===
        // If your destination is set up for OAuth2 SAML Bearer, SAP Cloud SDK can fetch a token for you;
        // for client credential flows, you may need to get it yourself with client id/secret.
        let accessToken = null;
        // ... fetch logic here (use destination.authTokens[0].value if provided) ...
        if (destination.authTokens && destination.authTokens.length) {
          accessToken = destination.authTokens[0].value;
        } else {
          return 'No OAuth2 token found in destination. Please check your destination/service binding.';
        }


        //handling refresh token

        let oDestinationConfiguration = destination.originalProperties.destinationConfiguration;

        const data = {
          client_id: oDestinationConfiguration.clientId,
          grant_type: 'refresh_token',
          refresh_token: '1.AVQAXu-lWwkxd06Fvc_rDTR-gkRWDqXjWitPsiUvftZYfWhUAPdUAA.AgABAwEAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P8NqSTlxiEfVD4fAi2iTso9w3Cw5rtUnLrx5yWCqiu6msEdc4pEaP743tKgTpMyaRBhHr4p1drCCFy1dkZPGuAsAdgqRM9YJvf6B-U0g2XkUoc7F5yNlr1H5Hcg1p9YVpmrFRLQnjbqSIHzqfK74TBgIplxu96ZrWr2GUQ0MRxFSyOcgm9aoWf5DvhMcYSM2BEQ9Qhm2BygC66FXpWM2E8PozwvJXVz35uzrKF-4Q7mZ_ps6d7nCFsjE4XqH6gteacvQX3H-z1VOuv41dwpWihGxf_aa-EjbF92Wvs3e1rY1ZBvYzL8hRqSodOrS9fjlzKbov-42EPV2ie4gUdl2YG6E6iQPARBeDVoleS48HLVWCRQOHr73_8YzQx8ASvepny0Yo0jbIOfCQL7kXeqVnyP4SAGSOD6xZSMkcKzWR6mSUV2EDgqjPbQLe1nYJXxTaEx-g_cK_bk5kJ2hpON3Ql900TCTzn-CakbCFGpDTHmeTOt9bJtOprcKyM2st80FG4hTES92qf0qmZ-2OzIpYOGnCA77LGyqIVXd2nxSIzPRx-0OTeg-mPAH9Rjn24huryDykZh4Nc74OaSNZt_QXtBOwNZOEzEhso_EcaLkqENnKsXWFR8wkUNk8nMwALeNhFQMRJDBqo4f7ThxBVlBC9yMaV31pou9VivLVb6xPRb0uLcxd4vF9onhiWodS_WmA5rYrnrA_fC8feDKU7suv5f5QA72o43n53ZtLctNNKg45QkenDTp-U3gVwQBkZ3icf8JnEnHXtD2M3qj6GlyxKBeyjIGFMj1VlUn7wiNS_rwTNbLz1n3Cy-7ppKh1wsg1XtNB_LAAEzHyATDGF2i6o4',
          client_secret: oDestinationConfiguration.clientSecret,
        };


        const accessTokenResponse = await axios.post(oDestinationConfiguration.tokenServiceURL, qs.stringify(data), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        let accessTokenGen = accessTokenResponse.data;




        // === 3. Send Mail Using Nodemailer and XOAUTH2 ===
        let transporter = nodemailer.createTransport({
          host: oDestinationConfiguration["mail.smtp.host"],
          port: oDestinationConfiguration["mail.smtp.port"],
          secure: false, // usually true for port 465, false for 587
          auth: {
            type: 'OAuth2',
            user: oDestinationConfiguration["mail.username"],       // fetched from destination
            accessToken: accessTokenGen.access_token,         // fetched above
          },
          tls: {
            ciphers: 'TLSv1.2'
          }
        });

        let mailOptions = {
          from: oDestinationConfiguration["mail.smtp.from"],
          to: mailMap.to,
          subject: emailSubject,
          html: emailContent,
        };
        if (mailMap.cc) {
          mailOptions.cc = mailMap.cc;
        }
        if (setPriority) {
          mailOptions.headers = { 'X-Priority': '1' };
        }

        try {
          let emailResponse = await transporter.sendMail(mailOptions);
          return emailResponse;
        } catch (error) {
          return "Error sending email: " + error.message;
        }
      });
    return super.init()
  }

  // Helper function to amend EClaims request data
  async amendEClaimRequestData(draftId) {
    const requestData = {};

    try {
      const eClaimData = await EclaimsDataRepo.fetchHeaderByDraftId(draftId);
      if (!eClaimData || !eClaimData.DRAFT_ID) {
        requestData.MESSAGE = "No Data exists for this EClaim Request";
        return requestData;
      }

      const taskPosition = 1;

      requestData.TASK_NAME = eClaimData.REQUESTOR_GRP === ApplicationConstants.NUS_CHRS_ECLAIMS_ESS ? "CLAIMANT" : "CLAIM_ASSISTANT";
      requestData.TASK_ACTUAL_DOC = eClaimData.CREATED_ON;

      // Retrieve the submission time from the first Task Created On
      const taskCreatedOnList = await TaskDetailsRepo.fetchTaskCreatedOnList(draftId);
      if (taskCreatedOnList && taskCreatedOnList.length > 0) {
        requestData.TASK_ACTUAL_DOC = taskCreatedOnList[0];
      }

      requestData.TASK_COMPLETED_BY = eClaimData.SUBMITTED_BY;
      requestData.TASK_COMPLETED_BY_NID = eClaimData.SUBMITTED_BY_NID;

      // Get user details
      const userInfoDetails = await CommonRepo.fetchUserInfo(eClaimData.SUBMITTED_BY);

      requestData.TASK_USER_NID = eClaimData.SUBMITTED_BY_NID;
      requestData.TASK_USER_STAFF_ID = eClaimData.SUBMITTED_BY;
      requestData.TASK_USER_FULLNAME = userInfoDetails ? userInfoDetails.FULL_NM : "";

      // Get task alias name
      const taskNameAliasList = await TasksConfigRepo.fetchTaskAliasName(eClaimData.CLAIM_TYPE, eClaimData.REQUESTOR_GRP, requestData.TASK_NAME);
      requestData.TASK_ALIAS_NAME = (taskNameAliasList && taskNameAliasList.length > 0) ? taskNameAliasList[0] : "";

      requestData.TASK_ICON_TYPE = "sap-icon://time-overtime";
      requestData.ACTION_CODE = "SUBMIT";
      requestData.TASK_ASSGN_GRP = eClaimData.REQUESTOR_GRP;
      requestData.TASK_POSITION = taskPosition;
      requestData.TASK_SEQUENCE = taskPosition - 1;
      requestData.TASK_STATUS = ApplicationConstants.STATUS_TASK_COMPLETED;

      requestData.REQUESTOR_GRP = eClaimData.REQUESTOR_GRP;
      requestData.PROCESS_CODE = eClaimData.CLAIM_TYPE;
      requestData.STAFF_ID = eClaimData.STAFF_ID;

      // Additional fields for response
      requestData.SUBMISSION_TYPE = eClaimData.SUBMISSION_TYPE;
      requestData.SUBMISSION_TYPE_ALIAS = eClaimData.SUBMISSION_TYPE;
      requestData.SUBMITTED_ON_TS = eClaimData.SUBMITTED_ON_TS;
      requestData.REQ_STATUS = eClaimData.REQUEST_STATUS;
      requestData.REQ_STATUS_ALIAS = eClaimData.REQUEST_STATUS;
      requestData.REQUEST_ID = eClaimData.REQUEST_ID;

    } catch (error) {
      console.error('Error in amendEClaimRequestData:', error);
      requestData.MESSAGE = "Error in Task User Information Retrieval: " + error.message;
      requestData.TASK_USER_FULLNAME = ApplicationConstants.NO_USER_INFO;
    }

    return requestData;
  }

  // Helper function to amend CWS request data
  async amendCwsRequestData(reqUniqueId) {
    const requestData = {};

    try {
      const cwsData = await CwsDataRepo.fetchHeaderByUniqueId(reqUniqueId);
      if (!cwsData || !cwsData.REQ_UNIQUE_ID) {
        requestData.MESSAGE = "No Data exists for this CW Request";
        return requestData;
      }

      const taskPosition = 1;

      requestData.TASK_NAME = cwsData.REQUESTOR_GRP;
      requestData.TASK_ACTUAL_DOC = cwsData.SUBMITTED_ON_TS;

      // Retrieve the submission time from the first Task Created On
      const taskCreatedOnList = await TaskDetailsRepo.fetchTaskCreatedOnList(reqUniqueId);
      if (taskCreatedOnList && taskCreatedOnList.length > 0) {
        requestData.TASK_ACTUAL_DOC = taskCreatedOnList[0];
      }

      requestData.TASK_COMPLETED_BY = cwsData.SUBMITTED_BY;
      requestData.TASK_COMPLETED_BY_NID = cwsData.SUBMITTED_BY_NID;
      requestData.STAFF_ID = cwsData.STAFF_ID;

      // Get task alias name
      const taskNameAliasList = await TasksConfigRepo.fetchTaskAliasName(cwsData.PROCESS_CODE, cwsData.REQUESTOR_GRP, requestData.TASK_NAME);
      requestData.TASK_ALIAS_NAME = (taskNameAliasList && taskNameAliasList.length > 0) ? taskNameAliasList[0] : "";

      requestData.TASK_ICON_TYPE = "sap-icon://per-diem";
      requestData.ACTION_CODE = ApplicationConstants.ACTION_SUBMIT;
      requestData.TASK_ASSGN_GRP = cwsData.REQUESTOR_GRP;
      requestData.TASK_POSITION = taskPosition;
      requestData.TASK_SEQUENCE = taskPosition - 1;
      requestData.TASK_STATUS = ApplicationConstants.STATUS_TASK_COMPLETED;

      requestData.REQUESTOR_GRP = cwsData.REQUESTOR_GRP;
      requestData.PROCESS_CODE = cwsData.PROCESS_CODE;
      requestData.TASK_USER_STAFF_ID = cwsData.STAFF_ID;

      // Additional fields for response
      requestData.SUBMISSION_TYPE = cwsData.SUBMISSION_TYPE;
      requestData.SUBMISSION_TYPE_ALIAS = cwsData.SUBMISSION_TYPE;
      requestData.SUBMITTED_ON_TS = cwsData.SUBMITTED_ON_TS;
      requestData.REQ_STATUS = cwsData.REQUEST_STATUS;
      requestData.REQ_STATUS_ALIAS = cwsData.REQUEST_STATUS;
      requestData.REQUEST_ID = cwsData.REQUEST_ID;

    } catch (error) {
      console.error('Error in amendCwsRequestData:', error);
      requestData.MESSAGE = "Error in CW Request Data Retrieval: " + error.message;
    }

    return requestData;
  }

  // Helper function to frame existing tasks data
  async frameExistingTasksData(referenceId, requestorGroup, processCode, taskPosition, staffId, existingTaskDetailList, requestData) {
    const taskDetailsHistoryList = [];

    try {
      // Current Task List from TaskDetails
      for (const tDetailDto of existingTaskDetailList) {
        // Get task alias name
        const taskNameAliasList = await TasksConfigRepo.fetchTaskAliasName(processCode, requestorGroup, tDetailDto.TASK_NAME);
        tDetailDto.TASK_ALIAS_NAME = (taskNameAliasList && taskNameAliasList.length > 0) ? taskNameAliasList[0] : "";

        // Set submission type for CWS processes
        let submissionType = "";
        if (['OPWN', 'CWS', 'NED'].includes(processCode)) {
          submissionType = await CwsDataRepo.fetchSubmissionType(requestorGroup);
        }

        // Set completed by full name
        tDetailDto.COMPLETED_BY_FULL_NAME = "";

        taskDetailsHistoryList.push(tDetailDto);
      }
    } catch (error) {
      console.error('Error in frameExistingTasksData:', error);
    }

    return taskDetailsHistoryList;
  }
}
module.exports = InboxService;