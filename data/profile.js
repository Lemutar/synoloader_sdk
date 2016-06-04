$(document).ready(function() {
    $('select').material_select();
});

$(document).ready(function() {
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
});

var active_profile = undefined;

$('#check_connection').on('click', function() {
    $("#check_connection_prelaoder").addClass("indeterminate");
    $("#check_connection_prelaoder").removeClass("determinate");
    self.port.emit('check_connection', active_profile);
    $("#check_connection_status").fadeTo(1000, 0);
});

self.port.on('update_connection_status', function(success) {
    $("#check_connection_prelaoder").addClass("determinate");
    $("#check_connection_prelaoder").removeClass("indeterminate");
    if (success) {
        $("#check_connection_status").text("done");
    } else {
        $("#check_connection_status").text("error");
    }
    Materialize.fadeInImage('#check_connection_status');
});

$(document).on('click', "a.profile_item", function() {
    $("#Profiles").children().removeClass("active");
    $(this).addClass("active");
    active_profile = $(this).data();
    $("#url_to_nas").val(active_profile.url);
    $("#user_name").val(active_profile.user_name);
    self.port.emit('get_password', active_profile);
    $("#check_connection_status").text("help");
    Materialize.updateTextFields();
});

$(document).on('click', "a.profile_item", function() {
    $("#Profiles").children().removeClass("active");
    $(this).addClass("active");
    active_profile = $(this).data();
    self.port.emit('set_active', active_profile);
});

self.port.on('set_active', function(profile) {
    $("#url_to_nas").val(profile.url);
    $("#user_name").val(profile.user_name);
    self.port.emit('get_password', profile);
    Materialize.updateTextFields();
    active_profile = profile;
});

self.port.on('update_password', function(password) {
    $("#password").val(password);
    Materialize.updateTextFields();
});

$('#url_to_nas').on('change', function() {
    active_profile.url = $(this).val();
    self.port.emit('edit_profile', active_profile);
});

$('#user_name').on('change', function() {
    active_profile.user_name = $(this).val();
    self.port.emit('edit_profile', active_profile);
});

$('#password').on('change', function() {
    self.port.emit('set_password', active_profile, $(this).val());
});


$(document).on('click', "a.profile_item_delete", function() {
    if ($(this).parent().data().id === active_profile.id) {
        self.port.emit('select_default', "");
    }
    self.port.emit('delete_profile', $(this).parent().data());
});

var createProfile = function(profile) {
    var profile_html = $('<a/>').attr({
        class: "collection-item  profile_item",
        href: "#!",
        id: "profile_" + profile.name,
    });

    var profile_edit = $('<a/>').attr({
        class: "secondary-content profile_item_edit",
        href: "#!",
    });

    var profile_edit_icon = $('<i/>').attr({
        class: "material-icons",
    });

    var profile_delete = $('<a/>').attr({
        class: "secondary-content profile_item_delete",
        href: "#!",
    });

    var profile_delete_icon = $('<i/>').attr({
        class: "material-icons",
    });

    if (profile.is_default === true) {
        profile_html.addClass("light-blue");
        profile_html.addClass("lighten-2");
    }

    profile_edit_icon.html("edit");
    profile_edit.append(profile_edit_icon);

    profile_delete_icon.html("delete");


    profile_delete.prop("disabled", profile.is_default);
    profile_delete.append(profile_delete_icon);
    profile_html.html(profile.name);
    profile_html.append(profile_delete);
    profile_html.append(profile_edit);
    profile_html.data(profile);
    return profile_html;
}

var edit_profile_name = undefined;

$('#profile_name_add').on('click', function() {
    $('#profile_edit').addClass("add_profile");
    $('#profile_edit_default').prop('checked', false);
    $('#profile_name').val("");
    $('#profile_edit').openModal();
});

$('#profile_edit_set').on('click', function() {
    if ($('#profile_edit').hasClass("add_profile")) {
        var profile_data = {
            name: $('#profile_name').val(),
            is_default: $('#profile_edit_default').prop('checked'),
        };
        self.port.emit('add_profile', profile_data);
        $('#profile_edit').removeClass("add_profile");
    }
    if ($('#profile_edit').hasClass("edit_profile")) {
        $('#profile_edit').removeClass("edit_profile");
        var profile = $('#profile_' + edit_profile_name).data();
        profile.is_default = $('#profile_edit_default').prop('checked');
        profile.name = $('#profile_name').val();
        self.port.emit('edit_profile', profile);
    }
});

$(document).on('click', "a.profile_item_edit", function() {
    $('#profile_edit').addClass("edit_profile");
    edit_profile_name = $(this).parent().data().name;
    $('#profile_edit_default').prop('checked', $(this).parent().data().is_default);
    $('#profile_edit_default').prop("disabled", $(this).parent().data().is_default);
    $('#profile_name').val(edit_profile_name);
    $('#profile_edit').openModal();
});

self.port.on('update_profiles', function(profiles) {
    $('#Profiles').children().remove();
    profiles.forEach(function(profile) {
        $('#Profiles').append(createProfile(profile));
    });
});
