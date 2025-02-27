import { getInfo } from "./helpers/fetch.js";
import setupInteractions from "./helpers/interactions.js";
// import { appendShape } from "./helpers/addShapes.js";
import * as d3 from 'd3';


// dynamically add classes from cms
document.querySelectorAll('.card-coast').forEach(item => {
  let align = item.getAttribute('data-position');
  // default is left if there is no data
  if ( align ) {
    item.classList.add( align === 'right' ? 'right-align' : 'left-align')
  } else {
    item.classList.add('left');
  }
  
});

const assets = {
  a: {
    overlay: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67b664156e0b377f188f82a9_a4400b660c3a5efa33f16bd689f60ffc_MapA-interact.svg",
    bg: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/679a66ef42d3335f41be517a_mapA-static-bg.jpg",
  },
  b: {
    overlay: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67b65999f23777d7c9c2b4ea_902d988336e74b48d9ebdbec861eea54_MapB-interact.svg",
    bg: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67a4ef27e4650eabebbfaef3_MapB_BG.jpg",
  },
  c: {
    overlay: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67b659993e9e6eede1f2e4a6_1a3626c35d20cdd675b49765948c7184_MapC-interact.svg",
    bg: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67a52d02cf6e8d6ddd6d0e66_MapC_BG.jpg",
  },
}


// select the full-story item
const theBody = document.querySelector("body");

// select the date buttons
const dates = document.querySelector('.button-wrapper');

// card hover state: 0 = hover off, 1 = hovering, 2 = full-story mode
let cardHoverState = 0; 

const allCards = document.querySelectorAll(".card-coast");
const svgContainer = document.querySelector(".svg-render-coast");
const d3SvgContainer = d3.select(".svg-render-coast");

function boldDateSelect( sel ) {
  const buttons = dates.querySelectorAll('.coast-date-button'); 
  buttons.forEach(el => {
    el.classList.remove('selected');
  });
  
  sel.classList.add('selected');
  
}

// add action to the date buttons
let transition = false;
let activeSvg = 'a';

dates.addEventListener("click", (event) => {
  const e = event.target;
  
  if( e.hasAttribute('data-date') && transition === false ) {
    transition = true;
    boldDateSelect(e);

    const newActiveSvg = e.getAttribute('data-date');
    
    // Don't do anything if clicking the already active date
    if (newActiveSvg === activeSvg) {
      transition = false;
      return;
    }
    
    const oldSvg = d3.select(`#overlay-item-${activeSvg}`);
    const newSvg = d3.select(`#overlay-item-${newActiveSvg}`);
    
    // Bring the new SVG to front
    newSvg.style("z-index", "10");
    oldSvg.style("z-index", "5");
    
    // Fade out old, fade in new
    oldSvg
      .transition()
      .duration(1000) 
      .ease(d3.easeLinear) 
      .style("opacity", 0)
      .on("end", function() {
        oldSvg.style("display", "none");
        oldSvg.style("z-index", "0");
        transition = false;
      });
    
    newSvg
      .style("display", "block")
      .transition()
      .duration(1000) 
      .ease(d3.easeLinear) 
      .style("opacity", 1);
    
    // Update active SVG reference
    activeSvg = newActiveSvg;

  }
});

const fadeOutCards = () => {
  allCards.forEach((item) => {
    item.style.opacity = '0';
  });
}

function renderMap( overlay, bg, strId ) {
  d3.xml( overlay )
    .then(data => {
      // Get the root SVG element from the loaded file
      const svg = data.documentElement;
      svg.id = `overlay-item-${strId}`; // Assign an ID for reference
      
      // Set positioning - this is the key change
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.right = "0";
      svg.style.width = "100%";
      svg.style.height = "100%";
      
      // Set initial display based on active state
      if (strId !== activeSvg) {
        svg.style.opacity = "0";
        svg.style.display = "none";
      }

      // Select the SVG element using D3 to use D3 methods
      const d3Svg = d3.select(svg);
  
      // Insert the PNG as an <image> element at the start of the SVG
      d3Svg.insert("image", ":first-child") // Inserts as the first child
        .attr("href", bg) // Path to your PNG
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", `bg-${strId}`)
        
        // .attr("transform", "scale(0.95)")
        .attr("width", "100%")
        .attr("height", "100%");
      
      // Append the SVG to the DOM
  
      svgContainer.appendChild(svg);
    })
    
    .then( data => {
      // select the added svg
      const d3Svg = d3.select(`#overlay-item-${strId}`);
      
      // select the bgPng
      const bg = d3.select(`.bg-${strId}`);
  
      // select the groups with ids that match the cms titles
      // get the data from the cms
      const info = getInfo();
      // console.log("info: ", info);
      
      // get the matches
      info.forEach(( item ) => {
        const match = d3Svg.select(`#${item.title}`);
        // console.log("list of items", `#${item.title}`);
        if( !match.empty() ) {
          // console.log("lok at matches: ", match, item.title);
          match.attr("class", "script-interact");
        }
      });
      
      // select all the interact groups
      const theGroups = d3Svg.selectAll(".script-interact");
      // select all the markers
      const markers = d3Svg.select("#markers");
      markers
        .style("pointer-events", "none");
      console.log("markers: ", markers)
      
      // make all buttons go transparent
      function fadeOut( exclude ) {
        const excludeNode = exclude.node();
        
        markers
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .style("opacity", 0);

        theGroups
          .transition()
          .duration(1000) 
          .ease(d3.easeLinear) 
          .style("opacity", function(d, i) {
            // If the element is the one to exclude, keep full opacity
            return this === excludeNode ? 1 : 0.2;
          }); 
      }
  
      function fadeIn() {
        markers
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .style("opacity", 1);

        theGroups
          .transition()
          .duration(1000) 
          .ease(d3.easeLinear) 
          .style("opacity", 1); 
      }  
      
      setupInteractions(theGroups, bg, fadeOut, fadeIn, fadeOutCards, cardHoverState);
  
      // make it scale
      d3.select("#overlay-item") // Select the existing SVG
        .attr("width", "100%") // Make it responsive
        .attr("height", "100%")
        .attr("viewBox", "0 0 841.89 595.28") // Adjust based on original SVG dimensions
        .attr("preserveAspectRatio", "xMidYMid meet"); // Maintain aspect ratio
  
    })
  .catch(error => console.error("Error loading the SVG:", error));

}

// init all maps 

renderMap(assets['a'].overlay, assets['a'].bg, 'a');
renderMap(assets['b'].overlay, assets['b'].bg, 'b');
renderMap(assets['c'].overlay, assets['c'].bg, 'c');

// Initial setup - only show the active SVG (which starts as 'a')
d3.select(`#overlay-item-a`).style("opacity", 1).style("display", "block");
d3.select(`#overlay-item-b`).style("opacity", 0).style("display", "none");
d3.select(`#overlay-item-c`).style("opacity", 0).style("display", "none");