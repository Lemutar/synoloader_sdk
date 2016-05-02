let BaseApi = require("../lib/BaseApi.js").BaseApi;
let AuthApi = require("../lib/AuthApi.js").AuthApi;
let Session = require("../lib/Session.js").Session;

let getAuthApi = function() {
    var base_api = new BaseApi("http://192.168.0.201:5050", 10000);
    base_api.apiInfo = JSON.parse('{"SYNO.API.Auth":{"maxVersion":2,"minVersion":2,"path":"auth.cgi"}}');
    return new AuthApi(base_api);
};

exports["test login_logout"] = function(assert, done) {
    var session = new Session(getAuthApi(), "synoloader_tester", "1234");
    assert.equal(false, session.is_logged_in);
    assert.equal(undefined, session.sid);
    session.login((login_response) => {
        assert.equal(true, login_response.success);
        assert.equal(true, session.is_logged_in);
        //assert.notEqual(undefined, session.sid);
    session.logout((logout_response) => {
        assert.equal(true, logout_response.success);
        assert.equal(false, session.is_logged_in);
        assert.equal(undefined, session.sid);
        done();
});
});
};

require("sdk/test").run(exports);