using {nusext as db} from '../db/datamodel';

using {BASE_ECLAIM_REQUEST_VIEW, ECLAIM_REQUEST_VIEW} from '../db/redefinemodel';

service Eclaims @(path: '/eclaims') {
 


/******************************************************************** Calculation Views Exposed *********************************************************************************/

@readonly
entity v_base_eclaim_request_view as projection on BASE_ECLAIM_REQUEST_VIEW;
@readonly
entity v_eclaim_request_view         as projection on ECLAIM_REQUEST_VIEW;

/********************************************************************************************************************************************************************************/






  // Handling user info with the authentication and user scopes

  type userScopes {
    identified    : Boolean;
    authenticated : Boolean;
    Viewer        : Boolean;
    Admin         : Boolean;
  };

  type userType {
    user   : String;
    locale : String;
    scopes : userScopes;
  };

  function userInfo() returns userType;

  

}

