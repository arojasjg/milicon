/**
 * Animation helper functions for notifications
 */

/**
 * Adds an animation class and removes it after animation completes
 * @param {HTMLElement} element - The DOM element to animate
 * @param {string} animationClass - CSS class that defines the animation
 * @param {number} duration - Animation duration in ms
 * @returns {Promise} Resolves when animation completes
 */
export const animateElement = (element, animationClass, duration = 300) => {
  return new Promise(resolve => {
    if (!element) {
      resolve();
      return;
    }
    
    // Add the animation class
    element.classList.add(animationClass);
    
    // Remove the class after animation completes
    setTimeout(() => {
      element.classList.remove(animationClass);
      resolve();
    }, duration);
  });
};

/**
 * Performs exit animation on an element before removal
 * @param {HTMLElement} element - The DOM element to animate
 * @param {string} exitClass - CSS class for exit animation
 * @param {Function} onComplete - Callback after animation completes
 * @param {number} duration - Animation duration in ms
 */
export const animateExit = (element, exitClass, onComplete, duration = 300) => {
  if (!element) {
    if (onComplete) onComplete();
    return;
  }
  
  // Add exit animation class
  element.classList.add(exitClass);
  
  // Wait for animation to complete then call onComplete
  setTimeout(() => {
    if (onComplete) onComplete();
  }, duration);
}; 