
let ConnectionManager = require("../lib/connection_manager.js").ConnectionManager;

var ContextMenu = {
    dowload_with_menu: undefined,
    update: function(Profiles) {
        var menu_items = [];
        if (this.dowload_with_menu !== undefined) {
            this.dowload_with_menu.destroy();
        }
        Profiles.forEach(function(profile) {
            var menu_item = require("sdk/context-menu").Item({
                label: profile.profile_info.name,
            });
            menu_items.push(menu_item);
        });

        this.dowload_with_menu = require("sdk/context-menu").Menu({
            label: "Download with..",
            context: require("sdk/context-menu").SelectorContext("a[href]"),
            items: menu_items,
        });
    },
};

var sp = require("sdk/simple-prefs");
sp.on("manage_connections", function() {
  ConnectionManager().ShowConnections();
});
