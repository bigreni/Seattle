    var interstitial;
    
    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            notFirstUse();
        }
    }

  var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/8883651449'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/8716130486'
    };
  }

    function initApp() {
        if (!AdMob) { alert('admob plugin not ready'); return; }
        initAd();
        //display interstitial at startup
        loadInterstitial();
    }
    function initAd() {
        var defaultOptions = {
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            bgColor: 'black', // color name, or '#RRGGBB'
            isTesting: false // set to true, to receiving test ad for testing purpose
        };
        AdMob.setOptions(defaultOptions);
        registerAdEvents();
    }
    // optional, in case respond to events or handle error
    function registerAdEvents() {
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            document.getElementById("screen").style.display = 'none';     
        });
        document.addEventListener('onAdLoaded', function (data) {
            document.getElementById("screen").style.display = 'none';     
        });
        document.addEventListener('onAdPresent', function (data) { });
        document.addEventListener('onAdLeaveApp', function (data) { 
            document.getElementById("screen").style.display = 'none';     
        });
        document.addEventListener('onAdDismiss', function (data) {
           document.getElementById("screen").style.display = 'none';     
        });
    }

    function createSelectedBanner() {
          AdMob.createBanner({adId:admobid.banner});
    }

    function loadInterstitial() {
        if ((/(android|windows phone)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: true, autoShow: false });
            //document.getElementById("screen").style.display = 'none';     
        } else if ((/(ipad|iphone|ipod)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: true, autoShow: false });
            //document.getElementById("screen").style.display = 'none';     
        } else
        {
            document.getElementById("screen").style.display = 'none';     
        }
    }

   function checkFirstUse()
    {
        //loadRoutes();
        $("span").remove();
        $(".dropList").select2();
        checkConsent();
        initApp1();
        //checkPermissions();
        //document.getElementById('screen').style.display = 'none';     
        askRating();

    }

    function notFirstUse()
    {
        //loadRoutes();
        $("span").remove();
        $(".dropList").select2();
        document.getElementById("screen").style.display = 'none';     
    }

function loadFaves()
{
    //showAd();
    showAd1();
    window.location = "Favorites.html";
}

async function checkConsent(){
    if (cordova.platformId === 'ios') {
        const status = await consent.trackingAuthorizationStatus()
        /*
          trackingAuthorizationStatus:
          0 = notDetermined
          1 = restricted
          2 = denied
          3 = authorized
        */
        const statusNew = await consent.requestTrackingAuthorization()
      }
    
      const consentStatus = await consent.getConsentStatus()
      if (consentStatus === consent.ConsentStatus.Required) {
        await consent.requestInfoUpdate()
      }
    
      const formStatus = await consent.getFormStatus()
      if (formStatus === consent.FormStatus.Available) {
          const form = await consent.loadForm()
          form.show()
      }
}


function checkPermissions(){
    const idfaPlugin = cordova.plugins.idfa;

    idfaPlugin.getInfo()
        .then(info => {
            if (!info.trackingLimited) {
                return info.idfa || info.aaid;
            } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
                return idfaPlugin.requestPermission().then(result => {
                    if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
                        return idfaPlugin.getInfo().then(info => {
                            return info.idfa || info.aaid;
                        });
                    }
                });
            }
        });
}
 
    
function askRating()
{
    const appRatePlugin = AppRate;
    appRatePlugin.setPreferences({
        reviewType: {
            ios: 'AppStoreReview',
            android: 'InAppBrowser'
            },
  useLanguage:  'en',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: true,
  storeAppURL: {
                ios: '1660409176',
                android: 'market://details?id=com.seattle.free'
               }
});
 
AppRate.promptForRating(false);
}

function showAd()
{
    document.getElementById("screen").style.display = 'block';     
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        AdMob.isInterstitialReady(function(isready){
            if(isready) 
                AdMob.showInterstitial();
        });
    }
    document.getElementById("screen").style.display = 'none'; 
}

function loadRoutes()
{
    var list = $("#routeSelect");
    $(list).empty();
    $(list).append($("<option disabled selected/>").val("0").text("- Select Route -"));
    $.ajax(
        {
            type: "GET",
            url: "https://api.pugetsound.onebusaway.org/api/where/routes-for-agency/" + $("#agencySelect").val()  + ".json?key=483eeac4-f72c-4e8f-b6f2-5de166ad166f",
            //contentType: "application/json;	charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var routes = msg.data.list;
                for(var i=0; i<routes.length; i++)
                {
                    $(list).append($("<option />").val(routes[i].id).text(routes[i].shortName + " - " + routes[i].description));
                }
            //$(list).removeAttr('disabled');
            $(list).val('0');
            },
            error: function () {
            }
            
        }
      );
      $("span").remove();
      $(".dropList").select2();
}

var routeStops;

function loadDirections() {
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#routeStopSelect").attr("disabled", "");
    $("#routeStopSelect").val('0');
    $("#message").text('');
    $.ajax(
        {
            type: "GET",
            url: "https://api.pugetsound.onebusaway.org/api/where/stops-for-route/" + $("#routeSelect").val() + ".json?key=483eeac4-f72c-4e8f-b6f2-5de166ad166f",
            //contentType: "application/json;	charset=utf-8",
            dataType: "json",
            success: function (msg) {
                processDirections(msg);
            },
            error: function () {
            }
        }
      );
        $("span").remove();
        $(".dropList").select2();
    }

    function processDirections(n)
    {
        var list = $("#routeDirectionSelect");
        routeStops = n;
        var directions = routeStops.data.entry.stopGroupings[0].stopGroups;
        $(list).empty();
        $(list).append($("<option disabled/>").val("0").text("- Select Direction -"));
        for(var i=0; i<directions.length; i++)
        {
            $(list).append($("<option />").val(directions[i].id).text(directions[i].name.name));
        }
        $(list).removeAttr('disabled');
        $(list).val('0');
}

