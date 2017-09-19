
var width = 250,
    height = 250,
    radius = Math.min(width, height) / 2;

var totalAmount = 0;
var circleGraph;
var circlePath;

var color = d3.scale.ordinal()
    .range(["#FF8000", "#0099C4", "#DC0A0A" ])
    .domain(["neutral", "positive", "negative"]);
  
var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.amount; });

var Piesvg = d3.select("[LOCATION]").append("svg") // Define where you want to place the graph
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("[DEFINE THE DATA LOCATION]", function(err, data) { // Define where the data is stored

  var sentimentCount = d3.nest()
    .key(function(d) { return d.["WHAT SHOULD WE MEASURE?"]; }) // Quantify non-numeric data into numbers
    .rollup(function(v) { return v.length; })
    .entries(data);

sentimentCount.forEach(function(d) {
    d.["WHAT SHOULD WE MEASURE?"] = d.key;  // Sum the non numeric values togethor by category
    d.amount = d.values;
    totalAmount += d.values;
    delete d["key"];
    delete d["values"];
  });

  circleGraph = Piesvg.selectAll("path")
      .data(pie(sentimentCount)).enter()
  .append("path")
      .attr("d", arc)
      .style("fill", function(d) {  return color(d.data.["WHAT SHOULD WE MEASURE?"]); }) //Associate the colour by category
      .each(function(d) { this._current = d; });


});

function type(d) {
  d.amount = +d.amount;
  return d;
}
