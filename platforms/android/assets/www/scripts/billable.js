/* Test Functions */

var projectbarcode = {    
    "doc": "PR17000004",
    "type": "p",
    "append": [
        {
            "part": "2001",
            "qty": "#Please enter amount",
            "img": "Please scan the receipt"
        }
    ]
};

var servicebarcode = {
    "doc": "SC17000025",
    "type": "Q",
    "append": [
        {
            "part": "2001",
            "qty": ".25"
        }
    ]
};

var salesorderbarcode = {
    "doc": "SO17000058",
    "type": "O",
    "append": [
        {
            "part": "2001",
            "wbs": "2",
            "line": "1",
            "qty": "1"
        }
    ]
};

var configbarcode = {
    "type": "config",
    "name": "SimonB",
    "pass": 'Tabula!',
    "server": "erpdemo.emerge-it.co.uk",
    "env": "demo",        
    "lang": 2             
};

var resetbarcode = {
    "type": "reset"
};

function testconfig() {
    navigator.notification.confirm("Send which test?", function (ebutton) {
        switch (ebutton) {
            case 0:
                break;

            case 1:
                qcodejson(configbarcode);
                break;

            case 2:
                qcodejson(resetbarcode);
                break;

            case 3:
                break;
        }
    }, "Testing", ["Config", "Reset", "Cancel"]);

}

function testbarcode() {
    navigator.notification.confirm("Send which test?", function (ebutton) {
        switch (ebutton) {
            case 0:
                break;

            case 1:
                qcodejson(projectbarcode);
                break;

            case 2:
                qcodejson(salesorderbarcode);
                break;

            case 3:
                qcodejson(servicebarcode);
                break;
        }
    }, "Testing", ["Project", "Sales Order", "Service Call"]);

}

function testcamera() {
    navigator.notification.confirm("Send which test?", function (ebutton) {
        switch (ebutton) {
            case 0:
                break;

            case 1:
                PriorityLogin();
                break;

            case 2:
                if (curform) {

                    navigator.camera.getPicture(onSuccess, onFail, {
                        quality: 20,
                        destinationType: Camera.DestinationType.DATA_URL
                    });

                    function onSuccess(imageURI) {
                        SpinnerDialog.show("", "Uploading...", function () { });
                        curform.uploadDataUrl(
                            "data:image/png;base64," + imageURI,
                            "png",
                            function (FileUploadResult) {
                                if (FileUploadResult.isLast) {
                                    SpinnerDialog.hide();
                                    alert(FileUploadResult.file);
                                }
                            },
                            function (ServerResponse) {
                                SpinnerDialog.hide();
                                navigator.notification.confirm(ServerResponse.message, function (ebutton) { }, "Error", ["Ok"]);

                            }
                        );

                    }

                    function onFail(message) {
                        navigator.notification.confirm('Failed because: ' + message, function (ebutton) { }, "Error", ["Ok"]);
                    }

                } else {
                    navigator.notification.confirm("SDK is not connected.", function (ebutton) { }, "Error", ["Ok"]);

                }
                break;

            case 3:
                curform.uploadDataUrl(
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
                    "png",
                    function (FileUploadResult) {
                        if (FileUploadResult.isLast) {
                            alert(FileUploadResult.file);
                        }
                    },
                    function (ServerResponse) {
                        alert(ServerResponse.message);
                    }
                );

                break;
        }
    }, "Testing", ["Login", "Camera", "Upload"]);

}

/* End Test Functions */

function scan() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                if (result.format === "QR_CODE") {
                    try {
                        qcodejson(JSON.parse(result.text))
                    } catch (er){
                        navigator.notification.confirm(
                            er.message,
                            function () { },
                            "Barcode Error",
                            ["Ok"]
                        );
                    }
                } else {
                    navigator.notification.confirm(
                        "Not a QR code",
                        function () { },
                        "Error",
                        ["Ok"]
                    );
                }
            }
        },
        function (error) {            
            navigator.notification.confirm(
                error,
                function () { },
                "Scanning failed",
                ["Ok"]
            );
        }
    );
}

