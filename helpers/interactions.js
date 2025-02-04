import * as d3 from 'd3';

// Touch detection
const isTouchDevice = 
  'ontouchstart' in window || 
  navigator.maxTouchPoints > 0 || 
  window.matchMedia("(pointer: coarse)").matches;

export default function setupInteractions(theGroups, bg, fadeOut, fadeIn, fadeOutCards, cardHoverState) {
  theGroups.each(function() {
      const element = d3.select(this);
      const cardId = element.attr("id");
      const card = document.querySelector(`.card-coast#${cardId}`);

      if (isTouchDevice) {
          // Touch device interaction
          element
              .on("touchstart", function(event) {
                  event.preventDefault(); // Prevent default touch behavior
                  event.stopPropagation();
                  
                  // First touch shows hover state
                  if (cardHoverState === 0) {
                      bg.transition()
                          .duration(1000)
                          .ease(d3.easeLinear)
                          .style("opacity", 0.2);

                      fadeOut(element);
                      cardHoverState = 1;
                      
                  // Second touch shows card
                  } else if (cardHoverState === 1) {
                      fadeOutCards();
                      if (card) {
                          card.style.opacity = "1";
                          card.style.display = "block";
                      }
                      cardHoverState = 2;
                  }
              });

      } else {
          // Mouse interaction (your existing code)
          element
              .on("mouseenter", function(event) {
                  if (cardHoverState === 0) {
                      bg.transition()
                          .duration(1000)
                          .ease(d3.easeLinear)
                          .style("opacity", 0.2);

                      fadeOut(element);
                      cardHoverState = 1;
                  }
              })
              .on("mouseleave", function(event) {
                  if (cardHoverState === 1) {
                      bg.transition()
                          .duration(1000)
                          .ease(d3.easeLinear)
                          .style("opacity", 1);

                      fadeIn();
                      fadeOutCards();
                      cardHoverState = 0;
                  }
              })
              .on("click", function(event) {
                  event.stopPropagation();
                  if (cardHoverState === 1) {
                      fadeOutCards();
                      if (card) {
                          card.style.opacity = "1";
                          card.style.display = "block";
                      }
                      cardHoverState = 2;
                  }
              });
      }
  });

  // Global touch handler for closing
  if (isTouchDevice) {
      document.addEventListener("touchstart", function(event) {
          if (cardHoverState === 2) {
              const clickedCard = event.target.closest('.card-coast');
              const clickedSvg = event.target.closest('.script-interact');
              
              if (!clickedCard && !clickedSvg) {
                  bg.transition()
                      .duration(1000)
                      .ease(d3.easeLinear)
                      .style("opacity", 1);

                  fadeIn();
                  fadeOutCards();
                  cardHoverState = 0;
              }
          }
      }, { passive: false });
  } else {
      // Your existing body click handler
      document.body.addEventListener("click", function(event) {
          if (cardHoverState === 2) {
              const clickedCard = event.target.closest('.card-coast');
              if (!clickedCard) {
                  bg.transition()
                      .duration(1000)
                      .ease(d3.easeLinear)
                      .style("opacity", 1);

                  fadeIn();
                  fadeOutCards();
                  cardHoverState = 0;
              }
          }
      });
  }
}