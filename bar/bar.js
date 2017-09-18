var margin = {
    top: 10,
    left: 75,
    right: 20,
    bottom: 70
}
height = 300 - margin.top - margin.bottom
width = 350 - margin.left - margin.right

var totalTweets = 0;

var Barsvg = d3.select("[LOCATION]").append("svg"). //Where should it go?
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g") 
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scale.ordinal()
    .rangeRoundBands([width, 0], .1);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yScale = d3.scale.linear()
    .range([height, 0])

var yAxis = d3.svg.axis()
    .scale(yScale)
    .innerTickSize(-width)
    .outerTickSize(0)
    .ticks(5)
    .tickPadding(10)
    .orient("left")
    .tickFormat(function(d) {
        if ((d / 100000000) >= 1) {
            d = d / 1000000000
        }
        return d;
    });


d3.csv("[DEFINE THE DATA LOCATION]", function(err, data) {. // Define the data location
    var cityCount = d3.nest()
        .key(function(d) {
            return d.place_full_name;
        })
        .rollup(function(v) {
            return v.length;
        })
        .entries(data);



    cityCount.forEach(function(d) {
        d.["WHAT SHOULD WE MEASURE?"] = d.key;  //Define the data value you want to measure
        d.tweets = d.values;
        totalTweets += d.values;
        delete d["key"];
        delete d["values"];
    });


    var cityOrder = cityCount.sort(function(a, b) {
        return b.tweets - a.tweets
    }).slice(0, 7); //This is how many locations you want to show


    xScale.domain(cityOrder.map(function(d) {
        return d.["WHAT SHOULD WE MEASURE?"]; // Defining the x
    }));
    yScale.domain([0, d3.max(cityOrder, function(d) {
        return d.tweets;
    })]);

    //xAxis
    Barsvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-35)");
    //yAxis
    Barsvg.append("g")
        .attr("class", "y axis")
        .call(yAxis)


    Barsvg.selectAll(".bar")
        .data(cityOrder)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return xScale(d.["WHAT SHOULD WE MEASURE?"]);  // We need to set the scale by the data we defined previously
        })
        .attr("height", function(d) {
            return height - yScale(d.tweets);
        })
        .attr("y", function(d) {
            return yScale(d.tweets);
        })
        .attr("width", xScale.rangeBand())

});

function type(cityOrder) {
    cityOrder.tweets = cityOrder.tweets;
    return cityOrder;
}