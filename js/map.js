var width = 960;
var height = 500;
var container = d3.select("#map");
var svg = container.append("svg");
var aspect = width / height;
var projection = d3.geoAlbersUsa().translate([width / 2, height / 2]);
var path = d3.geoPath(projection);

// load the external svg from a file


svg.attr("width", width)
  .attr("height", height);


svg.attr("viewBox", "0 0 " + width + " " + height)
  .attr("perserveAspectRatio", "xMinYMid meet")
  .call(resize);

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.json("assets/data/us.json", function(us) {

  svg.append("g").selectAll(".states")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("class", "states")
    .attr("d", path);

  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) {
      return a !== b;
    }))
    .attr("class", "state-borders")
    .attr("d", path);
  //load marker
  d3.xml("assets/map-marker.svg", function(xml) {
    var marker = document.importNode(xml.documentElement, true);

    //load data
    d3.json("https://map.ou.lc/api/posts/all", function(data) {
      var timeline = d3.select('#social-content').selectAll('div')
                        .data(data).enter()
                        .append('div')
                        .attr('id', function(p){return "post-" +p.slug})
                        .html(function(post){
                          if(post.social.length > 0){
                            var s = document.createElement("script");
                            s.src = (post.social[0].type == "instagram") ? "https://www.instagram.com/embed.js" : "https://platform.twitter.com/widgets.js";
                            s.async = true;
                            this.appendChild(s);
                          }
                          return ("<h3 id='location' class='display-4'>" + post.geo.suburb +"</h3>" + (post.social.length > 0 ? post.social[0].embed:""));
                        });
      var markers = svg.selectAll("marker")
        .data(data.filter(e => e.geo?((e.geo.geo[0] || e.geo.geo[1]) != 0):false)).enter()
        .append('svg')
        .attr("class", "marker")
        .append("g")
        .each(function() {
          this.appendChild(marker.cloneNode(true).children[0]);
        })
        .attr("id", function(e){ return e.slug})
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut)
        .on("click", mouseClick)

        // .attr("transform", function(post) {
        //   var scale = 0.15;
        //   return "translate(" + (projection(post.geo.geo)[0] - scale * this.getBBox().width / 2) + "," + (-Math.random() * 1000) + ")scale(" + scale + "," + scale + ")";
        // })
        .attr("transform", function(post) {
          var scale = 0.15;
          return "translate(" + (projection(post.geo.geo)[0]) + "," + (-Math.random() * 1000) + ")scale(" + scale + "," + scale + ")";
        })
        .transition()
        .ease(d3.easeBounce)
        .duration(1500)
        // .attr("transform", function(post) {
        //   var scale = 0.05;
        //   return "translate(" + (projection(post.geo.geo)[0] - scale * this.getBBox().width / 2) + "," + (projection(post.geo.geo)[1] - scale * this.getBBox().height) + ")scale(" + scale + "," + scale + ")";
        // });
        .attr("transform", function(post) {
          var scale = 0.05;
          return "translate(" + (projection(post.geo.geo)[0]) + "," + (projection(post.geo.geo)[1]) + ")scale(" + scale + "," + scale + ")";
        });

      function mouseOver(e, i) {
          tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(e.title + "<br/>" + e.geo.suburb + " " + e.geo.state)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
          var transform = d3.select(this).attr("transform");
          d3.select(this).attr("transform", function(d){
              console.log(this);
              return getTransform(transform, "translate") + getTransform(transform, "scale", [0.05, 0.05]);
          });

      }
      function mouseClick(e, i) {
        var top = document.getElementById("post-"+e.slug).offsetTop;
        var ele = document.getElementById("social-content");
        ele.scrollTo(0, top);
      }
      function mouseOut(d, i) {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
            var transform = d3.select(this).attr("transform");
            d3.select(this).attr("transform", getTransform(transform, "translate") + getTransform(transform, "scale", [-0.05, -0.05]));
      }
    });
  });
});

function getTransform(str, mode, delta = [0,0]){
   var value = str.match(new RegExp(mode + "\\(([^)]+)\\)"))[1].split(",");
     return(mode + "(" + value.map(function(e,i){ return Number(e) + Number(delta[i])}).join(',') + ")");
}

function resize() {
  var targetWidth = parseInt(container.style("width"));
  svg.attr("width", targetWidth);
  svg.attr("height", Math.round(targetWidth / aspect));
}
d3.select(window).on("resize." + container.attr("id"), resize);
