let BaseApi = require("../lib/base_api.js").BaseApi;
let AuthApi = require("../lib/auth_api.js").AuthApi;
let Session = require("../lib/session.js").Session;

ss = require("sdk/simple-storage");
if (typeof ConnectionManager === "undefined") {
    var ConnectionManager = function() {


        if (typeof ss.storage.profile_infos === "undefined") {
            ss.storage.profile_infos = [];
            var default_profile = {
                name: "default",
                is_default: true,
                protocol: "",
                user_name: "",
                url: "",
                id: uniqueID(),
            }
            ss.storage.profile_infos.push(default_profile);
        }
        this.uniqueID = () => {
            function chr4() {
                return Math.random().toString(16).slice(-4);
            }
            return chr4() + chr4() +
                '-' + chr4() +
                '-' + chr4() +
                '-' + chr4() +
                '-' + chr4() + chr4() + chr4();
        };


        this.createProfiles = () => {
            Profiles = [];
            ss.storage.profile_infos.forEach(function(profile_info) {
                var profile = {
                    profile_info: profile_info,
                    //                session: session,
                    //               download_api: download_api
                };
                require("sdk/passwords").search({
                    realm: "synoloader_" + profile_info.id,
                    username: profile_info.user_name,
                    onComplete: function onComplete(credentials) {
                        //var base_api = new BaseApi(profile_info.url, 30000);
                        //var auth_api = new AuthApi(base_api);
                        var password = "";
                        if (credentials.length === 1) {
                            password = credentials[0].password;
                        }
                        //var session = new Session(auth_api, profile_info.user_name, password);
                        //var download_api = new DownloadApi(session);
                    }
                });
                Profiles.push(profile);

            });
        };

        this.ShowConnections = () => {

            var data = require('sdk/self').data,
                tabs = require('sdk/tabs');
            var win = require('sdk/window/utils').openDialog({
                features: Object.keys({
                    chrome: true,
                    dialog: true,
                    resizable: true,
                    scrollbars: true
                }).join() + ',width=850,height=650',
                name: "Manage Connctions"
            });
            win.addEventListener('load', function() {
                tabs.activeTab.on('ready', function(tab) {
                    var worker = tab.attach({
                        contentScriptFile: [data.url("jquery-2.2.3.min.js"), data.url("js/materialize.min.js"), data.url('profile.js')],
                    });
                    ss.storage.profile_infos.forEach(function(profile) {
                        if (profile.is_default === true) {
                            worker.port.emit('set_active', profile);
                        }
                    });
                    worker.port.emit('update_profiles', ss.storage.profile_infos);

                    worker.port.on('select_default', function() {
                        ss.storage.profile_infos.forEach(function(profile) {
                            if (profile.is_default === true) {
                                worker.port.emit('set_active', profile);
                            }
                        });
                    });

                    worker.port.on('add_profile', function(profile_data) {
                        if (profile_data.is_default === true) {
                            ss.storage.profile_infos.forEach(function(profile, index, profiles) {
                                profiles[index].is_default = false;
                            });
                        }
                        var profile = {
                            name: profile_data.name,
                            is_default: profile_data.is_default,
                            protocol: "",
                            user_name: "",
                            url: "",
                            id: this.uniqueID(),
                        }
                        ss.storage.profile_infos.push(profile);
                        worker.port.emit('update_profiles', ss.storage.profile_infos);
                    });

                    worker.port.on('edit_profile', function(profile_edit) {
                        ss.storage.profile_infos.forEach(function(profile, index, profiles) {
                            if (profile.id === profile_edit.id) {
                                profiles[index] = profile_edit;
                            } else if (profile_edit.is_default === true) {
                                profiles[index].is_default = false;
                            }
                        });
                        worker.port.emit('update_profiles', ss.storage.profile_infos);
                    });

                    worker.port.on('delete_profile', function(profile_delete) {
                        ss.storage.profile_infos.forEach(function(profile, index, profiles) {
                            if (profile.id === profile_delete.id) {
                                profiles.splice(index, 1);
                            }
                        });
                        worker.port.emit('update_profiles', ss.storage.profile_infos);
                    });

                    worker.port.on('set_password', function(profile, password) {

                        require("sdk/passwords").search({
                            realm: "synoloader_" + profile.id,
                            username: profile.user_name,
                            onComplete: function onComplete(credentials) {
                                credentials.forEach(require("sdk/passwords").remove);
                                require("sdk/passwords").store({
                                    realm: "synoloader_" + profile.id,
                                    username: profile.user_name,
                                    password: password,
                                });
                            }
                        });
                    });

                    worker.port.on('get_password', function(profile) {
                        require("sdk/passwords").search({
                            realm: "synoloader_" + profile.id,
                            username: profile.user_name,
                            onComplete: function onComplete(credentials) {
                                if (credentials.length === 1) {
                                    worker.port.emit('update_password', credentials[0].password);
                                } else {
                                    worker.port.emit('update_password', "");
                                }
                            }
                        });
                    });

                    worker.port.on('check_connection', function(profile) {
                        var base_api = new BaseApi(profile.url, 10000);
                        base_api.apiInfo = JSON.parse('{"SYNO.API.Auth":{"maxVersion":2,"minVersion":2,"path":"auth.cgi"}}');
                        var auth_api = new AuthApi(base_api);
                        console.log("Hello World");
                        require("sdk/passwords").search({
                            realm: "synoloader_" + profile.id,
                            username: profile.user_name,
                            onComplete: function onComplete(credentials) {
                                credentials.forEach(function(credential) {
                                    var session = new Session(auth_api, profile.user_name, credential.password);
                                    session.login(function(login_response) {
                                        worker.port.emit('update_connection_status', login_response.success);
                                        if (login_response.success) {
                                            session.logout(function(logout_response) {});
                                        }
                                    });
                                });
                            }
                        });
                    });

                });
                win.addEventListener('unload', function(event) {
                    this.createProfiles();
                });
                tabs.activeTab.url = data.url('index.html');
            });
        };
        return this;
    };
}

exports.ConnectionManager = ConnectionManager;
