// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        dr = 1;        

        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        if (localStorage.getItem('name')) {
            document.getElementById('cred').setAttribute('style', 'display:block;');
            document.getElementById('nocred').setAttribute('style', 'display:none;');
            document.getElementById('credentials').innerText = localStorage.getItem('name');
            document.getElementById('server').innerText = localStorage.getItem('server');
            document.getElementById('env').innerText = localStorage.getItem('env');
        }
        
        if (pr === 1 && localStorage.getItem('name')) {         
            PriorityLogin().then(() => { }).catch(er => {            
                if (er !== "") {
                    navigator.notification.confirm(
                        er,
                        function () { },
                        "Error",
                        ["Ok"]
                    );
                }
            });
        }
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }

} )();