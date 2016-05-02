let BaseApi = require("../lib/BaseApi.js").BaseApi;
let AuthApi = require("../lib/AuthApi.js").AuthApi;
let Session = require("../lib/Session.js").Session;
let DownloadApi = require("../lib/DownloadApi.js").DownloadApi;
let { before, after } = require('sdk/test/utils');

let getSession = function() {
    var base_api = new BaseApi(urlToConnect, 20000);
    base_api.apiInfo = JSON.parse('{"SYNO.API.Auth":{"maxVersion":2,"minVersion":2,"path":"auth.cgi"},"SYNO.DownloadStation.Task":{"maxVersion":1,"minVersion":1,"path":"DownloadStation/task.cgi"}}');
    var auth_api = new AuthApi(base_api);
    return new Session(auth_api, "synoloader_tester", "1234");
};


this.urlToConnect = "http://192.168.0.201:5050";
this.file_to_downlaod = "http://releases.ubuntu.com/vivid/ubuntu-15.04-desktop-amd64.iso"
this.session = getSession();


after(exports, function (name, assert, done) {
    this.session.logout((logout_response) => {
        assert.equal(true, logout_response.success);
    done();
    });
});

exports["test is_supported"] = function(assert) {
    var download_api = DownloadApi(this.session);
    assert.equal(true, download_api.is_supported);
}

exports["test getTasksInfo"] = function(assert, done) {
    var download_api = DownloadApi(this.session);
    download_api.getTasksInfo((task_info_response) => {
        assert.equal(true, task_info_response.success);
        done();
    });
}

exports["test createTasks"] = function(assert, done) {
    var download_api = DownloadApi(this.session);
    download_api.createTasks((create_task_response) => {
        assert.equal(true, create_task_response.success);
    done();
}, this.file_to_downlaod);
}

exports["test createTasksHomeDir"] = function(assert, done) {
    var download_api = DownloadApi(this.session);
    download_api.createTasks((create_task_response) => {
        assert.equal(true, create_task_response.success);
        done();
}, this.file_to_downlaod, "home");
}

require("sdk/test").run(exports);