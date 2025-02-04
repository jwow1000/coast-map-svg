import { getInfo } from "./helpers/fetch.js";
import setupInteractions from "./helpers/interactions.js";
import * as d3 from 'd3';

const overlay = "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/67a0ef1da7909405fe4c1f4f_MapA-dynamic-overlay.svg";
const bg = "https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/679a66ef42d3335f41be517a_mapA-static-bg.jpg"

// select the full-story item
const theBody = document.querySelector("body");

// card hover state: 0 = hover off, 1 = hovering, 2 = full-story mode
let cardHoverState = 0; 

const allCards = document.querySelectorAll(".card-coast");

const fadeOutCards = () => {
  allCards.forEach((item) => {
    item.style.opacity = '0';
  });
}

d3.xml( overlay )
  .then(data => {
    // Get the root SVG element from the loaded file
    const svg = data.documentElement;
    svg.id = "overlay-item"; // Assign an ID for reference
    

    // Select the SVG element using D3 to use D3 methods
    const d3Svg = d3.select(svg);

    // Insert the PNG as an <image> element at the start of the SVG
    d3Svg.insert("image", ":first-child") // Inserts as the first child
      .attr("href", bg) // Path to your PNG
      .attr("x", 0)
      .attr("y", 0)
      .attr("class", "bg")
      
      // .attr("transform", "scale(0.95)")
      .attr("width", "100%")
      .attr("height", "100%");
    
      // Append the SVG to the DOM
    const svgContainer = document.querySelector(".svg-render-coast");

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

    // theGroups.each(function() {
    //   const element = d3.select(this);
      
    //   // select the card element from cards
    //   const card = document.querySelector(`.card-coast#${element.attr("id")}`);
      
    //   // Determine event type based on device type
    //   const enter = isTouchDevice ? "pointerdown" : "mouseenter";
    //   const leave = isTouchDevice ? "pointerdown" : "mouseleave"; 
    
    //   element
    //     .on(enter, function(event) {
    //       event.stopPropagation(); // Prevent event from bubbling up
    //       if (cardHoverState === 0) {
            
    //         // Fade out background
    //         bg.transition()
    //           .duration(1000)
    //           .ease(d3.easeLinear)
    //           .style("opacity", 0.2);
    
    //         // Fade out all buttons
    //         fadeOut( element );
    
    //         // Set the global state
    //         cardHoverState = 1;
    //       }
    //     })
    //     .on(leave, function(event) {
    //       event.stopPropagation(); // Prevent event from bubbling up
    //       if (cardHoverState === 1) {
    //         // Hide the blur layer and reset the stroke and opacity
    //         bg.transition()
    //           .duration(1000)
    //           .ease(d3.easeLinear)
    //           .style("opacity", 1);
    
    //         fadeIn();
    //         fadeOutCards();
    //         cardHoverState = 0;
    //       }
    //     })
    //     .on("click", function(event){
    //       event.stopPropagation(); // Prevent event from bubbling up
    //       if(cardHoverState === 1) {
    //         // Make the card visible
    //         card.style.opacity = "1";
    //         console.log("make it vivibfdsbjafkld", card)
    //         cardHoverState = 2;
    //       }
    //     })
        
        
    // });
  
    // // add event listener to close full-story on click
    // theBody.addEventListener("click", (event) => {
    //   if (cardHoverState === 2) {
    //     // Hide the blur layer and reset the stroke and opacity
    //     bg.transition()
    //       .duration(1000)
    //       .ease(d3.easeLinear)
    //       .style("opacity", 1);

    //     fadeIn();

    //     fadeOutCards();
    //     cardHoverState = 0;
    //   } 
    // });  

    // make it scale
    d3.select("#overlay-item") // Select the existing SVG
      .attr("width", "100%") // Make it responsive
      .attr("height", "100%")
      .attr("viewBox", "0 0 841.89 595.28") // Adjust based on original SVG dimensions
      .attr("preserveAspectRatio", "xMidYMid meet"); // Maintain aspect ratio

  })
.catch(error => console.error("Error loading the SVG:", error));









