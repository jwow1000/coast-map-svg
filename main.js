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

// remove previous svg
function removeSVG() {
  const oldSvg = document.querySelector("#overlay-item");
  if (oldSvg) {
    oldSvg.remove();
  }
}

const assets = {
  a: {
    overlay: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67a0ef1da7909405fe4c1f4f_MapA-dynamic-overlay.svg",
    bg: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/679a66ef42d3335f41be517a_mapA-static-bg.jpg"
  },
  b: {
    overlay: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67a4ef27196f8244c5c6fc5b_MapB_Overlay.svg",
    bg: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67a4ef27e4650eabebbfaef3_MapB_BG.jpg"
  },
  c: {
    overlay: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67a4ef8214eee38f5122f0d8_MapC_Overlay.svg",
    bg: "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67a52d02cf6e8d6ddd6d0e66_MapC_BG.jpg"
  }
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

// add action to the date buttons
let transition = false;
dates.addEventListener("click", (event) => {
  const e = event.target;
  if( e.hasAttribute('data-date') && transition === false ) {
    transition = true;
    const showDate = e.getAttribute('data-date');
    d3SvgContainer
      .transition()
      .duration(1000) 
      .ease(d3.easeLinear) 
      .style("opacity", 0); 
    
    setTimeout(function trigger() {
      renderMap( assets[showDate].overlay, assets[showDate].bg);
      d3SvgContainer
        .transition()
        .duration(1000) 
        .ease(d3.easeLinear) 
        .style("opacity", 1); 
      transition = false;    
    }, 1000)
      
  }
});


const fadeOutCards = () => {
  allCards.forEach((item) => {
    item.style.opacity = '0';
  });
}

function renderMap( overlay, bg ) {
  removeSVG();
  d3.xml( overlay )
    .then(data => {
      // Get the root SVG element from the loaded file
      const svg = data.documentElement;
      svg.id = `overlay-item`; // Assign an ID for reference
      
  
      // Select the SVG element using D3 to use D3 methods
      const d3Svg = d3.select(svg);
  
      // Insert the PNG as an <image> element at the start of the SVG
      d3Svg.insert("image", ":first-child") // Inserts as the first child
        .attr("href", bg) // Path to your PNG
        .attr("x", 0)
        .attr("y", 0)
        .attr("class", `bg`)
        
        // .attr("transform", "scale(0.95)")
        .attr("width", "100%")
        .attr("height", "100%");
      
      // Append the SVG to the DOM
  
      svgContainer.appendChild(svg);
    })
    
    .then( data => {
      // select the added svg
      const d3Svg = d3.select('#overlay-item');
      
      // select the bgPng
      const bg = d3.select('.bg');
  
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
  
      const theGroups = d3.selectAll(".script-interact");
      // appendShape( theGroups );
  
      // make all buttons go transparent?
      function fadeOut( exclude ) {
        const excludeNode = exclude.node();
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

// init with map a
renderMap(assets['a'].overlay, assets['a'].bg, 'a');

