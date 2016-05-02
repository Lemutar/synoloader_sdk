var button = document.getElementById("addAccordion");
button.addEventListener("click", function() {
    var profile_name = document.getElementById("profile_name");
    self.port.emit('add_profile', profile_name.value);
}, false);

var check_connection = document.getElementById("check_connection");
check_connection.addEventListener("click", function() {
    var profiles = document.getElementById("Profiles");
    for(var i=0; i < profiles.childNodes.length; i++)
    {
        if (profiles.childNodes[i].className.indexOf("active") > -1) {
            self.port.emit('check_connection', profiles.childNodes[i].id.replace("profile_",""));
        }
    }
    var check_connection_prelaoder = document.getElementById("check_connection_prelaoder");
    check_connection_prelaoder.className+= " active";
    var check_connection_status_icon = document.getElementById("check_connection_status_icon");
    if (check_connection_status_icon != undefined) {
        check_connection_status_icon.parentNode.removeChild(check_connection_status_icon);
    }
}, false);

self.port.on('update_connection_status', function(success) {
    var check_connection_prelaoder = document.getElementById("check_connection_prelaoder");
    check_connection_prelaoder.className = check_connection_prelaoder.className.replace(" active","");
    var check_connection_status = document.getElementById("check_connection_status");
    var status = document.createElement("i");
    status.className="material-icons";
    status.id="check_connection_status_icon";
    if (success) {
        var icon_name_text = "thumb_up";
    } else {
        var icon_name_text = "thumb_down";
    }
    var icon_name = document.createTextNode(icon_name_text);
    status.appendChild(icon_name);
    check_connection_status.appendChild(status);
});

var SelectProfile = function() {
    var profiles = document.getElementById("Profiles");
    for(var i=0; i < profiles.childNodes.length; i++)
    {
        profiles.childNodes[i].className = "collection-item"

    }
    this.className="collection-item active";
    self.port.emit('select_profile', this.id.replace("profile_",""));
};

self.port.on('add_refresh', function(profile) {
    var profiles = document.getElementById("Profiles");
    var prof = document.createElement("a");
    prof.href="#!";
    prof.className="collection-item";
    prof.id="profile_"+profile.name;
    prof.onclick = SelectProfile;
    var name = document.createTextNode(profile.name);
    prof.appendChild(name);
    profiles.appendChild(prof);
});

self.port.on('update_profile_info', function(profile) {
    var url = document.getElementById("url_to_nas");
    url.value = profile.url;

    var user_name = document.getElementById("user_name");
    user_name.value = profile.user_name;

    var password = document.getElementById("password");
    password.value = profile.password;

    Materialize.updateTextFields();
});