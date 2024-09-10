import { getInfo } from "./helpers/fetch";
import * as d3 from 'd3';

const overlay = 'https://cdn.prod.website-files.com/66c4bc9a1e606660c92d9d24/66e0bf5b7078a46e17675a68_Map-buttons.svg';

// get the card from the DOM
const card = document.querySelector(".info-card-coast");

d3.xml( overlay )
  .then(data => {
    const svg = data.documentElement;
    svg.id = "overlay-item"; // Assign an ID 
    
    // add the svg to the DOM
    const svgContainer = document.querySelector(".svg-container-coast");
    
    // console.log("the webflow container", svgContainer);
    svgContainer.appendChild( svg );
    
  })
  
  .then( data => {
    const svg = document.body.querySelector("#overlay-item");

    // get the info
    const info = getInfo();
    console.log("chweck it out: ", info);

    // get the buttons
    const buttonsDom = svg.querySelectorAll(".button");
    const buttons = [...buttonsDom];

    // get the blur image
    const blurLayer = svg.querySelectorAll(".svg-blur-image");
    // console.log("buttons", blurLayer)
    
    // then add the event listeners
    // detect when mouse is over item
    info.forEach( ( element ) => {
      // match the button to the info id
      console.log("buttins", buttons)
      const match = buttons.find((e) => e.id === element.idMatch);
      
      console.log("match it: ", match);

      match.addEventListener("mouseover", () => {
        // console.log(`mouse over: ${element.id} `);
        
        // get the id and replace the mask url
        blurLayer.forEach((e) => {
          // console.log("hmmm",`url(#${match.id})` )
          e.setAttribute('mask', `url(#mask-${match.id})`);
        });
        
        // make the blur layer visible, with an ease animation in css
        blurLayer.forEach((e) => {
          e.style.opacity = "100";
        });

        // make the card visible
        card.style.display = "block"
        card.innerText = element.body;
      });
      
      match.addEventListener("mouseout", () => {
        // console.log(`mouse off: ${match.id}`);
        
        // make the blur layer dissapear with an eas out in css
        blurLayer.forEach((e) => {
          e.style.opacity = "0";
        });

        card.style.display = "none";
      }); 
    });
    
  }

)
.catch(error => console.error("Error loading the SVG:", error));