function loadStops() {
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#message").text('');
    processStops();
        $("span").remove();
        $(".dropList").select2();
}

function processStops()
{
    var stopList = $("#routeStopSelect");
    $(stopList).empty();
    $(stopList).append($("<option disabled/>").val("0").text("- Select Stop -"));
    var dirStops = routeStops.data.entry.stopGroupings[0].stopGroups.filter(function(item){
        return item.id == $("#routeDirectionSelect").val();
    });
    var allRoutes = routeStops.data.references.stops.filter(item => dirStops[0].stopIds.includes(item.id));
    for(i=0; i<allRoutes.length; i++)
    {
        $(stopList).append($("<option />").val(allRoutes[i].id).text(allRoutes[i].name));
    }
    $(stopList).removeAttr('disabled');
    $(stopList).val('0');
}

function loadArrivals() {
// var allRoutes = document.getElementById('allRoutes');
var outputContainer = $('.js-next-bus-results');
    var results = "";
    showAd1();
    $.ajax(
          {
              type: "GET",
              url: "https://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/" + $("#routeStopSelect").val() + ".json?minutesBefore=0&key=483eeac4-f72c-4e8f-b6f2-5de166ad166f",
              //contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (output) {
                  if (output == null || output.length == 0) {
                      $(outputContainer).html('').hide(); // reset output container's html
                      document.getElementById('btnSave').style.visibility = "hidden";
                  }

                else {
                        results = results.concat("<p><strong>" + $("#routeSelect option:selected").text()  + " - " + $("#routeDirectionSelect option:selected").text() + " - " + $("#routeStopSelect option:selected").text() + "</strong></p>");
                        results = results.concat('<table id="tblResults" cellpadding="0" cellspacing="0">')
                        results = results.concat('<tr class="header"><th>ROUTE</th><th>DESTINATION</th><th>ARRIVAL</th></tr><tr><td class="spacer" colspan="3"></td></tr>');
                        var trips = output.data.entry.arrivalsAndDepartures;
                       for(var i=0; i<trips.length;i++)
                       {

                                var arrivalTime = (trips[i].predicted) ? Math.round((trips[i].predictedArrivalTime - Date.now())/60000) : Math.round((trips[i].scheduledArrivalTime - Date.now())/60000);
                                results = results.concat('<tr class="predictions">');
                                results = results.concat("<td>" + trips[i].routeShortName + "</td><td>" + trips[i].tripHeadsign + "</td>"  + "<td>" + arrivalTime + " minutes</td>");
                                results = results.concat('</tr><tr><td class="spacer" colspan="3"></td></tr>');         
                       }
                      results = results + "</table>";
                      }

                      if (results == "") {
                          results = results.concat("<p> No upcoming arrivals.</p>");
                      }
                      $(outputContainer).html(results).show();
                      document.getElementById('btnSave').style.visibility = "visible";
                //   }
              }
          });
}

function saveFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    // var allRoutes = document.getElementById("allRoutes");
    // var routeText = (allRoutes.checked) ? "All" : $('#routeSelect option:selected').text();
    var newFave = $('#routeSelect option:selected').val() + ">" + $("#routeDirectionSelect option:selected").val() + ">" + $("#routeStopSelect option:selected").val() + "~" + $('#routeSelect option:selected').text() + " > " + $("#routeDirectionSelect option:selected").text() + " > " + $("#routeStopSelect option:selected").text();
        if (favStop == null)
        {
            favStop = newFave;
        }   
        else if(favStop.indexOf(newFave) == -1)
        {
            favStop = favStop + "|" + newFave;               
        }
        else
        {
            $("#message").text('Stop is already favorited!!');
            return;
        }
        localStorage.setItem("Favorites", favStop);
        $("#message").text('Stop added to favorites!!');
}

function initApp1()
{
    if (/(android)/i.test(navigator.userAgent)){
    interstitial = new admob.InterstitialAd({
        //dev
        //adUnitId: 'ca-app-pub-3940256099942544/1033173712'
        //prod
        adUnitId: 'ca-app-pub-9249695405712287/9394686476'
      });
    }
    else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        interstitial = new admob.InterstitialAd({
            //dev
            adUnitId: 'ca-app-pub-3940256099942544/4411468910'
            //prod
            //adUnitId: 'ca-app-pub-9249695405712287/1324624766'
          });
    }
    registerAdEvents1();
    interstitial.load();
}

function registerAdEvents1() {
    // new events, with variable to differentiate: adNetwork, adType, adEvent
    document.addEventListener('admob.ad.load', function (data) {
        document.getElementById("screen").style.display = 'none';     
    });
    document.addEventListener('admob.ad.loadfail', function (data) {
        document.getElementById("screen").style.display = 'none';     
    });
    document.addEventListener('admob.ad.show', function (data) { 
        document.getElementById("screen").style.display = 'none';     
    });
    document.addEventListener('admob.ad.dismiss', function (data) {
       document.getElementById("screen").style.display = 'none';     
    });
}

function showAd1()
{
    document.getElementById("screen").style.display = 'block';     
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        interstitial.show();
    }
    document.getElementById("screen").style.display = 'none'; 
}