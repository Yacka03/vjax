class vjax {
    constructor(parameters) {
        this.xhr = null;
        this.xhr = new XMLHttpRequest;
        if (parameters.onProgress) {
            this.xhr.onprogress = () => {
                parameters.onProgress();
            };
        }
        if (parameters.onResponse) {
            this.xhr.onload = () => {
                let response = {
                    url: this.xhr.responseURL,
                    status: this.xhr.status,
                    headers: this.xhr.getAllResponseHeaders(),
                    text: this.xhr.responseText,
                };
                if (this.xhr.getResponseHeader('content-type').includes('application/json'))
                    response.json_data = JSON.parse(response.text);
                parameters.onResponse(response);
            };
        }
        if (parameters.onError) {
            this.xhr.onerror = (e) => {
                parameters.onError(e);
            };
        }
        if (parameters.preProcess)
            parameters.preProcess();
        let fd = null;
        if(parameters.data) {
            if(parameters.type == 'POST') {
                fd = new FormData();
                let p;
                for (p in parameters.data) {
                    fd.append(p, parameters.data[p]);
                }
            } else {
                fd = '';
                let p;
                for (p in parameters.data) {
                    fd += `${p}=${parameters.data[p]}`;
                }
                parameters.url += `?${fd}`;
            }
        }
        this.xhr.open(parameters.type, parameters.url, true);
        this.xhr.send(fd);
        if (parameters.onSend)
            parameters.onSend();
        return this;
    }
}