$(document).on("keydown", function(e) {
	if (e.which == 27) {
		$("#popup").css("display", "none");
	}
});

$(document).ready(function() {
  $("#popup").click(function() {
	  $(this).css("display", "none");
  });
  $("#popup").on("click", "div", function() {
  	  return false;
  });

  $("#tabbar > div > a").click(function() {
	  $("#tabbar > div > a").removeClass("ativo");
	  $(this).addClass("ativo");

	  var r = $(this).attr("href");
	  if (r == "#movies-result") {
		  $("#series-result").hide();
	  } else {
		  $("#movies-result").hide();
	  }
	  $(r).show();
	  return false;
  });

  $("#movies-result, #series-result").on("mouseenter mouseleave", '.api_detail', function() {
	  $(this).children().toggle();
  });

  function buscarFilmes() {
    $("#movies-result").html("Loading...");
    var movies = [];
    $.getJSON("https://yts.ag/api/v2/list_movies.json", $("form[name=buscar]").serialize(), function(data) {
      $.each(data["data"]["movies"], function(key, val) {
        movies.push(val);
      });
      $("#movies-result").html("");
      $.each(movies, function(key, val) {
	    var bgimage = movies[key]["medium_cover_image"];
        $("#movies-result").append("<div class='cover' style='background-image: url("+ bgimage +"); background-repeat: no-repeat;background-size: cover;'><div class='previnfo'><a class='api_detail' href='#popup' data-url='https://yts.ag/api/v2/movie_details.json?movie_id=" + movies[key]["id"] + "'><h2>" + movies[key]["title"] + "</h2></a></div></div>");
      });
    });
  }

  function buscarSeries() {
    $("#series-result").html("Loading...");
    var series = [];
    $.getJSON("http://eztvapi.re/shows/1", {
      "keywords": $("input[name=query_term]").val()
    }, function(data) {
      $.each(data, function(key, val) {
        series.push(val);
      });
      $("#series-result").html("")
      $.each(series, function(key, val) {
	    var poster = series[key]["images"]["poster"];
        $("#series-result").append("<div class='cover' style='background-image: url("+ poster +"); background-repeat: no-repeat;background-size: cover;'><div class='previnfo'><a class='api_detail' href='#popup' data-url='http://eztvapi.re/show/" + series[key]["imdb_id"] + "?sort=updated'><h2>" + series[key]["title"] + "</h2></a></div></div>");
      });
    });
  }

  //
  //$("#tabbar").show();
  $("#popup").hide();
  $("#content").show();
  buscarFilmes();
  //buscarSeries();
  //
  $("input[name=buscar]").click(function() {
    $("form[name=buscar]").submit(function(e) {
      e.preventDefault();
      //$("#tabbar").show();
      $("#popup").hide();
      $("#content").show();
      buscarFilmes();
      //buscarSeries();
    });
  });

  $("#movies-result").on("click", ".api_detail", function(e) {
    e.preventDefault();
    $("#popup").show();
    $("#popup").html("<div>Loading...</div>");
    var popup = $("#popup > div");
    $.getJSON($(this).attr("data-url"), function(data_t) {
      popup.html("");
      var data = data_t["data"]["movie"];
      popup.append("<h2>" + data["title"] + "</h2>");
      popup.append("<p>" + data["description_full"] + "</p>")
      var trackers = "&tr=http://9.rarbg.com:2710/announce&tr=http://announce.torrentsmd.com:6969/announce&tr=http://bt.careland.com.cn:6969/announce&tr=http://explodie.org:6969/announce&tr=http://mgtracker.org:2710/announce&tr=http://tracker.best-torrents.net:6969/announce&tr=http://tracker.tfile.me/announce&tr=http://tracker.torrenty.org:6969/announce&tr=http://tracker1.wasabii.com.tw:6969/announce&tr=udp://9.rarbg.com:2710/announce&tr=udp://9.rarbg.me:2710/announce&tr=udp://coppersurfer.tk:6969/announce&tr=udp://exodus.desync.com:6969/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.btzoo.eu:80/announce&tr=udp://tracker.istole.it:80/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://tracker.prq.to/announce&tr=udp://tracker.publicbt.com:80/announce"
      $.each(data["torrents"], function(key, val) {
        var magnet = "magnet:?xt=urn:btih:" + val["hash"] + "&dn=" + data["title_long"] + trackers
        popup.append("<p><a href='" + magnet + "'>Download (" + val["quality"] + ")</a></p>")
      });
    });
    return false;
  });

  $("#series-result").on("click", ".api_detail", function(e) {
    e.preventDefault();
    $("#popup").show();
    $("#popup").html("<div>Loading...</div>");
    var popup = $("#popup > div");
    $.getJSON($(this).attr("data-url"), function(data) {
      popup.html("");
      popup.append("<h2>" + data["title"] + "</h2>");
      var episodios = {};
      $.each(data["episodes"], function(key, val) {
        if (!episodios[val["season"]]) {
          episodios[val["season"]] = [];
        }
        episodios[val["season"]].push(val);
      });
      $.each(episodios, function(key, val) {
        $.each(val, function(k, v) {
          popup.append("<div><h3>" + v["title"] + "</h3><p>Temporada: " + v["season"] + ", Episódio: " + v["episode"] + "</p>");
          $.each(v["torrents"], function(k, v) {
            if (k == "0") {
              popup.append("<p><a href='" + v["url"] + "'>Download (std)</a></p>")
            } else {
              popup.append("<p><a href='" + v["url"] + "'>Download (" + k + ")</a></p>")
            }
          });
          popup.append("</div>")
        });
      });
    });
    return false;
  });
});
