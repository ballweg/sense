function sense(){
  var svg = d3.select("svg"),
    margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseTime = d3.timeParse("%d-%b-%y-%H:%M");

  var x = d3.scaleTime().rangeRound([0, width]);
  var y0 = d3.scaleLinear().rangeRound([height, 0]);
  var y1 = d3.scaleLinear().rangeRound([height, 0]);

  var line0 = d3.line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y0(d.temp);
    });

  var line1 = d3.line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y1(d.humidity);
    });

  d3.tsv("data.tsv", function(d) {
    d.date = parseTime(d.date);
    d.temp = +d.temp;
    d.humidity = +d.humidity;
    return d;
  }, function(error, data) {
    console.log(data);
    if (error) throw error;

    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    // fixed y axis for temp
    y0.domain([12,25]);
    // responsive y axis for temp
    // y0.domain(d3.extent(data, function(d) {
    //   return d.temp;
    // }));
    y1.domain([0,100]);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();

    g.append("g")
      .call(d3.axisLeft(y0))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Temp ºC")
      .style("fill", "red");

    g.append("g")
      .call(d3.axisRight(y1))
      .attr("transform", "translate(" + width + " ,0)")
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90), translate(0, -20)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Humidity %")
      .style("fill", "steelblue");

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line0);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line1);
  });
}
