import React from 'react';
import './Pagination.css';

/**
 * Pagination component
 * Provides navigation controls for paginated content
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current active page
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onChange - Function called when page is changed
 * @param {number} props.siblingCount - Number of sibling pages to show (default: 1)
 */
const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onChange, 
  siblingCount = 1
}) => {
  // Generate range of numbers
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };
  
  // Create page numbers array with dots for skipped pages
  const createPagination = () => {
    // If there are fewer than 7 + (siblingCount * 2) pages, show all
    if (totalPages <= 7 + (siblingCount * 2)) {
      return range(1, totalPages);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;
    
    // Constants
    const firstPageIndex = 1;
    const lastPageIndex = totalPages;
    
    // Case: Show right dots only
    if (!showLeftDots && showRightDots) {
      const leftRange = range(1, 3 + (siblingCount * 2));
      return [...leftRange, '...', lastPageIndex];
    }
    
    // Case: Show left dots only
    if (showLeftDots && !showRightDots) {
      const rightRange = range(totalPages - (3 + siblingCount * 2) + 1, totalPages);
      return [firstPageIndex, '...', ...rightRange];
    }
    
    // Case: Show both dots
    if (showLeftDots && showRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }
  };
  
  const pages = createPagination();
  
  // Go to previous page
  const goToPrevious = () => {
    if (currentPage > 1) {
      onChange(currentPage - 1);
    }
  };
  
  // Go to next page
  const goToNext = () => {
    if (currentPage < totalPages) {
      onChange(currentPage + 1);
    }
  };
  
  // Early return if only one page
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="pagination">
      <button
        className="pagination-arrow"
        onClick={goToPrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <div className="pagination-pages">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className="pagination-ellipsis">
                &hellip;
              </span>
            );
          }
          
          return (
            <button
              key={page}
              className={`pagination-page ${currentPage === page ? 'active' : ''}`}
              onClick={() => onChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      <button
        className="pagination-arrow"
        onClick={goToNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination; 