import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ConfirmDialog isOpen={false} title="t" message="m" onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the title and message when open', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete website"
        message="This can't be undone."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText('Delete website')).toBeInTheDocument();
    expect(screen.getByText("This can't be undone.")).toBeInTheDocument();
  });

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        title="t"
        message="m"
        confirmLabel="Delete it"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Delete it' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when clicking the backdrop or pressing Escape', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog isOpen={true} title="t" message="m" onConfirm={vi.fn()} onCancel={onCancel} />
    );
    fireEvent.click(screen.getByRole('alertdialog').parentElement);
    expect(onCancel).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('does not close when clicking inside the dialog itself', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog isOpen={true} title="t" message="m" onConfirm={vi.fn()} onCancel={onCancel} />
    );
    fireEvent.click(screen.getByRole('alertdialog'));
    expect(onCancel).not.toHaveBeenCalled();
  });
});
