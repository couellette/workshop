 // Define margins
    var margin = {top: 20, right: 30, bottom: 30, left: 50},
    width = parseInt(d3.select("#line").style("width")) - margin.left - margin.right,
    height = 120
    // Define date parser
    var parseDate = d3.time.format("%Y-%m-%d").parse;

    // Define scales
    var xScale = d3.time.scale().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]);
    var color = d3.scale.ordinal()
          .range(["#FF8000", "#0099C4", "#DC0A0A" ]);
    // Define axes
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(4);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(6).innerTickSize(-width);

    // Define lines
    var line = d3.svg.line().interpolate("basis")
                .x(function(d) { return xScale(d["date"]); })
                .y(function(d) { return yScale(d["concentration"]); });

    // Define svg canvas
    var svg = d3.select("[LOCATION]").append("svg") // Define where you want to place the graph
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var totalTweets = 0;
    d3.csv("[DEFINE THE DATA LOCATION]", function(error, data){ // Define where the data is stored
      if (error) throw error;

      data.forEach(function(d){
        d.["WHAT SHOULD WE MEASURE?"] = parseDate(d.["WHAT SHOULD WE MEASURE?"]) // Time frame of how we measure
      });

var lineData = d3.nest()
  .key(function(d) { return d.["WHAT SHOULD WE MEASURE?"]; }) // Sum the non numeric values togethor by category
  .key(function(d) { return d.["WHAT SHOULD WE MEASURE?"]; }) // Time frame of how we measure
.rollup(function(v) { return v.length; })  .entries(data)
 .map(function(group) {
    return {
      category: group.key, datapoints: group.values.map(function(d){return {date: Date.parse(d.key), concentration: +d.values}})

    }

  })

      xScale.domain(d3.extent(data, function(d) {return d.["WHAT SHOULD WE MEASURE?"]; }));  // Time frame of how we measure

      yScale.domain([0, 75])

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("y", 6)
          .attr("dy", ".71em")
          .attr("dx", ".71em")
          .style("text-anchor", "beginning")

      var products = svg.selectAll(".category")
            .data(lineData)
            .enter().append("g")
            .attr("class", "category");

      products.append("path")
              .attr("class", "line")
              .attr("d", function(d) {return line(d.datapoints); })
              .style("stroke", function(d) {return color(d.category); });

    });
