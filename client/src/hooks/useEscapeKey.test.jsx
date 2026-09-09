import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useEscapeKey } from './useEscapeKey';

function TestHarness({ isOpen, onClose }) {
  useEscapeKey(isOpen, onClose);
  return null;
}

describe('useEscapeKey', () => {
  it('calls onClose when Escape is pressed while open', () => {
    const onClose = vi.fn();
    render(<TestHarness isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does nothing when closed', () => {
    const onClose = vi.fn();
    render(<TestHarness isOpen={false} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores other keys', () => {
    const onClose = vi.fn();
    render(<TestHarness isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('stops listening after unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(<TestHarness isOpen={true} onClose={onClose} />);
    unmount();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
