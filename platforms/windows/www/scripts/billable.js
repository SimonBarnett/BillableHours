var $xml;

function UserDetail() {
    if (localStorage.getItem('name')){
        return localStorage.getItem('name') + "@" + localStorage.getItem('server') + "/" + localStorage.getItem('env');
    } else {
        return "Scan config QR.";
    }
}

function qcodejson(data) { 

    //navigator.notification.alert(JSON.stringify(data), function () { });
    navigator.notification.alert(data.type, function () { });

    //if (data.type === 'config') {
    //    navigator.notification.confirm(
    //        "Name: " + data.name + "\nServer: " + data.server + "\nCompany: " + data.env,
    //        function (ebutton) {
    //            switch (ebutton) {
    //                case 2:
    //                    localStorage.setItem('name', data.name);
    //                    localStorage.setItem('server', data.server);
    //                    localStorage.setItem('env', data.env);

    //                    document.getElementById('credentials').innerText = UserDetail();
    //                    navigator.notification.alert("Credentials Set.", function () { }, "Done");

    //                    break;

    //                default:
    //                    break;
    //            }
    //        },
    //        "Set User",
    //        ["Cancel", "Ok"]
    //    );

    //} else {
    //    var cfname = localStorage.getItem('name');
    //    var cfserver = localStorage.getItem('server');
    //    var cfenv = localStorage.getItem('env');

    //    if (cfname === undefined) {
    //        navigator.notification.confirm(
    //            "Credentials not supplied. Please scan config QR.",
    //            function () {},
    //            "Credentials"                
    //        );
    //        return;

    //    } else {
    //        if (data.name !== undefined) {
    //            if (data.name !== cfname) {
    //                navigator.notification.confirm(
    //                    "Barcode may only be used by " + data.name,
    //                    function () { },
    //                    "Credentials"
    //                );                    
    //                return;
    //            }

    //        } else {
    //            data.name = cfname;

    //        }


    //        var xhr = new XMLHttpRequest();
    //        xhr.open('POST', 'http://' + cfserver + '/api/'+ cfenv +'/hours.ashx', true);
    //        xhr.send(JSON.stringify(data));

    //        xhr.onreadystatechange = processRequest;

    //        SpinnerDialog.show(); 
            
    //    }
    }

function processRequest(e) {
    if (xhr.readyState === 4) {
        SpinnerDialog.hide();
        if (xhr.status === 200) {
            var xmlDoc = $.parseXML(xhr.responseText);
            $xml = $(xmlDoc);
            navigator.notification.confirm(
                $xml.find("apiresult").attr('message'),
                function (ebutton) {
                    switch (ebutton) {
                        case 1:
                            var ertxt;
                            $xml.find("line").each(function () {
                                ertxt = ertxt + "ln " + $(this).attr("name") + ": " + $(this).attr("message") + "\n";
                            });

                            navigator.notification.confirm(
                                ertxt,
                                function () { },
                                "Details",
                                ["Ok"]
                            );

                            break;

                        default:
                            break;
                    }
                },
                "Response",
                ["Details", "Ok"]
            );

        } else {
            navigator.notification.confirm(
                xhr.statusText,
                function () { },
                "Error " + xhr.status
            );

        }
    }
}

