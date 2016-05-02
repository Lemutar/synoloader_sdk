let BaseApi = require("../lib/BaseApi.js").BaseApi;
let AuthApi = require("../lib/AuthApi.js").AuthApi;
let Session = require("../lib/Session.js").Session;

var ss = require("sdk/simple-storage");

var Profile_1 = {
    name:"me",
    protocol:"http",
    user_name:"synoloader_tester",
    password:"1234",
    url:"http://192.168.0.201:5050",
}

var Profile_2 = {
    name:"you",
    protocol:"http",
    user_name:"admin",
    password:"Schaller",
    url:"http://192.168.0.201:5050",
}

var Profile_3 = {
    name:"youv",
    protocol:"http",
    user_name:"tschumi",
    password:"Schaller",
    url:"http://192.168.0.200:5000",
}

var Profile_4 = {
    name:"oops",
    protocol:"http",
    user_name:"ssss",
    password:"dddd",
    url:"http://192.168.0.200:5000",
}

ss.storage.Profiles = [Profile_1, Profile_2, Profile_3, Profile_4];

var sp = require("sdk/simple-prefs");
sp.on("sayHello", function() {
    var data = require('sdk/self').data,
        tabs = require('sdk/tabs');
    var win = require('sdk/window/utils').openDialog({
        // No "url" supplied here in this case as we add it below (in order to have a ready listener in place before load which can give us access to the tab worker)
        // For more, see https://developer.mozilla.org/en-US/docs/Web/API/window.open#Position_and_size_features
        features: Object.keys({
            chrome: true, // Needed for centerscreen per docs
            centerscreen: true, // Doesn't seem to be working for some reason (even though it does work when calling via XPCOM)
            resizable: true,
            scrollbars: true
        }).join() + ',width=850,height=650',
        name: "My window name"
        // parent:
        // args:
    });
    win.addEventListener('load', function () {
        tabs.activeTab.on('ready', function (tab) {
            var worker = tab.attach({
                contentScriptFile:[data.url("jquery-2.2.3.min.js"), data.url("js/materialize.min.js"), data.url('Profile.js')],
        });

            ss.storage.Profiles.forEach(function(profile) {
                worker.port.emit('add_refresh', profile);
            });

            worker.port.on('add_profile', function(profile_name) {
                var profile = {
                    name:profile_name,
                    protocol:"",
                    user_name:"",
                    password:"",
                    url:"",
                }
                ss.storage.Profiles.push(profile);
                worker.port.emit('add_refresh', profile);

            });

            worker.port.on('select_profile', function(profile_name) {
                ss.storage.Profiles.forEach(function(profile) {
                    if(profile.name === profile_name) {
                        worker.port.emit('update_profile_info', profile);
                    }
                });
            });

            worker.port.on('check_connection', function(profile_name) {
                ss.storage.Profiles.forEach(function(profile) {
                    if(profile.name === profile_name) {
                        var base_api = new BaseApi(profile.url, 10000);
                        base_api.apiInfo = JSON.parse('{"SYNO.API.Auth":{"maxVersion":2,"minVersion":2,"path":"auth.cgi"}}');
                        var auth_api = new AuthApi(base_api);
                        var session = new Session(auth_api, profile.user_name, profile.password);
                        console.log("START");
                        session.login((login_response) => {
                            console.log("DONNE " + login_response.success);
                            worker.port.emit('update_connection_status', login_response.success);
                        });
                    }
                });
            });

        });
        tabs.activeTab.url = data.url('index.html');

    });
});

