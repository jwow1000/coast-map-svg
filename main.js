import { getInfo } from "./helpers/fetch";
import * as d3 from 'd3';

const overlay = 'https://cdn.prod.website-files.com/66e5c9799b48938aa3491deb/66e9a6734d93e93d5576a2de_Map-buttons.svg';

// get the card from the DOM
const card = document.querySelector(".card-coast");

// scroll stuff
const maxScroll = 4000;
let position = 0;

// funciton to clip the scroll range
function clip( delta ) {
  const currentPos = position;
  const nextStep = currentPos + delta;
 
  if( nextStep <= 0) {
    if( position != 0) {
      position = 0;
    }
  } else if( nextStep >= maxScroll) {
    if( position != maxScroll) {
      position = maxScroll;
    }
  } else {
    position += delta;
  }
  
}


// d3 get the SVG hosted in webflow's assets
d3.xml( overlay )
  .then(data => {
    
    const svg = data.documentElement; // extract the SVG
    svg.id = "overlay-item"; // Assign an ID 
    
    // get the svg container
    const svgContainer = document.querySelector(".svg-container-coast");
    
    // add the svg
    svgContainer.appendChild( svg );
    
  })
  
  .then( data => {
    // get the svg, overlay item
    const svg = document.body.querySelector("#overlay-item");
    
    // get the svg for d3
    const d3Svg = d3.select("#overlay-item");
    const svgHeight = d3Svg.node().getBBox().height;
    
    // add slider to the bottom
    const sliderScale = d3.scaleLinear()
      .domain( [0, 4000] )
      .range( [0, 600] );

    d3Svg.append("line")
      .attr("x1", sliderScale.range()[0])
      .attr("x2", sliderScale.range()[1])
      .attr("y1", svgHeight)
      .attr("y2", svgHeight)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Append a draggable handle (circle)
    const handle = d3Svg.append("circle")
      .attr("cx", sliderScale(0))  // Initial position (for value 50)
      .attr("cy", svgHeight)
      .attr("r", 10)
      .attr("fill", "blue")
      .call(d3.drag()
          .on("drag", function (event) {
              let newX = event.x;

              // Restrict movement within the slider range
              if (newX < sliderScale.range()[0]) newX = sliderScale.range()[0];
              if (newX > sliderScale.range()[1]) newX = sliderScale.range()[1];

              d3.select(this).attr("cx", newX);

              // Update value based on position
              const value = sliderScale.invert(newX);
              position = Math.round( value );
              updatePosition();
              
          })
      );


    // get the info
    const info = getInfo();

    // get the blur image
    const blurLayer = svg.querySelector("#svg-blur-image");
    
    // get the buttons
    const buttonsDom = svg.querySelectorAll(".button");
    const buttons = [...buttonsDom];

    // Loop through your 'info' array and attach the event handler to the matching buttons
    info.forEach( (element) => {
      // Match the button to the info id
      const match = buttons.find((e) => e.id === element.idMatch);
      
      // Add the match to the element object 
      element.object = match;
    
      // then add the event listeners
      // detect when mouse is over item
      info.forEach( ( element ) => {
        // match the button to the info id
        const match = buttons.find((e) => e.id === element.idMatch);
        
        // add the match to the info 
        element.object = match;
  
        match.addEventListener("mouseover", () => {
          // remove mask before setting new one
          blurLayer.removeAttribute('mask');
  
          // get the id and replace the mask url
          blurLayer.setAttribute('mask', `url(#mask_${match.id})`);
          
          // make the blur layer visible, with an ease animation in css
          blurLayer.style.opacity = "100";
          
          // make the card visible
          card.style.display = "block"
          card.innerText = element.body;
  
        });
        
        match.addEventListener("mouseout", () => {
          
          // make the blur layer dissapear with an eas out in css
          blurLayer.style.opacity = "0";
  
          // make the card dissapear
          card.style.display = "none";
  
        }); 
      });

     
    });

    
    
    // scroll timeline elements
    const updatePosition = (delta) => {
      // normalize the scroll
      const normPos = position / maxScroll;
      
      // make the date range
      const date = (normPos * 22) + 2000;
      
      // update the d3 slider
      handle.attr("cx", `${ (position / 4000) * 600 }` )

      // get the buttons dates
      info.forEach( (item) => {
        // get just the year
        const floatDate = item.date.split(' ')[2];
        
        // compare dates and update accordingly, the element is in info as 'object'
        if(date >= floatDate) {
          item.object.style.display = "block"
        } else {
          item.object.style.display = "none"
        }

      });

    };

    
    // Add event listeners for mouse, touch, or key inputs
    window.addEventListener('wheel', (event) => {
      updatePosition( clip( event.deltaY ) );
    });
    
    // capture start Y 
    let lastExecution = 0;
    const throttleTime = 100;  // Throttle time in milliseconds 
    let startY = 0;
    
    window.addEventListener( 'touchstart', ( event ) => {
      
      startY = event.touches[0].clientY;

    });

    // update the touch(mobile) move
    window.addEventListener('touchmove', (event) => {
      const now = Date.now();
      if (now - lastExecution >= throttleTime) {
        
        event.preventDefault();  // Prevent page from scrolling
        const deltaY = startY - event.touches[0].clientY;
        updatePosition( clip( deltaY ) );
        lastExecution = now;
        
      } 
    }, {passive: false} );
  }

)
.catch( error => console.error("Error loading the SVG:", error) );








