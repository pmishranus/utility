# Migration Service Enhancement

## Overview

The migration service has been enhanced to support bulk table data loading operations. This enhancement addresses the pain point of processing tables one by one by introducing a new Action that can handle multiple tables in a single request.

## New Feature: `loadMultipleTableData` Action

### What's New

- **Action-based approach**: Uses CAP Actions instead of Functions for better handling of complex operations
- **Bulk processing**: Process multiple tables in a single API call
- **Parallel execution**: Tables are processed concurrently for better performance
- **Delete-and-recreate functionality**: Completely removes existing data and recreates it with fresh data from external sources
- **Comprehensive error handling**: Individual table failures don't stop the entire process
- **Detailed reporting**: Get detailed results for each table including success/failure status

### Benefits

1. **Reduced API calls**: Instead of making multiple individual calls, you can process all tables in one request
2. **Better performance**: Parallel processing reduces total execution time
3. **Fresh data guarantee**: Complete data refresh ensures no stale or orphaned records remain
4. **Error isolation**: If one table fails, others continue processing
5. **Comprehensive logging**: Detailed error messages and success tracking for each table
6. **Backward compatibility**: Original `loadTableData` function remains unchanged

## API Usage

### Endpoint

```
POST /rest/migration/loadMultipleTableData
```

### Request Format

```json
{
  "tableNames": [
    "ECLAIMS_DATA",
    "ECLAIMS_ITEMS_DATA",
    "CHRS_JOB_INFO",
    "APP_CONFIGS"
  ]
}
```

### Response Format

```json
{
  "success": true,
  "totalTables": 4,
  "processedTables": 4,
  "failedTables": 0,
  "summary": "Processed 4 tables. 4 successful, 0 failed.",
  "results": [
    {
      "tableName": "ECLAIMS_DATA",
      "success": true,
      "message": "Successfully processed table: ECLAIMS_DATA (deleted and recreated)",
      "result": {
        "result": {
          "deletedRecords": 150,
          "insertedRecords": 200,
          "operation": "delete_and_recreate",
          "tableName": "ECLAIMS_DATA"
        }
      },
      "error": null
    },
    {
      "tableName": "INVALID_TABLE",
      "success": false,
      "message": "Failed to process table: INVALID_TABLE",
      "result": null,
      "error": "Invalid Tablename provided."
    }
  ]
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean | Overall success status (true if all tables processed successfully) |
| `totalTables` | Integer | Total number of tables in the request |
| `processedTables` | Integer | Number of tables processed successfully |
| `failedTables` | Integer | Number of tables that failed to process |
| `summary` | String | Human-readable summary of the operation |
| `results` | Array | Detailed results for each table |

### Individual Table Result Fields

| Field | Type | Description |
|-------|------|-------------|
| `tableName` | String | Name of the table that was processed |
| `success` | Boolean | Whether this specific table was processed successfully |
| `message` | String | Human-readable message about the table processing |
| `result` | Object | The actual result data (null if failed) |
| `error` | String | Error message if the table failed (null if successful) |

## Error Handling

### Request Validation Errors

- **Empty array**: Returns 400 error if `tableNames` is empty or not provided
- **Invalid format**: Returns 400 error if `tableNames` is not an array

### Individual Table Errors

- **Invalid table names**: Tables with invalid names will fail individually but won't stop other tables
- **Network errors**: Connection issues are captured per table
- **Credential errors**: Authentication failures are logged per table
- **Data processing errors**: Any errors during data processing are captured
- **Delete operation errors**: If deletion fails, the operation stops for that table to prevent data inconsistency

## Example Usage

### JavaScript/Node.js

```javascript
const response = await fetch('/rest/migration/loadMultipleTableData', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify({
    tableNames: ['ECLAIMS_DATA', 'CHRS_JOB_INFO', 'APP_CONFIGS']
  })
});

const result = await response.json();
console.log(`Processed ${result.processedTables} out of ${result.totalTables} tables`);
console.log(`Failed: ${result.failedTables} tables`);

// Check individual results
result.results.forEach(tableResult => {
  if (tableResult.success) {
    console.log(`✅ ${tableResult.tableName}: ${tableResult.message}`);
  } else {
    console.log(`❌ ${tableResult.tableName}: ${tableResult.error}`);
  }
});
```

### cURL

```bash
curl -X POST \
  http://localhost:4004/rest/migration/loadMultipleTableData \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -d '{
    "tableNames": ["ECLAIMS_DATA", "CHRS_JOB_INFO", "APP_CONFIGS"]
  }'
```

## Testing

Use the provided test cases in `testclient/Migration.http`:

1. **Valid multiple tables**: Tests processing of valid table names
2. **Mixed valid/invalid**: Tests error handling with some invalid table names
3. **Empty array**: Tests validation of empty input

## Delete-and-Recreate Functionality

### How It Works

The new `loadMultipleTableData` action implements a **delete-and-recreate** strategy for data migration:

1. **Fetch Fresh Data**: Retrieves the latest data from external HANA DB sources
2. **Delete Existing Data**: Completely removes all existing records from the target table
3. **Insert New Data**: Inserts all fresh data from the external source
4. **Return Results**: Provides detailed information about deleted and inserted record counts

### Benefits of Delete-and-Recreate

- **Data Consistency**: Ensures no orphaned or stale records remain
- **Complete Refresh**: Guarantees that the target table contains only the most current data
- **Simplified Logic**: Eliminates complex delta calculations and update logic
- **Audit Trail**: Clear record of what was deleted and what was inserted

### When to Use

- **Scheduled Data Refresh**: Regular synchronization of master data
- **Complete Data Overhaul**: When you need to completely refresh table contents
- **Data Cleanup**: Removing accumulated stale or duplicate records
- **System Migration**: Moving data between environments

## Backward Compatibility

The original `loadTableData` function remains unchanged and fully functional. Existing integrations will continue to work without any modifications.

## Performance Considerations

- Tables are processed in parallel for optimal performance
- Delete-and-recreate operations may take longer than upsert operations
- Large numbers of tables may impact memory usage
- Consider processing tables in batches if dealing with hundreds of tables
- Monitor execution time for very large datasets
- **Important**: The delete-and-recreate operation ensures data consistency but may temporarily impact application performance during the operation

## Supported Table Names

The action supports all the same table names as the original function:

### ECLAIMS Tables

- `ECLAIMS_DATA`
- `ECLAIMS_ITEMS_DATA`
- `TAX_BFT_CLAIMS_GRP`

### CWS Tables

- `CWS_DATA`
- `CWS_YEAR_SPLIT_DATA`
- `CWS_WBS_DATA`
- `CWS_ASSISTANCE_DATA`
- `CWS_PAYMENT_DATA`
- `CWS_REPORT_EXTRACT_DATA`
- `OPWN_OTP_CONSOLIDATED_DATA`
- `OPWN_OTP_CONSOLIDATED_ERR_DATA`
- `OPWN_PAYMENT_IMG_DATA`

### CHRS Tables

- `CHRS_JOB_INFO`
- `CHRS_COMP_INFO`
- `CHRS_COST_DIST`
- `CHRS_HRP_INFO`
- `CHRS_FDLU_ULU`
- `MASTER_CLAIM_TYPE`
- `CHRS_ELIG_CRITERIA`
- `RATE_TYPE_MASTER_DATA`
- And many more...

### Utility Tables

- `APP_CONFIGS`
- `CWS_APP_CONFIGS`
- `CHRS_APPROVER_MATRIX`
- `CHRS_ROLE_MASTER`
- `PROCESS_CONFIG`
- And many more...
