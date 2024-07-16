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
