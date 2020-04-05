// Step 1: Initialize Tooltip
var toolTip = d3.tip()
//tip() is a function that does select body and append div
  .attr("class", "tooltip")
  .offset([80, -60])//doesn't do anything
  .html(function(d) {
    return (`% of pop in poverty${d.poverty}<hr> % of pop without healthcare${d.healthcare}
    `);
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
}).catch(function(error) {
console.log(error);
});