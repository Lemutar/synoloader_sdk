let BaseApi = require("../lib/BaseApi.js").BaseApi;
let AuthApi = require("../lib/AuthApi.js").AuthApi;

let getBaseApi = function() {
    var base_api = BaseApi("http://192.168.0.201:5050", 5000);
    base_api.apiInfo = JSON.parse('{"SYNO.API.Auth":{"maxVersion":2,"minVersion":2,"path":"auth.cgi"}}');
    return base_api;
};

exports["test is_supported"] = function(assert) {
    var auth_api = AuthApi(getBaseApi());
    assert.equal(true, auth_api.is_supported);
};

exports["test login_logout"] = function(assert, done) {
    var auth_api = AuthApi(getBaseApi());
    auth_api.login("synoloader_tester", "1234", "DownloadStation", (login_response) => {
        assert.equal(true, login_response.success);
    auth_api.logout("DownloadStation",  (logout_response) => {
        assert.equal(true, logout_response.success);
    done();
    });
    });
};

require("sdk/test").run(exports);