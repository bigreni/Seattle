function loadFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    var arrStops = null;
    var arrIds;
    var text = "";
    for (i = 0; i < arrFaves.length; i++) 
    {
        arrStops = arrFaves[i].split("~");
        arrIds = arrStops[0].split(">");
        //arrText = arrStops[1].split(">");
        text = '<li><button onclick=removeFavorite(' + i + '); style="background-color:red; border:none;float:right; color:white;"><span class="glyphicon glyphicon-trash"></span></button><a href="javascript:loadFaveArrivals(' + "'" + arrIds[0] + "','" + arrIds[1] + "','" + arrIds[2] + "','" + arrStops[1].trim() + "'" + ');" class="langOption"><h4 class="selectLanguage">' + arrStops[1] + '</h4></a></li>';
	    $("#lstFaves").append(text);
    }
}

function removeFavorite(index)
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    if(arrFaves.length > 1)
    {
        arrFaves.splice(index, 1);
        var faves = arrFaves.join("|");
        localStorage.setItem("Favorites", faves);
    }
    else
    {
        localStorage.removeItem("Favorites");
    }
    location.reload();
}

function loadFaveArrivals(route, dir, stop, text)
{
    var outputContainer = $('.js-next-bus-results');
    var allRoutes = text.split(">")[0].trim();
    var results = "";
    $.ajax(
        {
            type: "GET",
            url: "https://api.pugetsound.onebusaway.org/api/where/arrivals-and-departures-for-stop/" + stop + ".json?minutesBefore=0&key=483eeac4-f72c-4e8f-b6f2-5de166ad166f",
            //contentType: "application/json;	charset=utf-8",
            dataType: "json",
            success: function (output) {
                if (output == null || output.length == 0) {
                    $(outputContainer).html('').hide(); // reset output container's html
                }

              else {
                      results = results.concat("<p><strong>" + text + "</strong></p>");
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
              //   }
            }
        });
}

