// scrollCapture.js
export function captureScroll(callback) {
  let startX = 0, startY = 0;

  // Handle desktop/laptop scroll (wheel event)
  function handleWheelEvent(event) {
    let direction = {
      vertical: event.deltaY > 0 ? 'down' : 'up',
      horizontal: event.deltaX > 0 ? 'right' : 'left'
    };
    callback(direction);
  }

  // Handle touch start on mobile devices
  function handleTouchStart(event) {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }

  // Handle touch move on mobile devices
  function handleTouchMove(event) {
    const moveX = event.touches[0].clientX;
    const moveY = event.touches[0].clientY;

    const diffX = startX - moveX;
    const diffY = startY - moveY;

    let direction;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal scroll
      direction = diffX > 0 ? 'left' : 'right';
    } else {
      // Vertical scroll
      direction = diffY > 0 ? 'up' : 'down';
    }

    callback({ vertical: direction === 'up' || direction === 'down' ? direction : null, 
               horizontal: direction === 'left' || direction === 'right' ? direction : null });
  }

  // Attach event listeners
  window.addEventListener('wheel', handleWheelEvent);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove);

  // Provide a cleanup function to remove event listeners if necessary
  return function cleanup() {
    window.removeEventListener('wheel', handleWheelEvent);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
  };
}
