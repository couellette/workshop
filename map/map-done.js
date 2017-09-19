mapboxgl.accessToken = 'pk.eyJ1IjoiY291ZWxsZXR0ZSIsImEiOiJjajdxZGhwenEwamRsMnFucXhzZGg2dWJiIn0.FdR_XFTCKPc3LyW_phK1NA';

var Americas = [
    [-135.0,12.2], // Southwest coordinates
    [-54.1,55.2] // Northeast coordinates
];


var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', //hosted style id
    center: [10, 5], // starting position
    zoom: 0,
    maxBounds: Americas // Sets bounds as max
})

map.dragPan.disable();
map.scrollZoom.enable();

// Setup our svg layer that we can manipulate with d3
var container = map.getCanvasContainer()
var svg = d3.select(container).append("svg")
var isAtStart = true;



var colorCat = "sentiment";

var circleColor = d3.scale.ordinal()
    .range(["#FF8000", "#0099C4", "#DC0A0A" ])
    .domain(["neutral", "positive", "negative"]);



d3.csv("https://couellette.github.io/workshop/data/ux-data.csv ", function(err, data) {
    //  console.log(data[0], getLL(data[0]), project(data[0]))


var active = false;
var circleControl = new circleSelector(svg)
    .projection(project)
    .activate(active);

function project(d) {
    return map.project(getLL(d));
}

function getLL(d) {
    return new mapboxgl.LngLat(+d.lng, +d.lat)
}

var dots = svg.selectAll("circle.dot")
    .data(data);

dots.enter().append("circle").classed("dot", true)
    .attr("id", "tweets")
    .attr("r", 1)
    .style("fill", function(d) {return circleColor(d[colorCat]);})
    .transition()
    .duration(1000)
    //.attr("r", function(d) { return .075 * Math.sqrt(d.user_followers_count / Math.PI) + 3;})
    .attr("r", 6)


var legend = d3.select("#legend").append("svg")
        .attr("class", "legend")
        .attr("width", 140)
        .attr("height", 200)
        .selectAll("g")
        .data(d3.map(data, function(d) {
            return d.sentiment;
        }).keys())
        .enter()
        .append("g")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("opacity", .8)
        .style("fill", circleColor);

    legend.append("text")
        .data(d3.map(data, function(d) {
            return d.sentiment;
        }).keys())
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(function(d) {
            return d;
        });


 function render() {
        dots.attr({
            cx: function(d) {
                var x = project(d).x;
                return x
            },
            cy: function(d) {
                var y = project(d).y;
                return y
            },
        })
        circleControl.update(svg)
    }

map.on("viewreset", function() {
    render()
})

map.on("move", function() {
    render()
})
    // render our initial visualization
    render();
})