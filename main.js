import { getInfo } from "./helpers/fetch";
import * as d3 from 'd3';

const overlay = 'https://cdn.prod.website-files.com/66c4bc9a1e606660c92d9d24/66e2017e69d883bc68ca0b1d_Map-buttons.svg';

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
    
    // add the svg to the DOM
    const svgContainer = document.querySelector(".svg-container-coast");
    
    // console.log("the webflow container", svgContainer);
    svgContainer.appendChild( svg );
    
  })
  
  .then( data => {
    // get the svg, overlay item
    const svg = document.body.querySelector("#overlay-item");

    // get the info
    const info = getInfo();
    // console.log("check out the data from webflow: ", info);

    // get the buttons
    const buttonsDom = svg.querySelectorAll(".button");
    const buttons = [...buttonsDom];

    // get the blur image
    const blurLayer = svg.querySelector("#svg-blur-image");
    
    // then add the event listeners
    // detect when mouse is over item
    info.forEach( ( element ) => {
      // match the button to the info id
      console.log("buttins", buttons)
      const match = buttons.find((e) => e.id === element.idMatch);
      
      // console.log("match it: ", match);
      // add the match to the info 
      element.object = match;

      match.addEventListener("mouseover", () => {
        // console.log(`mouse over: ${element.id} `);
        
        // get the id and replace the mask url
        blurLayer.setAttribute('mask', `url(#mask_${match.id})`);
        
        // make the blur layer visible, with an ease animation in css
        blurLayer.style.opacity = "100";
        
        // make the card visible
        card.style.display = "block"
        card.innerText = element.body;

      });
      
      match.addEventListener("mouseout", () => {
        // console.log(`mouse off: ${match.id}`);
        
        // make the blur layer dissapear with an eas out in css
        blurLayer.style.opacity = "0";

        // make the card dissapear
        card.style.display = "none";

      }); 
    });
    
    // scroll timeline elements
    const updatePosition = (delta) => {
      // normalize the scroll
      const normPos = position / maxScroll;
      // make the date range
      const date = (normPos * 5) + 2019;
      // console.log("current scroll date: ", date)
      
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
    
    window.addEventListener('touchmove', (event) => {
      const deltaY = startY - event.touches[0].clientY;
      updatePosition( clip( deltaY ) );
    });
  }

)
.catch( error => console.error("Error loading the SVG:", error) );








