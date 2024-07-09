using { com.nus.edu.sg as db } from '../db/datamodel';

service CatalogService @(path : '/catalog') {
  
  entity eclaims_data as projection on db.ECLAIMS.HEADER_DATA;

}