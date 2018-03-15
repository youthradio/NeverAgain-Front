var width = 960;
var height = 500;
var container = d3.select("#map");
var svg = container.append("svg");
var aspect = width / height;
var projection = d3.geoAlbersUsa().translate([width / 2, height / 2]);
var path = d3.geoPath(projection);

// load the external svg from a file
const MARKER_S_MIN = 0.07
const MARKER_S_MAX = 0.15

svg.attr("width", width)
  .attr("height", height);


svg.attr("viewBox", "0 0 " + width + " " + height)
  .attr("perserveAspectRatio", "xMinYMid meet")
  .call(resize);

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.select('#splash-button').on('click',function(){
  d3.select("#splash-bg").style("position","absolute")
     .style("top","0px")
     .transition()
     .duration(1000)
     .ease(d3.easeBack)
     .style("top", function(){ return this.offsetHeight + "px" })
     .on("end", function(){
       this.style.display = 'none';
     });
});

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
    d3.json("https://neveragain.youthradio.org/api/posts", function(error, data) {
      if (error) return console.log(error);

      var index = [];
      var timeline = d3.select('#social-content').selectAll('div').select('div')
                        .data(data.filter(function(e){ return (e.geo ? ((e.geo.geo[0] || e.geo.geo[1]) != 0) : false); }))
                        .enter()
                        .append('div')
                        .attr('class', 'post')
                        .attr('id', function(p){
                          var id = p.slug;
                          index.push("id-" + id);
                          return "post-id-" + id;
                        })
                        .attr('data-social', function(post){ if(post.social.length > 0){ return post.social[0].type }})
                        .html(function(post){
                        //  return ("");
                          return ("<h3 class='display-4'>" + post.geo.suburb +"</h3>" + (post.social.length > 0 ? post.social[0].embed:""));
                        });

      const scrs = ["https://www.instagram.com/embed.js", "https://platform.twitter.com/widgets.js"];
      scrs.forEach(function(src){
        var s = document.createElement("script");
        s.src = src;
        s.async = true;
        document.getElementById('social-content').appendChild(s);
      });

      var markers = svg.selectAll("marker")
        .data(data.filter(function(e){ return (e.geo ? ((e.geo.geo[0] || e.geo.geo[1]) != 0) : false); }))
        .enter()
        .append('svg')
        .attr("class", function(e){ return "marker marker-" + e.category })
        .append("g")
        .each(function() {
          this.appendChild(marker.cloneNode(true).children[0]);
        })
        .attr("id", function(e){ return "id-" + e.slug})
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut)
        .on("click", mouseClick)

        .attr("transform", function(post) {
          return "translate(" + (projection(post.geo.geo)[0]) + "," + (-Math.random() * 1000) + ")scale(" + MARKER_S_MAX + "," + MARKER_S_MAX + ")";
        })
        .transition()
        .ease(d3.easeBounce)
        .duration(1500)

        .attr("transform", function(post) {
          return "translate(" + (projection(post.geo.geo)[0]) + "," + (projection(post.geo.geo)[1]) + ")scale(" + MARKER_S_MIN + "," + MARKER_S_MIN + ")";
        });

      var scrollEvent = d3.select(window).on("wheel.zoom",mouseWheelScrool);
      function mouseWheelScrool(e){
        d3.event.preventDefault();
        var ele = document.getElementById("social-content");
        ele.scrollTop += d3.event.deltaY;
      }

      var currentPostId = -1;
      var lastPostId = -1;
      document.getElementById("social-content").addEventListener("scroll", function (event) {
        var box = this;
        var h = box.getBoundingClientRect().height;
        index.forEach(function(p,i){
          var visibleEle = document.getElementById("post-" + p);
          var visibleElerec = visibleEle.getBoundingClientRect();
          if((box.scrollTop + h/2) >= visibleEle.offsetTop && (box.scrollTop + h/2) <= (visibleEle.offsetTop + visibleElerec.height) && currentPostId !== i){
            lastPostId = currentPostId;
            currentPostId = i;

            var markerOn = d3.select("#" + p);
            var transform = markerOn.attr("transform");
            var scaleV = 0.08;
            markerOn
              .attr("transform", setTransform("translate", getTransform(transform, "translate")) + setTransform("scale", [MARKER_S_MIN, MARKER_S_MIN]))
              .transition()
              .ease(d3.easeExp)
              .duration(800)
              .attr("transform", setTransform("translate", getTransform(transform, "translate")) + setTransform("scale", [MARKER_S_MAX, MARKER_S_MAX]));

            if(lastPostId !== -1){
              var markerOff = d3.select("#" + index[lastPostId]);
              var transformOff = markerOff.attr("transform");
              markerOff
                .attr("transform", setTransform("translate", getTransform(transformOff, "translate")) + setTransform("scale", [MARKER_S_MAX, MARKER_S_MAX]))
                .transition()
                .ease(d3.easeExp)
                .duration(800)
                .attr("transform", setTransform("translate", getTransform(transformOff, "translate")) + setTransform("scale", [MARKER_S_MIN, MARKER_S_MIN]));
            }
          }
        });
      })

      function mouseOver(e, i) {
          tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(e.title + "<br/>" + e.geo.suburb + " " + e.geo.state)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
          var transform = d3.select(this).attr("transform");
          var scaleV = 0.06;
          d3.select(this).attr("transform", setTransform("translate", getTransform(transform, "translate")) + setTransform("scale", [MARKER_S_MAX, MARKER_S_MAX]));

      }
      function mouseClick(e, i) {
        var top = document.getElementById("post-id-"+e.slug);
        var ele = document.getElementById("social-content");
        ele.scrollTo(top.offsetWidth, top.offsetTop);
      }
      function mouseOut(d, i) {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
            var transform = d3.select(this).attr("transform");
            var scaleV = -0.06;
            d3.select(this).attr("transform", setTransform("translate", getTransform(transform, "translate")) + setTransform("scale", [MARKER_S_MIN, MARKER_S_MIN]));
      }
    });
  });
});
//parse values to array for transform modes, scale, transform,etc
function getTransform(str, mode){
   var value = str.match(new RegExp(mode + "\\(([^)]+)\\)"))[1].split(",");
   return value.map(function(e){return Number(e)});
}
function setTransform(mode, value){
     return mode + "(" +  value.join(',') + ")";
}

function resize() {
  var targetWidth = parseInt(container.node().parentNode.clientWidth);
  svg.attr("width", targetWidth);
  svg.attr("height", Math.round(targetWidth / aspect));
}
window.addEventListener("resize", resize);
