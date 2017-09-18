mapboxgl.accessToken = 'pk.eyJ1IjoiY291ZWxsZXR0ZSIsImEiOiJjajBrMHVmZW4wMXllMnFtZW9weDhuancwIn0.vSIlhzkgSsNyGQMz5C28iw';

var Americas = [
    [-135.0,12.2], 
    [-54.1,55.2] 
];


var map = new mapboxgl.Map({
    container: '[LOCATION]',   // Define the map location
    style: '["MAPBOX STYLE"]', //Mapbox style
    center: [10, 5], 
    zoom: 0,
    maxBounds: Americas 
})

map.dragPan.disable();
map.scrollZoom.enable();


var container = map.getCanvasContainer()
var svg = d3.select(container).append("svg")
var isAtStart = true;



var colorCat = "sentiment";

var circleColor = d3.scale.ordinal()
    .range(["#FF8000", "#0099C4", "#DC0A0A" ])
    .domain(["neutral", "positive", "negative"]);



d3.csv("[DEFINE THE DATA LOCATION]", function(err, data) {. // Define your data location

var active = false;
var circleControl = new circleSelector(svg)
    .projection(project)
    .activate(active);

function project(d) {
    return map.project(getLL(d));
}

function getLL(d) {
    return new mapboxgl.LngLat(+d.["WHAT SHOULD WE MEASURE?"], +d.["WHAT SHOULD WE MEASURE?"]) // Place the dots on the map
}

var dots = svg.selectAll("circle.dot")
    .data(data);

dots.enter().append("circle").classed("dot", true)
    .attr("id", "tweets")
    .attr("r", 1)
    .style("fill", function(d) {return circleColor(d[colorCat]);})
    .transition()
    .duration(1000)
    .attr("r", 6)


var legend = d3.select("[LOCATION]").append("svg"). // Define your legend
        .attr("class", "legend")
        .attr("width", 140)
        .attr("height", 200)
        .selectAll("g")
        .data(d3.map(data, function(d) {
            return d.["WHAT SHOULD WE MEASURE?"];  // What data will you use?
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
            return d.["WHAT SHOULD WE MEASURE?"]; // What data will you use?
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