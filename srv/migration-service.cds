@protocol       : 'rest'
@cds.query.limit: {default: 1000}

service MigrationService {
    /* 
        Enhancement : All the data loading from any third party api will be added over here
        Author : Pankaj
        Relative path will be added in an incremental way.
        1. /rest/migration/loadTableData(Tablename='CHRS_JOB_INFO')
    */
    @open
    type object {};
    
    function loadTableData(Tablename : String) returns object;

    // function loadEmployeeData() returns object;
}