function qcodejson(data) {

    switch (data.type) {
        case "config":
            navigator.notification.confirm(
                "Name: " + data.name + "\nServer: " + data.server + "\nCompany: " + data.env,
                function (ebutton) {
                    switch (ebutton) {
                        case 2:
                            localStorage.setItem('name', data.name);
                            localStorage.setItem('pass', data.pass);
                            localStorage.setItem('server', data.server);
                            localStorage.setItem('env', data.env);
                            localStorage.setItem('lang', data.lang);

                            PriorityLogin().then(() => {
                                document.getElementById('credentials').innerText = localStorage.getItem('name');
                                document.getElementById('server').innerText = localStorage.getItem('server');
                                document.getElementById('env').innerText = localStorage.getItem('env');

                                document.getElementById('cred').setAttribute('style', 'display:block;');
                                document.getElementById('nocred').setAttribute('style', 'display:none;');

                                navigator.notification.confirm(
                                    "Authentication sucsessful.",
                                    function () { },
                                    "Priority",
                                    ["Ok"]
                                );

                            }).catch(er => {
                                localStorage.clear();
                                if (er !== "") {
                                    navigator.notification.confirm(
                                        er,
                                        function () { },
                                        "Error",
                                        ["Ok"]
                                    );
                                }

                            });

                            break;

                        default:
                            break;
                    }
                },
                "Set Credentials?",
                ["Cancel", "Ok" ]
            );
            break;

        case "reset":
            navigator.notification.confirm("Reset credentials?", function (ebutton) {
                switch (ebutton) {
                    case 2:
                        localStorage.clear();
                        document.getElementById('cred').setAttribute('style', 'display:none;');
                        document.getElementById('nocred').setAttribute('style', 'display:block;');

                        document.getElementById('credentials').innerText = "";
                        document.getElementById('server').innerText = "";
                        document.getElementById('env').innerText = "";
                        break;

                    default:
                        break;
                }
            },
                "Reset credentials",
                ["Cancel", "Ok"]
            );
            break;

        default:
            getFields(data).then(udata => {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://' + localStorage.getItem('server') + '/api/' + localStorage.getItem('env') + '/hours.ashx', true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        SpinnerDialog.hide();
                        if (xhr.status === 200) {
                            var xmlDoc = $.parseXML(xhr.responseText);
                            var $xml = $(xmlDoc);
                            var ertxt = '';
                            ertxt += $xml.find("apiresult").attr('message') + "\n";
                            $xml.find("line").each(function () {
                                ertxt += $(this).attr("message") + "\n";
                            });

                            navigator.notification.confirm(
                                ertxt,
                                function () { },
                                "Response",
                                ["Ok"]
                            );

                        } else {
                            navigator.notification.confirm(
                                "Connection error: " + xhr.statusText,
                                function () { },
                                "Error " + xhr.status,
                                ["Ok"]
                            );

                        }
                    }
                };
                SpinnerDialog.show("", "Sending...", function () {
                    SpinnerDialog.hide();
                    xhr.abort();
                });
                xhr.send(JSON.stringify(udata));

            }).catch(er => {
                SpinnerDialog.hide();
                navigator.notification.confirm(
                    er,
                    function () { },
                    "Error ",
                    ["Ok"]
                );
            });
                                                   
    }

}

