
const cds = require("@sap/cds");
const approverMatrixImpl = require("./impl/approver-matrix")
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');

// Configure Multer for in-memory file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


module.exports = cds.service.impl(async (srv) => {
  const db = await cds.connect.to("db");
  const app = cds.app;

  srv.on("createEntry", async (request) => {
    return await approverMatrixImpl.createConfigEntry(request, db, srv);
  });

  srv.on("deleteEntry", async (request) => {
    return await approverMatrixImpl.deleteMatrixReqEntry(request, db, srv);
  });


  // srv.on("matrixReqUpload", async (request) => {
  //   return await approverMatrixImpl.createMatrixReqUploadEntry(request, db, srv);
  // });


  app.post('/approvermatrix/matrixReqUpload', upload.single('matrixFile'), async (req, res, next) => {
    const file = req.file;
    const { requestorGrp, ulu, fdlu, processCode, noOfHeaderRows } = req.body;
let oOutputResp = {};
    if (!file) {
      return res.status(400).json({ error: 'Please upload an excel file!' });
    }

    if (!hasExcelFormat(file)) {
      return res.status(400).json({ error: 'Invalid file format. Please upload an Excel file!' });
    }

    try {
      const jsonData = await parseExcelToJson(file.buffer,noOfHeaderRows);

      // const jsonData = [{
      //   "ULU": "ALL",
      //   "FDLU": "ALL",
      //   "Staff ID": 67359,
      //   "Designation": "OFN Admin",
      //   "Valid From": "01.09.2023",
      //   "Valid To": "15.12.2025"
      // },
      // {
      //   "ULU": "ALL",
      //   "FDLU": "ALL",
      //   "Staff ID": 72667,
      //   "Designation": "OFN Admin",
      //   "Valid From": "01.09.2023",
      //   "Valid To": "15.12.2025"
      // },
      // {
      //   "ULU": "ALL",
      //   "FDLU": "ALL",
      //   "Staff ID": 73840,
      //   "Designation": "OFN Admin",
      //   "Valid From": "01.09.2023",
      //   "Valid To": "15.12.2025"
      // },
      // {
      //   "ULU": "ALL",
      //   "FDLU": "ALL",
      //   "Staff ID": 56349,
      //   "Designation": "OFN Admin",
      //   "Valid From": "01.09.2023",
      //   "Valid To": "15.12.2025"
      // }]

      let message = "";

      if (jsonData.length >= 0) {
        oOutputResp.message = "Uploading the Matrix File successfully..!!" + file.originalname;
        oOutputResp.error = false
        oOutputResp.response = await approverMatrixImpl.uploadExcelForApproverMatrix(req, jsonData, requestorGrp, processCode, ulu,
          fdlu, noOfHeaderRows);
      }
      res.status(200).json(oOutputResp);
    } catch (error) {
      next(error);
    }
  });

  function hasExcelFormat(file) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    return fileExtension === '.xlsx' || fileExtension === '.xls';
  }

  async function parseExcelToJson(fileBuffer, noOfHeaderRows) {
    try {
      // Read the workbook from the buffer
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

      // Extract data from the first sheet
      const sheetNames = workbook.SheetNames;
      const sheet = workbook.Sheets[sheetNames[0]];

      // Convert sheet to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Skip the specified number of header rows
      const data = jsonData.slice(noOfHeaderRows - 1);

      return data;
    } catch (error) {
      throw new Error('Error parsing Excel file: ' + error.message);
    }
  }


});
