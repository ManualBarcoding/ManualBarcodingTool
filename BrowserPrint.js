var BrowserPrint = function () {
    function g(a, d) {
        var c = new XMLHttpRequest;
        "withCredentials" in c ? c.open(a, d, !0) : "undefined" != typeof XDomainRequest ? (c = new XDomainRequest, c.open(a, d)) : c = null;
        return c
    }

    function h(a, d, c, b) {

        void 0 != a && (void 0 == c && (c = a.sendFinishedCallback), void 0 == b && (b = a.sendErrorCallback));

        d.onreadystatechange = function () {
            d.readyState === XMLHttpRequest.DONE && 200 === d.status ? c(d.responseText) : d.readyState === XMLHttpRequest.DONE && (b ? b(d.responseText) : console.log("error occurred with no errorCallback set."))
        };

        return d;
    }

    var e = {}, k = {}, f = "http://127.0.0.1:9100/";
    0 <= navigator.userAgent.indexOf("Trident/7.0") && "https:" === location.protocol && (f = "https://localhost:9101/");
    e.Device = function (a) {
        var d = this;
        this.name = a.name;
        this.deviceType = a.deviceType;
        this.connection = a.connection;
        this.uid = a.uid;
        this.version = 2;
        this.provider = a.provider;
        this.manufacturer = a.manufacturer;
        this.sendErrorCallback = function (c) {
        };
        this.sendFinishedCallback = function (c) {
        };
        this.send = function (c, a, l) {
            var b = g("POST", f + "write");
            b && (h(d, b, a, l), b.send(JSON.stringify({
                device: {
                    name: this.name,
                    uid: this.uid,
                    connection: this.connection,
                    deviceType: this.deviceType,
                    version: this.version,
                    provider: this.provider,
                    manufacturer: this.manufacturer
                }, data: c
            })))
        };
        this.sendUrl = function (c, a, l) {
            var b = g("POST", f + "write");
            b && (h(d, b, a, l), b.send(JSON.stringify({
                device: {
                    name: this.name,
                    uid: this.uid,
                    connection: this.connection,
                    deviceType: this.deviceType,
                    version: this.version,
                    provider: this.provider,
                    manufacturer: this.manufacturer
                }, url: c
            })))
        };
        this.readErrorCallback = function (c) {
        };
        this.readFinishedCallback = function (c) {
        };
        this.read = function (c, a) {

            var b = g("POST", f + "read");


            b && (h(d, b, c, a), b.send(JSON.stringify({
                device: {
                    name: this.name,
                    uid: this.uid,
                    connection: this.connection,
                    deviceType: this.deviceType,
                    version: this.version,
                    provider: this.provider,
                    manufacturer: this.manufacturer
                }
            })));

        };
        this.sendThenRead = function (a, b, d) {

            this.send(a, function (a) {

                return function () {

                   // var myVal = a.read(b, d);
                   // console.log("myVal: " + myVal);
                   //  return myVal;

                }

            }(this), d)

        }
    };
    e.ApplicationConfiguration = function () {
        this.application = {version: "1.2.0.3", build_number: 3, api_level: 2, platform: ""}
    };
    e.getLocalDevices = function (a,
                                  d, c) {
        var b = g("GET", f + "available");
        b && (finishedFunction = function (b) {
            response = b;
            response = JSON.parse(response);
            for (var d in response) if (response.hasOwnProperty(d) && response[d].constructor === Array) for (arr = response[d], b = 0; b < arr.length; ++b) arr[b] = new e.Device(arr[b]);
            void 0 == c ? a(response) : (response.hasOwnProperty(c) || (response[c] = []), a(response[c]))
        }, h(void 0, b, finishedFunction, d), b.send())
    };
    e.getDefaultDevice =  function (a, d, c) {
        var b = "default";
        void 0 != a && null != a && (b = b + "?type=" + a);
        if (a = g("GET", f + b)) finishedFunction =
            function (a) {
                response = a;
                "" == response ? d(null) : (response = JSON.parse(response), a = new e.Device(response), d(a))
            }, a = h(void 0, a, finishedFunction, c), a.send()
    };
    e.getApplicationConfiguration = function (a, d) {
        var c = g("GET", f + "config");
        c && (finishedFunction = function (b) {
            response = b;
            "" == response ? a(null) : (response = JSON.parse(response), a(response))
        }, h(void 0, c, finishedFunction, d), c.send())
    };
    e.readOnInterval = function (a, d, c) {
        if (void 0 == c || 0 == c) c = 1;
        readFunc = function () {
            a.read(function (b) {
                    d(b);
                    k[a] = setTimeout(readFunc, c)
                },
                function (b) {
                    k[a] = setTimeout(readFunc, c)
                })
        };
        k[a] = setTimeout(readFunc, c)
    };
    e.stopReadOnInterval = function (a) {
        k[a] && clearTimeout(k[a])
    };
    e.bindFieldToReadData = function (a, d, c, b) {
        e.readOnInterval(a, function (a) {
            "" != a && (d.value = a, void 0 != b && null != b && b())
        }, c)
    };
    return e
}();
