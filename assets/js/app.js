// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 60
  };
  // var margin = {
  //   top: 50,
  //   bottom: 50,
  //   right: 50,
  //   left: 50
  // };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


  // read the csv file 
  d3.csv('./assets/data/data.csv').then(function (HealthcareAndPoverty) {
    //format data to make a lacks healthcare(%) vs in poverty (%)
    HealthcareAndPoverty.forEach(function (data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    //create scales
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(HealthcareAndPoverty, d => d.poverty))
      .range([0, width]);
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(HealthcareAndPoverty, d => d.healthcare)])
      .range([height, 0]);

    //create axes
    var xAxis = d3.axisBottom().scale(xLinearScale)
    var yAxis = d3.axisLeft().scale(yLinearScale)

    //append axes
    chartGroup.append('g')
      .attr("transform", `translate(0, ${height})`)
      .attr("class", "chart")
      .call(xAxis);

    chartGroup.append('g')
      .call(yAxis)
      .attr("class", "chart");

    //circle generator
    var circlesGroup = chartGroup.selectAll("circle")
      .data(HealthcareAndPoverty)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "20")      
      .attr("class", "stateCircle")
      .attr("stroke", "blue");


    var textGroup = chartGroup.selectAll("text.stateText")
      .data(HealthcareAndPoverty)
      .enter()
      .append("text")
      .attr("class", "stateText")
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("stroke-width", "1")
      .attr("stroke", "black")
      .text(d => d.abbr);

    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
      //tip() is a function that does select body and append div
      .attr("class", "d3.tip")
      //.offset([80, -60])//doesn't do anything
      .html(function (d) {
        return (`<strong>% in poverty: ${d.poverty}<hr>% without healthcare: ${d.healthcare}</strong>`);
      });

    // Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
      // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });
      // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left +10)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare(%)");

  chartGroup.append("text")
    //.attr("transform", `translate(${width}, ${height - margin.bottom + 10})`)
    //.attr("transform", `translate(${width / 2}, ${height + margin.top +10})`)
    .attr("y", 0 - margin.bottom -10)
    .attr("x", 0 + margin.right-60)
    .attr("class", "axisText")
    .text("In Poverty(%)");
  }).catch(function(error) {
    console.log(error);
  });
  

}
  // When the browser loads, makeResponsive() is called.
  makeResponsive();

  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
  