function getFields(data) {
    return new Promise((resolve, reject) => {

        var tmp = data;
        // Must be configured.
        if (!localStorage.getItem('name')) {
            reject("Credentials not supplied. Please scan config QR.");
            return;
        };

        // If the barcode contains a user check if it's THIS user
        if (tmp.name) {
            if (tmp.name !== localStorage.getItem('name')) {
                reject("Barcode may only be used by " + data.name);
                return;
            }
        } else {
            // User not specified  - use config'd user.
            tmp.name = localStorage.getItem('name');
        };

        // Check for out-of-date barcode
        if (tmp.expire) {
            var now = new Date();
            var exp = new Date(tmp.expire);
            if (now > exp) {
                reject("The barcode has expired");
                return;
            }
        }
        
        var de = [];
        de.push({
            "type": "geo"
        });

        // Iterate append data        
        if (tmp.append) {
            for (var e in tmp.append) {
                for (var i in tmp.append[e]) {
                    if (i == "img") {
                        de.push({ "type": "img", "desc": tmp.append[e][i], "row": e, "item": i });
                    };

                    if (tmp.append[e][i].slice(0, 1) == "#") {
                        de.push({ "type": "#", "desc": tmp.append[e][i].slice(1), "row": e, "item": i });

                    };

                    if (tmp.append[e][i].slice(0, 1) == "$") {
                        de.push({ "type": "$", "desc": tmp.append[e][i].slice(1), "row": e, "item": i });

                    };                    
                }
            }
        };   
        
        try {
            var cntr = 0;
            function next() {
                if (cntr < de.length) {
                    switch (de[cntr].type) {
                        case "geo":
                            getLocation().then(position => {
                                tmp.lon = position.coords.longitude;
                                tmp.lat = position.coords.latitude;
                                cntr++;
                                next();
                            }).catch(er => {
                                cntr++;
                                next();
                            })
                            break;

                        case "img":
                            getImage(de[cntr].desc).then(img => {
                                tmp.append[de[cntr].row][de[cntr].item] = img;
                                cntr++;
                                next();
                            }).catch(er => {
                                reject(er);
                                return;
                            });
                            break;

                        case "$":
                            getPrompt(de[cntr].item, de[cntr].desc).then(entry => {
                                tmp.append[de[cntr].row][de[cntr].item] = entry;
                                cntr++;
                                next();
                            }).catch(er => {
                                reject(er);
                                return;
                            });
                            break;

                        case "#":
                            getPrompt(de[cntr].item, de[cntr].desc).then(entry => {
                                tmp.append[de[cntr].row][de[cntr].item] = entry;
                                cntr++;
                                next();
                            }).catch(er => {
                                reject(er);
                                return;
                            });
                            break;

                    }                

                } else { resolve(tmp) };
            };
            next();
        } catch (err) { reject(err) }
    })
};

function getPrompt(name, text) {
    return new Promise((resolve, reject) => {
        navigator.notification.prompt(
            text,
            function (result) {
                switch (result.buttonIndex) {
                    case 1:
                        resolve(result.input1);
                        break;

                    default:
                        reject("User cancelled")
                        break;
                }
            },
            name,
            ["Ok", "Cancel"],
            ""
        )
    })
}

function getImage(text) {
    return new Promise((resolve, reject) => {
        if (!curform) {
            reject("SDK is not connected.");
        }

        navigator.notification.confirm(
            text,
            function (ebutton) {
                switch (ebutton) {
                    case 2:
                        navigator.camera.getPicture(
                            function (imageURI) {
                                SpinnerDialog.show("", "Uploading...", function () {                                    
                                    SpinnerDialog.hide();
                                    reject("User cancelled.");

                                });
                                curform.uploadDataUrl(
                                    "data:image/png;base64," + imageURI,
                                    "png",
                                    function (FileUploadResult) {
                                        if (FileUploadResult.isLast) {
                                            SpinnerDialog.hide();
                                            resolve(FileUploadResult.file);
                                        }
                                    },
                                    function (ServerResponse) {
                                        SpinnerDialog.hide();
                                        reject(ServerResponse.message);
                                    }
                                );
                            },

                            function (message) {
                                reject('Failed because: ' + message);
                            },

                            {
                                quality: 20,
                                destinationType: Camera.DestinationType.DATA_URL
                            }
                        );
                        break;

                    default:
                        reject("User cancelled.");
                        break;
                }
            },
            "Camera",
            ["Cancel", "Ok"]

        )
    })
}

function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                resolve(position);
            },
            function (error) {
                reject(error);
            },
            { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }
        );
    })
}

function PriorityLogin() {
    return new Promise((resolve, reject) => {
        SpinnerDialog.show("", "Connecting...", function () { SpinnerDialog.hide(); });
        login(
            {
                url: 'https://' + localStorage.getItem('server'),
                tabulaini: 'tabula.ini',
                language: localStorage.getItem('lang'),
                company: localStorage.getItem('env'),
                appname: 'BillableQR',
                username: localStorage.getItem('name'),
                password: localStorage.getItem('pass'),
                devicename: ''
            },
            function () {                
                formStart("DOCUMENTS_Q", null, null, 1).then(f => {
                    SpinnerDialog.hide();
                    curform = f;
                    resolve();

                }).catch(er => {
                    SpinnerDialog.hide();
                    reject(er.message);

                })
            },
            function (er) {
                SpinnerDialog.hide();
                navigator.notification.confirm(
                    er.code + ": " + er.type + ": " + er.message,
                    function (ebutton) {
                        switch (ebutton) {
                            case 1:
                                PriorityLogin();
                                break;

                            default:
                                reject("");
                                break;
                        }
                    },
                    "Priority Error.",
                    ["Retry", "Cancel"]
                )

            }
        )
    })
}