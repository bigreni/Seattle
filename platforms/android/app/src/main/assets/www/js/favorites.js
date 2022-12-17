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
            url: "https://www.rtd-denver.com/api/nextride/stops/" + stop,
            //contentType: "application/json;	charset=utf-8",
            dataType: "json",
            success: function (output) {
                if (output == null || output.length == 0) {
                    $(outputContainer).html('').hide(); // reset output container's html
                }

              else {
                      results = results.concat("<p><strong>" + text + "</strong></p>");
                      results = results.concat('<table id="tblResults" cellpadding="0" cellspacing="0">')
                      results = results.concat('<tr class="header"><th>ROUTE</th><th>ARRIVAL</th></tr><tr><td class="spacer" colspan="2"></td></tr>');
                      var trips = (output.data.attributes.childStops) ? output.data.attributes.childStops[0].routePatterns : output.data.attributes.routePatterns;
                     for(var i=0; i<trips.length;i++)
                     {
                      if(trips[i].directionId==parseInt(dir))
                      {
                          var item = trips[i].tripStops;
                          var maxlength = (item.length>2)? 3: item.length;
                          for(var index=0; index<maxlength; index++)
                          {
                              var arrivalTime = (item[index].predicted_arrival_time && item[index].predicted_arrival_time!=null) ? Math.floor(((item[index].predicted_arrival_time) - Date.now()/1000)/60) : Math.floor(((item[index].scheduled_arrival_time) - Date.now()/1000)/60);
                              results = results.concat('<tr class="predictions">');
                              results = results.concat("<td>" + item[index].route_short_name + " - " + item[index].trip_headsign + "</td>"  + "<td>" + arrivalTime + " minutes</td>");
                              results = results.concat('</tr><tr><td class="spacer" colspan="2"></td></tr>');         
                          }
                      }
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

