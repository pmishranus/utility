/**
 * Implementation for DataMigrationService defined in ./migration-service.cds
 */
const cds = require("@sap/cds");
const axios = require("axios");
const hanaDbHost =
  process.env.hanaDbHost ||
  "https://nusbtpqahanaduxmssmjjx.ap1.hana.ondemand.com";
const hanaDbUser = process.env.hanaDbUser || "BTPAPP_QA_ADMIN";
const hanaDbPwd = process.env.hanaDbPwd || "NusBtpAppqa!55w0rd";
// const {
//     getDefaultSystem
// } = require("./../srv/utils/utils")
/**
 * Hooks for srv application
 * @module srv
 */
// module.exports = (srv) => {
//   srv.on("loadTableData", async (req,res) => {
//     try {
//       const { Tablename } = req.data;
//       let oPayload = {};
//       if (!Tablename) {
//         const error = new Error("Please provide Tablename parameter..!!");
//         error.code = 400;
//         error.statusCode = 400;
//         throw error;
//       } else {
//         switch (Tablename) {
//           case "ECLAIMS_DATA":
//             oPayload = {
//               SCHEMA: "NUS_BTP_APPNS",
//               TABLE: "eclaims::Tables.ECLAIMS_DATA",
//             };
//             break;
//         }
//       }
//       let oReturnObj = {};

//       //call api
//       const relativePath = "/eclaims/services/migration.xsjs?cmd=fetchData";
//       const url = hanaDbHost + relativePath;
//       const username = hanaDbUser;
//       const password = hanaDbPwd;
//       const auth = Buffer.from(`${username}:${password}`).toString("base64");
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Basic ${auth}`,
//         },
//       };
//       //   const response = await axios.post(url, {
//       //     data: oPayload,
//       //     auth: {
//       //       username,
//       //       password,
//       //     },
//       //   });
//       //   oReturnObj.data = response.data;
//       axios
//         .post(url, oPayload, config)
//         .then((response) => {
//           console.log("Response:", response.data);
//           oReturnObj.data = response.data;
//           //sending the reply for the api
//         //   req.reply(oReturnObj);
//         res.status(response.status).json(response.data);
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//         });
//     } catch (err) {
//       console.log(err);
//       req.error({
//         code: err.code,
//         message: err.message,
//         // target: 'some_field',
//         status: err.statusCode || 500,
//       });
//     }
//   });
// };


module.exports = (srv) => {
    srv.on("loadTableData", async (req) => {
      try {
        const { Tablename } = req.data;
        let oPayload = {};
  
        if (!Tablename) {
          const error = new Error("Please provide Tablename parameter..!!");
          error.code = 400;
          error.statusCode = 400;
          throw error;
        } else {
          switch (Tablename) {
            case "ECLAIMS_DATA":
              oPayload = {
                SCHEMA: "NUS_BTP_APPNS",
                TABLE: "eclaims::Tables.ECLAIMS_DATA",
              };
              break;
            default:
              const error = new Error("Invalid Tablename provided.");
              error.code = 400;
              error.statusCode = 400;
              throw error;
          }
        }
  
        const relativePath = "/eclaims/services/migration.xsjs?cmd=fetchData";
        const url = hanaDbHost + relativePath;
        const username = hanaDbUser;
        const password = hanaDbPwd;
        const auth = Buffer.from(`${username}:${password}`).toString("base64");
        const config = {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${auth}`,
          },
        };
  
        // Call the external API using axios
        const response = await axios.post(url, oPayload, config);
  
        // Send the response data back to the client
        return response.data;
  
      } catch (err) {
        console.error("Error:", err);
        req.error({
          code: err.code,
          message: err.message,
          status: err.statusCode || 500,
        });
      }
    });
  };