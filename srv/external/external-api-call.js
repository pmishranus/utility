const axios = require('axios');

module.exports = {

    _fnAxiosCall : function(method,url,payload,header){
        switch(method){
            case 'POST':
                const response = axios.post(url, payload, header);
                return response;
                break;
        }
       
    }
}