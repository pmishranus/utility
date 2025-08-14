# utility
Utility Module 


# 1. Bind the service with xsuaa command :
- cds compile srv/ --to xsuaa > xs-security.json

# 2. CDS deploy to hana
- cds deploy --to hana:utility-db

# 3. MTAR build
- mbt build -t gen --mtar archive

# 4. MATR deploy
- cf deploy gen/archive.mtar;

# 5. CDS bind services
- cds bind -2 <servicename>

# 6. Running app router and node js api together
- cds bind --exec npm run approuter

# 7. Proxy entity for the calculation view
hana-cli inspectView -o cds  //this will give option to write the exact name of the database view
- hana-cli inspectView -v APPROVAL_MATRIX_UTIL -o cds
- hana-cli inspectView -v ECLAIM_REQUEST_VIEW -o cds
- hana-cli inspectView -v OT_VERIFIER_APPROVER_LIST -o cds
- hana-cli inspectFunction -f CHECK_COST_DIST_EXIST_F -o
- hana-cli inspectView -v CHRS_JOB_INFO -o cds
- hana-cli inspectView -v TASK_ACTION_CONFIG -o cds


# 8. Get the active port
- C

mbt module-build -m eclaims-srv -g

# 9. Kill the process id
-  kill -9 22447


// {
//   "authenticationMethod": "route",
//   "logout": {
//     "logoutEndpoint": "/app-logout",
//     "logoutPage": "/"
//   },
//   "routes": [
//     {
//       "source": "^/app/(.*)$",
//       "target": "$1",
//       "localDir": ".",
//       "cacheControl": "no-cache, no-store, must-revalidate",
//       "authenticationType": "xsuaa"
//     },
//     {
//       "source": "^/user-api(.*)",
//       "target": "$1",
//       "service": "sap-approuter-userapi"
//     },
//     {
//       "source": "^/pankaj/(.*)$",
//       "target": "$1",
//       "destination": "srv-api",
//       "csrfProtection": false,
//       "authenticationType": "xsuaa"
//     }
//   ]
// }

# 10. How to access services : 
##### Eclaims : https://national-university-of-singapore-nus-ariba-dev-px55m7l55b18a041.cfapps.eu10-004.hana.ondemand.com/eclaims/v2/eclaims/eclaims/eclaimsOverviewDashboard

##### Util : https://national-university-of-singapore-nus-ariba-dev-px55m7l55b18a041.cfapps.eu10-004.hana.ondemand.com/v2/catalog/eclaims_data
