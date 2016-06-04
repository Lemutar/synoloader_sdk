if (typeof AuthApi === "undefined") {

    var AuthApi = function(base_api) {
        this.baseApi = base_api;
        this.sid = undefined;
        this.is_logged_in = false;
        const authApi = {
            name: "SYNO.API.Auth",
            path: undefined,
            version: 2,
            error_texts: {
                400: "No such account or incorrect password",
                401: "Account disabled",
                402: "Permission denied",
                403: "2-step verification code required",
                404: "Failed to authenticate 2-step verification code"
            }
        };
        this.is_supported = this.baseApi.init_api(authApi);

        this.login = (username, password, session_name, callback) => {
            var login_query = {
                api: authApi.name,
                version: authApi.version,
                method: "login",
                account: username,
                passwd: password,
                session: session_name,
                format: "sid"
            };
            this.baseApi.ApiRequest(authApi, login_query, callback).get();
        };

        this.logout = (session_name, callback) => {
            var logout_query = {
                api: authApi.name,
                version: authApi.version,
                method: "logout",
                session: session_name,
            };
            this.baseApi.ApiRequest(authApi, logout_query, callback).get();
        };
        return this;
    };
}

exports.AuthApi = AuthApi;
