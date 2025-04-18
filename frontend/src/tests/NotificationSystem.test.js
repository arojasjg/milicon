import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { NotificationProvider } from '../context/NotificationContext';
import { useNotifications } from '../hooks';

// Test component that will use our notification system
const TestComponent = () => {
  const notifications = useNotifications();
  
  return (
    <div>
      <button 
        data-testid="success-btn" 
        onClick={() => notifications.success('Success message')}
      >
        Show Success
      </button>
      
      <button 
        data-testid="error-btn" 
        onClick={() => notifications.error('Error message')}
      >
        Show Error
      </button>
      
      <button 
        data-testid="warning-btn" 
        onClick={() => notifications.warning('Warning message')}
      >
        Show Warning
      </button>
      
      <button 
        data-testid="info-btn" 
        onClick={() => notifications.info('Info message')}
      >
        Show Info
      </button>
      
      <button 
        data-testid="custom-btn" 
        onClick={() => notifications.notify({
          type: 'success',
          title: 'Custom Title',
          message: 'Custom message',
          duration: 1000
        })}
      >
        Show Custom
      </button>
      
      <button 
        data-testid="clear-btn" 
        onClick={() => notifications.clearAll()}
      >
        Clear All
      </button>
    </div>
  );
};

// Wrap component with provider for testing
const renderWithProvider = (component) => {
  return render(
    <NotificationProvider>
      {component}
    </NotificationProvider>
  );
};

describe('Notification System', () => {
  beforeEach(() => {
    // Set up a fake timer
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    // Clean up
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });
  
  test('should show success notification', () => {
    renderWithProvider(<TestComponent />);
    
    // Click the success button
    fireEvent.click(screen.getByTestId('success-btn'));
    
    // Check if notification appears
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(document.querySelector('.success')).toBeInTheDocument();
  });
  
  test('should show error notification', () => {
    renderWithProvider(<TestComponent />);
    
    // Click the error button
    fireEvent.click(screen.getByTestId('error-btn'));
    
    // Check if notification appears
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(document.querySelector('.error')).toBeInTheDocument();
  });
  
  test('should show warning notification', () => {
    renderWithProvider(<TestComponent />);
    
    // Click the warning button
    fireEvent.click(screen.getByTestId('warning-btn'));
    
    // Check if notification appears
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(document.querySelector('.warning')).toBeInTheDocument();
  });
  
  test('should show info notification', () => {
    renderWithProvider(<TestComponent />);
    
    // Click the info button
    fireEvent.click(screen.getByTestId('info-btn'));
    
    // Check if notification appears
    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(document.querySelector('.info')).toBeInTheDocument();
  });
  
  test('should show custom notification with title', () => {
    renderWithProvider(<TestComponent />);
    
    // Click the custom button
    fireEvent.click(screen.getByTestId('custom-btn'));
    
    // Check if notification appears with custom title
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });
  
  test('should auto-close notification after duration', () => {
    renderWithProvider(<TestComponent />);
    
    // Show notification
    fireEvent.click(screen.getByTestId('success-btn'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    // Fast-forward time to trigger auto-close
    act(() => {
      jest.advanceTimersByTime(5000); // Default duration
    });
    
    // Check if notification is removed
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });
  
  test('should close notification when close button is clicked', () => {
    renderWithProvider(<TestComponent />);
    
    // Show notification
    fireEvent.click(screen.getByTestId('success-btn'));
    
    // Find and click the close button
    const closeButton = document.querySelector('.notification-close');
    fireEvent.click(closeButton);
    
    // Fast-forward time to trigger animation
    act(() => {
      jest.advanceTimersByTime(300); // Animation duration
    });
    
    // Check if notification is removed
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });
  
  test('should clear all notifications', () => {
    renderWithProvider(<TestComponent />);
    
    // Show multiple notifications
    fireEvent.click(screen.getByTestId('success-btn'));
    fireEvent.click(screen.getByTestId('error-btn'));
    fireEvent.click(screen.getByTestId('warning-btn'));
    
    // Check if notifications appear
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    
    // Clear all notifications
    fireEvent.click(screen.getByTestId('clear-btn'));
    
    // Check if all notifications are removed
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    expect(screen.queryByText('Error message')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning message')).not.toBeInTheDocument();
  });
}); 