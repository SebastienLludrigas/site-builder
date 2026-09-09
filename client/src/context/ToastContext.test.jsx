import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';

function Trigger({ message = 'Hello', type = 'info', duration }) {
  const { showToast } = useToast();
  return <button onClick={() => showToast(message, type, duration)}>fire</button>;
}

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws when useToast is used outside a ToastProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const BadConsumer = () => {
      useToast();
      return null;
    };
    expect(() => render(<BadConsumer />)).toThrow(/ToastProvider/);
    consoleSpy.mockRestore();
  });

  it('shows a toast when showToast is called', () => {
    render(
      <ToastProvider>
        <Trigger message="Website duplicated." type="success" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('fire'));
    expect(screen.getByText('Website duplicated.')).toBeInTheDocument();
  });

  it('auto-dismisses a toast after its duration', () => {
    render(
      <ToastProvider>
        <Trigger message="Auto gone" duration={1000} />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('fire'));
    expect(screen.getByText('Auto gone')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText('Auto gone')).not.toBeInTheDocument();
  });

  it('dismisses a toast when its close button is clicked', () => {
    render(
      <ToastProvider>
        <Trigger message="Dismiss me" duration={0} />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText('fire'));
    expect(screen.getByText('Dismiss me')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Dismiss notification'));
    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  it('stacks multiple toasts independently', () => {
    render(
      <ToastProvider>
        <Trigger message="First" duration={0} />
        <Trigger message="Second" duration={0} />
      </ToastProvider>
    );
    const buttons = screen.getAllByText('fire');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
