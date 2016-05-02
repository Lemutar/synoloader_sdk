
if (typeof DownloadApi === "undefined") {

    var DownloadApi = function(session) {
        this.session = session;
        const downloadApi = {
                name: "SYNO.DownloadStation.Task",
                path: undefined,
                version : 1,
                error_texts : {
                    400: "File upload failed",
                    401: "Max number of tasks reached",
                    402: "Destination denied",
                    403: "Destination does not exist",
                    404: "Invalid task id",
                    405: "Invalid task action",
                    406: "No default destination"
            }
        };
        this.is_supported = this.session.authApi.baseApi.init_api(downloadApi);

        this.createTasks = (callback, uri, destination) => {
            create_task_query = {
                api: downloadApi.name,
                version: downloadApi.version,
                method: "create",
                uri: uri,
            };
            if (destination != undefined) {
                create_task_query.destination = destination;
            }
            this.session.SessionRequest(downloadApi, create_task_query, callback).get();
        };

        this.getTasksInfo = (callback) => {
            get_task_info_query = {
                api: downloadApi.name,
                version: downloadApi.version,
                method: "list",
                additional: "transfer"
            };
            this.session.SessionRequest(downloadApi, get_task_info_query, callback).get();
        };

        this.deleteTasks = (callback, task_ids, force_complete) => {
            delete_task_query = {
                api: downloadApi.name,
                version: downloadApi.version,
                method: "delete",
                id: task_ids,
            };
            if (force_complete != undefined) {
                delete_task_query.force_complete = force_complete;
            }
            this.session.SessionRequest(downloadApi, delete_task_query, callback).get();
        };

        this.pauseTasks = (callback, task_ids) => {
            pause_task_query = {
                api: downloadApi.name,
                version: downloadApi.version,
                method: "pause",
                id: task_ids,
            };
            this.session.SessionRequest(downloadApi, pause_task_query, callback).get();
        };

        this.resumeTasks = (callback, task_ids) => {
            resume_task_query = {
                api: downloadApi.name,
                version: downloadApi.version,
                method: "resume",
                id: task_ids,
            };
            this.session.SessionRequest(downloadApi, resume_task_query, callback).get();
        };

        this.editTasks = (callback, task_ids, destination) => {
            edit_task_query = {
                api: downloadApi.name,
                version: downloadApi.version,
                method: "edit",
                id: task_ids,
                destination: destination,
            };
            this.session.SessionRequest(downloadApi, edit_task_query, callback).get();
        };

        return this;
    };
}

exports.DownloadApi = DownloadApi;