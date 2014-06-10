function initPusher() {
    var a = new Pusher("48a8d44b7f4da8cb36bf");
    var b = a.subscribe("tweets");
    b.bind("tweet", function(a) {
        displayTweet(a)
    });
    a.connection.bind("error", function(b) {
        a.disconnect();
        loadStats();
        setInterval("loadStats()", 3e4)
    });
    a.connection.bind("unavailable", function() {
        a.disconnect();
        loadStats();
        setInterval("loadStats()", 3e4)
    });
    a.connection.bind("failed", function() {
        a.disconnect();
        loadStats();
        setInterval("loadStats()", 3e4)
    });
    a.connection.bind("disconnected", function() {
        a.disconnect();
        loadStats();
        setInterval("loadStats()", 3e4)
    })
}
function pageTransition(a, b) {
    if ($("#content section.active").length) {
        $("#content section.active").fadeOut(function() {
            $(this).removeClass("active");
            $("a.current").removeClass("current");
            $('a[href="/#!/' + a + '/"]').addClass("current");
            if (b != null) {
                $("#content section#" + a).html(b);
                $pauseNav = false
            } else {
                $("#content section#" + a).fadeIn(function() {
                    $(this).addClass("active");
                    $pauseNav = false
                })
            }
        })
    } else {
        $('a[href="/#!/' + a + '/"]').addClass("current");
        if (b != null)
            $("#content section#" + a).html(b);
        else {
            if ($("#content").hasClass("loading"))
                $("#content").removeClass("loading");
            $("#content section#" + a).fadeIn(function() {
                $(this).addClass("active");
                $pauseNav = false
            })
        }
    }
}
function loadStats() {
    var a = "retrieve=true&created_at=" + $created_at;
    $
            .post("inc/process.php", a,
                    function(a) {
                        if (a.result == "success") {
                            var b = 3e4 / a.tweets.length;
                            if (navigator.userAgent.toLowerCase().indexOf(
                                    "chrome") > -1)
                                console.log("timeout > " + b + " | count > "
                                        + a.tweets.length);
                            var c;
                            for (c = 0; c < a.tweets.length; c++) {
                                displayTweetTimeout(a.tweets[c], b * c)
                            }
                            $created_at = a.tweets[c - 1]["created_at"]
                        } else {
                        }
                    }, "json")
}
function displayTweetTimeout(a, b) {
    setTimeout(function() {
        displayTweet(a)
    }, b)
}
function displayTweet(a) {
    if (a["keyword"] == "homo") {
        $todayHomo++;
        $("#today-homo").html(formatNumber($todayHomo))
    } else if (a["keyword"] == "gay") {
        $todayGay++;
        $("#today-gay").html(formatNumber($todayGay))
    } else if (a["keyword"] == "fag") {
        $todayFag++;
        $("#today-fag").html(formatNumber($todayFag))
    } else {
        $todayDyke++;
        $("#today-dyke").html(formatNumber($todayDyke))
    }
    if (a["geo"] != "") {
        if ($map) {
            var b = a["geo"].split(",");
            var c = new google.maps.LatLng(b[0], b[1]);
            var d = {
                position : c,
                icon : "/img/map-icon-" + a["keyword"] + ".png",
                map : $map
            };
            $bounds.extend(c);
            var e = new google.maps.Marker(d);
            var f = $bounds.getCenter();
            $map.setCenter(f);
            $map.fitBounds($bounds)
        } else {
            $mapList.push(new Array(a["geo"], a["keyword"]))
        }
    }
    var g = {
        homo : $todayHomo,
        gay : $todayGay,
        fag : $todayFag,
        dyke : $todayDyke
    }, h = Object.keys(g);
    h.sort(function(a, b) {
        return g[b] - g[a]
    });
    for ( var i = 0; i < h.length; i++) {
        if (i == 0)
            $(".today-wrapper ." + h[i]).animate({
                top : 0,
                left : 0
            });
        else if (i == 1)
            $(".today-wrapper ." + h[i]).animate({
                top : 0,
                left : 500
            });
        else if (i == 2)
            $(".today-wrapper ." + h[i]).animate({
                top : 165,
                left : 0
            });
        else
            $(".today-wrapper ." + h[i]).animate({
                top : 165,
                left : 500
            })
    }
    if (!$pauseTweets) {
        var j = "even";
        if ($even)
            j = "odd";
        $("#tweets").prepend(
                '<li class="new ' + j + '"><a class="' + a["keyword"]
                        + '" href="https://twitter.com/' + a["screen_name"]
                        + "/status/" + a["id"] + '" target="_blank"><img src="'
                        + a["profile_image_url"]
                        + '" height="48" width="48" alt="' + a["screen_name"]
                        + '" /><span class="name">' + a["user_name"]
                        + '</span><span class="username">@' + a["screen_name"]
                        + '</span><span class="created-at" data-created-at="'
                        + a["created_at"] + '"></span><span class="text">'
                        + a["text"]
                        + '</span><span class="arrow"></span></li></a>');
        if ($even) {
            $("#tweets span.created-at").each(function() {
                var a = $(this).data("created-at");
                a = a.replace(/-/, "/").replace(/-/, "/");
                var b = new Date(a);
                var c = UTCTime();
                var d = (c.getTime() - b.getTime()) * .001;
                if (d < 1)
                    d = 1;
                $(this).html(d + "s ago")
            });
            $("#tweets .new").show().animate({
                marginTop : 0
            }, function() {
                $(this).removeClass("new")
            });
            $("#tweets li:gt(11)").fadeOut(function() {
                $(this).remove()
            });
            $even = false
        } else
            $even = true
    }
}
function UTCTime() {
    var a = new Date;
    var b = new Date(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a
            .getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds());
    return b
}
function UTCStartTime() {
    var a = new Date;
    a.setHours(0, 0, 0);
    a = new Date(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate(), a
            .getUTCHours(), a.getUTCMinutes(), a.getUTCSeconds());
    return a
}
function formatNumber(a) {
    return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
var $todayLoaded = false, $lastWeekLoaded = false, $allTimeLoaded = false, $aboutLoaded = false, $mapLoaded = false, $created_at, $even = false, $pauseTweets = false, $todayHomo = 0, $todayGay = 0, $todayFag = 0, $todayDyke = 0, $pauseNav = true, $today, $map = false, $bounds = false, $mapList = [];
$(function() {
    var a = Sammy("#content", function() {
        this.get("#!/today/", function() {
            pageTransition("today", null);
            _gaq.push([ "_trackPageview", "/#!/today/" ])
        });
        this.get("#!/last-week/", function() {
            if (!$lastWeekLoaded) {
                $("#content").addClass("loading");
                this.load("last-week").then(function(a) {
                    pageTransition("last-week", a);
                    $lastWeekLoaded = true
                })
            } else
                pageTransition("last-week", null);
            _gaq.push([ "_trackPageview", "/#!/last-week/" ])
        });
        this.get("#!/all-time/", function() {
            if (!$allTimeLoaded) {
                $("#content").addClass("loading");
                this.load("all-time").then(function(a) {
                    pageTransition("all-time", a);
                    $allTimeLoaded = true
                })
            } else
                pageTransition("all-time", null);
            _gaq.push([ "_trackPageview", "/#!/all-time/" ])
        });
        this.get("#!/about/", function() {
            if (!$aboutLoaded) {
                $("#content").addClass("loading");
                this.load("about").then(function(a) {
                    pageTransition("about", a);
                    $aboutLoaded = true
                })
            } else
                pageTransition("about", null);
            _gaq.push([ "_trackPageview", "/#!/about/" ])
        });
        this.get("#!/map/", function() {
            if (!$mapLoaded) {
                $("#content").addClass("loading");
                this.load("map").then(function(a) {
                    pageTransition("map", a);
                    $mapLoaded = true
                })
            } else
                pageTransition("map", null);
            _gaq.push([ "_trackPageview", "/#!/map/" ])
        })
    });
    a.run("#!/today/");
    $today = new Date;
    $("#today h2").html($today.format("F jS, Y"));
    var b = "retrieve=true&init=true&today_start="
            + UTCStartTime().format("Y-m-d H:i:s");
    $.post("inc/process.php", b, function(a) {
        if (a.result == "success") {
            $todayHomo = parseInt(a.todayHomo);
            $("#today-homo").html(formatNumber($todayHomo));
            $todayGay = parseInt(a.todayGay);
            $("#today-gay").html(formatNumber($todayGay));
            $todayFag = parseInt(a.todayFag);
            $("#today-fag").html(formatNumber($todayFag));
            $todayDyke = parseInt(a.todayDyke);
            $("#today-dyke").html(formatNumber($todayDyke));
            var b = {
                homo : $todayHomo,
                gay : $todayGay,
                fag : $todayFag,
                dyke : $todayDyke
            }, c = Object.keys(b);
            c.sort(function(a, c) {
                return b[c] - b[a]
            });
            for ( var d = 0; d < c.length; d++) {
                if (d == 0)
                    $(".today-wrapper ." + c[d]).animate({
                        top : 0,
                        left : 0
                    });
                else if (d == 1)
                    $(".today-wrapper ." + c[d]).animate({
                        top : 0,
                        left : 500
                    });
                else if (d == 2)
                    $(".today-wrapper ." + c[d]).animate({
                        top : 165,
                        left : 0
                    });
                else
                    $(".today-wrapper ." + c[d]).animate({
                        top : 165,
                        left : 500
                    })
            }
            $created_at = a.tweets[0]["created_at"];
            $("#tweet-wrapper").fadeIn();
            initPusher()
        } else {
        }
    }, "json");
    $("html").mousemove(function(a) {
        var b = a.pageY - $("#tweet-wrapper").offset().top - 16;
        if (b < 0)
            b = 0;
        else if (b > 928)
            b = 928;
        $("#pause").css({
            top : b
        })
    });
    $("#pause").click(function() {
        $(this).toggleClass("paused");
        $pauseTweets = !$pauseTweets;
        return false
    });
    var c = 0;
    $("a#logo").bind("mouseenter", function() {
        this.iid = setInterval(function() {
            c += 118;
            $("a#logo").css("background-position", "0px -" + c + "px")
        }, 250)
    }).bind("mouseleave", function() {
        this.iid && clearInterval(this.iid)
    });
    $("a.learn-more, nav a").click(function() {
        if ($pauseNav || $(this).hasClass("current"))
            return false;
        else
            $pauseNav = true
    })
});
Object.keys = Object.keys || function(a) {
    var b = [];
    for ( var c in a) {
        if (a.hasOwnProperty(c))
            b.push(c)
    }
    return b
}