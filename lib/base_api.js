var Request = require("lib/request.js").Request;

const commonApiErrorTexts = {
    100: "Unknown error",
    101: "Invalid parameter",
    102: "The requested API does not exist",
    103: "The requested method does not exist",
    104: "The requested version does not support the functionality",
    105: "The logged in session does not have permission",
    106: "Session timeout",
    107: "Session interrupted by duplicate login"
}

const infoApi = {
    name: "SYNO.API.Info",
    path: "query.cgi",
    error_texts: {},
    version: 1
}

if (typeof BaseApi === "undefined") {

    var BaseApi = function(base_url, timeout_base_api) {

        this.base_url = base_url;
        this.data_object_to_url = (data_object) => {
            return Object.keys(data_object).map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data_object[key]);
            }).join('&');
        }


        this.ApiRequest = (api, data, api_request_callback) => {
            let response = {
                success: false
            };
            //Util.log(this.base_url + "/webapi/" + api.path);
            //Util.log(this.data_object_to_url(data));
            return Request(
                this.base_url + "/webapi/" + api.path,
                this.data_object_to_url(data),
                timeout_base_api,
                (apiRequestResponse) => {
                    if (apiRequestResponse.status === 200) {
                        response = apiRequestResponse.json;
                        if (response.success === false && "error" in response && "code" in response.error) {
                            if (response.error.code in commonApiErrorTexts) {
                                response.error_text = commonApiErrorTexts[response.error.code];
                            } else if (response.error.code in api.error_texts) {
                                response.error_text = api.error_texts[response.error.code];
                            } else {
                                response.error_text = "Unknown error";
                            }
                        }
                        //Util.log(apiRequestResponse.text);
                    } else {
                        response.error_text = apiRequestResponse.statusText;
                        //Util.log(response.error_text);
                    }
                    api_request_callback(response);
                });
        };

        this.get_api_data = (callback) => {
            let response = {
                success: false
            };
            get_api_info_query = {
                api: infoApi.name,
                version: infoApi.version,
                method: "query",
                query: "All",
            };
            ApiRequest(infoApi, get_api_info_query, (apiInfoResponse) => {
                if (apiInfoResponse.success === true) {
                    this.apiInfo = apiInfoResponse.data;
                }
                callback(apiInfoResponse);
            }).get();
        };

        this.init_api = (api) => {
            if (api.name in this.apiInfo) {
                if (this.apiInfo[api.name].minVersion <= api.version &&
                    this.apiInfo[api.name].maxVersion >= api.version) {
                    api.path = this.apiInfo[api.name].path;
                    return true;
                }
            }
            return false;
        };

        return this;
    };
}
exports.BaseApi = BaseApi;
