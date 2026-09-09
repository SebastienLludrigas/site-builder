import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('fires the corresponding callback for each action button', () => {
    const onNewSite = vi.fn();
    const onOpenInbox = vi.fn();
    const onResetDemos = vi.fn();

    render(
      <Navbar
        onNewSite={onNewSite}
        onOpenInbox={onOpenInbox}
        onResetDemos={onResetDemos}
        totalSubmissions={0}
        unreadCount={0}
      />
    );

    fireEvent.click(screen.getByTitle(/View all form submissions/i));
    expect(onOpenInbox).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle(/Restore the 4 official showcase/i));
    expect(onResetDemos).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Create Website'));
    expect(onNewSite).toHaveBeenCalledTimes(1);
  });

  it('shows no badge when there are no submissions', () => {
    render(<Navbar onNewSite={vi.fn()} onOpenInbox={vi.fn()} onResetDemos={vi.fn()} totalSubmissions={0} unreadCount={0} />);
    const inboxButton = screen.getByTitle(/View all form submissions/i);
    expect(inboxButton.textContent).not.toMatch(/\d/);
  });

  it('shows the total count badge when there are read submissions but none unread', () => {
    render(<Navbar onNewSite={vi.fn()} onOpenInbox={vi.fn()} onResetDemos={vi.fn()} totalSubmissions={5} unreadCount={0} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('prioritizes the unread count badge over the total count', () => {
    render(<Navbar onNewSite={vi.fn()} onOpenInbox={vi.fn()} onResetDemos={vi.fn()} totalSubmissions={5} unreadCount={2} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText('5')).not.toBeInTheDocument();
  });
});
