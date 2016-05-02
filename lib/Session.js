

if (typeof WaitTillloginRequest  === "undefined") {
    var WaitTillloginRequest = function(session, api, data, api_request_callback) {
        this.session = session;
        this.api = api;
        this.data = data;
        this.api_request_callback = api_request_callback;
        this.get = () => {
            wait_till_login(() => {
                this.session.authApi.baseApi.ApiRequest(this.api, this.data, this.api_request_callback).get();
            });
        };
        this.post = () => {
            wait_till_login(() => {
                this.session.authApi.baseApi.ApiRequest(this.api, this.data, this.api_request_callback).post();
            });
        };
        this.wait_till_login = (callback) => {
            this.session.login((login_response) => {
                if(login_response.success === true) {
                    this.data._sid = this.session.sid;
                    callback();
                }
            });
        };
        return this;
    };
}

if (typeof Session === "undefined") {

    var Session = function(auth_api, username, password) {
        this.authApi = auth_api;
        this.is_logged_in = false;
        this.password = password;
        this.username = username;
        this.session_name = "DownloadStation";
        this.is_logged_in = false;
        this.last_login_time = undefined;

        this.SessionRequest = (api, data, api_request_callback) => {
            if(this.is_logged_in) {
                data._sid = this.sid;
                return this.authApi.baseApi.ApiRequest(api, data, api_request_callback);
            } else {
                return WaitTillloginRequest(this, api, data, api_request_callback);
            }
        };

        this.logout = (callback) => {
            this.authApi.logout(this.session_name, (logout_response) => {
                if(logout_response.success === true) {
                    this.is_logged_in = false;
                    this.sid = undefined;
                }
                callback(logout_response);
             });
        };


        this.login = (callback) => {
        this.authApi.login(this.username, this.password, this.session_name, (login_response) => {
            if(login_response.success === true) {
                this.last_login_time = Date.now();
                this.sid = login_response.data.sid;
                this.is_logged_in = true;
            }
            callback(login_response);
            //Util.log(login_response.text);
          });
        }
        return this;
    };
}
exports.Session = Session;