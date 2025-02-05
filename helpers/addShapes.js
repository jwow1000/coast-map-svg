import * as d3 from 'd3';

// append a simple shape for each interaction group
export function appendShape(theGroups) {
  theGroups.each(function() {
    let firstChild = d3.select(this).select("*"); // Select the first child inside <g>

    if (!firstChild.empty()) {
        let bbox = firstChild.node().getBBox(); // Get bounding box of the first child

        d3.select(this)
          .append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("x", (bbox.x + bbox.width) - 10) // Center based on first child's position
          .attr("y", (bbox.y) - 10)
          .attr("fill", "red")
          .attr("transform", "rotate(45)");
    }
  });

  
  
  

}