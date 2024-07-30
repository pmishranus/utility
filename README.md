# utility
Utility Module 


# 1. Bind the service with xsuaa command :
- cds compile srv/ --to xsuaa > xs-security.json

# 2. CDS deploy to hana
- cds deploy --to hana:utility-db

# 3. MTAR build
- mbt build

# 4. MATR deploy
- cf deploy mta_archives/utility_1.0.0.mtar;

# 5. CDS bind services
- cds bind -2 <servicename>

# 6. Running app router and node js api together
- cds bind --exec npm run approuter

# 7. Proxy entity for the calculation view
- hana-cli inspectView -v APPROVAL_MATRIX -o cds

# 8. Get the active port
- C

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
