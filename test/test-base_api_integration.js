let BaseApi = require("../lib/base_api.js").BaseApi;
let urlToConnect = "http://192.168.0.201:5050";

exports["test get_api_data"] = function(assert, done) {
    var base_api = BaseApi(urlToConnect, 5000);
    base_api.get_api_data((api_info_response) => {
        assert.equal(true, api_info_response.success);
        assert.equal(true, "SYNO.DownloadStation.Task" in api_info_response.data);
        done();
    });
};

exports["test init_api ok"] = function(assert) {
    const infoApi = {
        name: "SYNO.API.Info",
        path: "/webapi/query.cgi",
        error_texts: {},
        version: 1
    };
    var base_api = BaseApi(urlToConnect, 5000);
    base_api.apiInfo = JSON.parse('{"SYNO.API.Info":{"maxVersion":1,"minVersion":1,"path":"query.cgi"}}');
    assert.equal(true, base_api.init_api(infoApi));
};

exports["test init_api fail"] = function(assert) {
    const infoApi = {
        name: "SYNO.API.Info",
        path: "/webapi/query.cgi",
        error_texts: {},
        version: 10
    };
    var base_api = BaseApi(urlToConnect, 5000);
    base_api.apiInfo = JSON.parse('{"SYNO.API.Info":{"maxVersion":1,"minVersion":1,"path":"query.cgi"}}');
    assert.equal(false, base_api.init_api(infoApi));
};

require("sdk/test").run(exports);
