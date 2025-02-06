import * as d3 from 'd3';

const isTouchDevice = 
  'ontouchstart' in window || 
  navigator.maxTouchPoints > 0 || 
  window.matchMedia("(pointer: coarse)").matches;

export default function setupInteractions(theGroups, bg, fadeOut, fadeIn, fadeOutCards, cardHoverState) {
  // Track the currently active card and group
  let activeCard = null;
  let activeGroup = null;

  function resetState() {
    bg.transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .style("opacity", 1);

    fadeIn();
    fadeOutCards();
    cardHoverState = 0;
    activeCard = null;
    activeGroup = null;
  }

  function handleInteractionStart(element, card) {
    if (cardHoverState === 0) {
      bg.transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 0.2);

      fadeOut(element);
      cardHoverState = 1;
      activeGroup = element;
    }
  }

  function showCard(card) {
    if (cardHoverState === 1) {
      fadeOutCards();
      if (card) {
        card.style.opacity = "1";
        card.style.display = "flex";
        activeCard = card;
      }
      cardHoverState = 2;
    }
  }

  theGroups.each(function() {
    const element = d3.select(this);
    const cardId = element.attr("id");
    const card = document.querySelector(`.card-coast#${cardId}`);

    if (isTouchDevice) {
      // Touch device interaction
      element.on("touchstart", function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (cardHoverState === 0) {
          handleInteractionStart(element, card);
        } else if (cardHoverState === 1) {
          showCard(card);
        }
      });

    } else {
      // Mouse interaction
      element
        .on("mouseenter", function() {
          if (cardHoverState === 0) {
            handleInteractionStart(element, card);
          }
        })
        .on("mouseleave", function() {
          if (cardHoverState === 1 && activeGroup === element) {
            resetState();
          }
        })
        .on("click", function(event) {
          event.stopPropagation();
          if (cardHoverState === 1) {
            showCard(card);
          }
        });
    }
  });

  // Use event delegation for handling closing interactions
  document.addEventListener(isTouchDevice ? "touchstart" : "click", function(event) {
    if (cardHoverState !== 2) return;

    const clickedCard = event.target.closest('.card-coast');
    const clickedGroup = event.target.closest('.script-interact');
    
    // Only close if clicking outside both the active card and interactive elements
    if (!clickedCard && !clickedGroup) {
      resetState();
    }
    // If clicking a different interactive element while a card is open,
    // prevent the interaction until the current card is closed
    else if (clickedGroup && activeCard) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, { passive: false });
}