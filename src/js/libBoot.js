window.W = { version: "16.13.1", assets: "16.13.1.lib.c372", sha: "d4b3c372", target: "lib", build: "2018-10-26, 10:08" },
    /*! Copyright (c) Windyty SE, 2018 all rights reserved */
    function() { if (!window.W || !window.W.version) throw new Error("Missing global object W. Have you loaded libManifest?"); var i = "https://www.windy.com/v/" + W.assets;
        window.windyInit = function(i, a) { var s = i.key,
                d = new XMLHttpRequest;
            d.open("POST", "https://api4.windy.com/api4/auth", !0), d.setRequestHeader("Content-type", "application/json; charset=utf-8"), d.onload = function() { var t = JSON.parse(d.responseText),
                    e = t.auth,
                    n = t.paid,
                    o = t.domains,
                    r = t.apiUser;
                4 == d.readyState && parseInt(d.status) < 300 ? (window.W.windyBoot = { options: i, cb: a, auth: e, paid: n, apiUser: r }, u(s, o) ? c(e) : console.error("Windy API used on unauthorized domain")) : console.error("Not authorized") }, d.send(JSON.stringify({ key: s })) }; var u = function(t, e) { if (!e || !/\S+/.test(e)) return !0; var n = document.location,
                    o = n.hostname,
                    r = n.port; if (!/PsLAtXpsPTZexBwUkO7Mx5I/.test(t) && (80 < parseInt(r) || /localhost|127\.0\.0\.1/.test(o))) return !0; var i = e.split(",").map(function(t) { return t.trim() }).map(function(t) { return t.toLowerCase() }).map(function(t) { return new RegExp(t) }).filter(function(t) { return t.test(o) }); return !!(i && 0 < i.length) },
            c = function() { var t, e, n, o, r;
                t = "lib.css", (e = document.createElement("link")).rel = "stylesheet", e.href = i + "/" + t, document.head.appendChild(e), n = "lib.js", o = function() {}, (r = document.createElement("script")).type = "text/javascript", document.head.appendChild(r), r.async = !0, o && (r.onload = o), r.onerror = function() { return console.error("Failed to load Windy API's " + n) }, r.src = i + "/" + n } }();