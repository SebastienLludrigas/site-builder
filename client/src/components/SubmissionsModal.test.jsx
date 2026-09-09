import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import SubmissionsModal from './SubmissionsModal';
import { ToastProvider } from '../context/ToastContext';

function renderModal(props = {}) {
  return render(
    <ToastProvider>
      <SubmissionsModal isOpen={true} onClose={vi.fn()} sites={sitesFixture} {...props} />
    </ToastProvider>
  );
}

const sitesFixture = [
  { id: 'site-1', slug: 'bakery', title: 'Bakery' },
  { id: 'site-2', slug: 'studio', title: 'Photo Studio' }
];

function makeSubmission(overrides = {}) {
  return {
    id: 'sub-1',
    siteId: 'site-1',
    siteSlug: 'bakery',
    createdAt: '2026-01-01T10:00:00.000Z',
    data: { name: 'Jane Doe', email: 'jane@example.com', message: 'Hello there' },
    ...overrides
  };
}

describe('SubmissionsModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <ToastProvider>
        <SubmissionsModal isOpen={false} onClose={vi.fn()} sites={sitesFixture} />
      </ToastProvider>
    );
    // ToastProvider still renders its (empty) toast stack container
    expect(container.querySelector('.fixed.inset-0')).not.toBeInTheDocument();
  });

  it('shows a loading skeleton, then the fetched messages', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [makeSubmission()] });
    renderModal();
    expect(screen.getByRole('status', { name: 'Loading messages' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Jane Doe' })).toBeInTheDocument();
  });

  it('shows an empty state when there are no messages', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    renderModal();
    expect(await screen.findByText('No messages received yet.')).toBeInTheDocument();
  });

  it('auto-selects the first message and shows its detail', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [makeSubmission(), makeSubmission({ id: 'sub-2', data: { name: 'Second Person' } })]
    });
    renderModal();
    expect(await screen.findByRole('heading', { name: 'Jane Doe' })).toBeInTheDocument();
  });

  it('switches the detail panel when a different message is clicked', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        makeSubmission({ id: 'sub-1', data: { name: 'First Person' } }),
        makeSubmission({ id: 'sub-2', data: { name: 'Second Person' } })
      ]
    });
    renderModal();
    await screen.findByRole('heading', { name: 'First Person' });

    fireEvent.click(screen.getByText('Second Person'));
    expect(screen.getByRole('heading', { name: 'Second Person' })).toBeInTheDocument();
  });

  it('filters messages by website via the dropdown', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        makeSubmission({ id: 'sub-1', siteId: 'site-1', data: { name: 'Bakery Lead' } }),
        makeSubmission({ id: 'sub-2', siteId: 'site-2', data: { name: 'Studio Lead' } })
      ]
    });
    renderModal();
    await screen.findByRole('heading', { name: 'Bakery Lead' });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'site-2' } });
    // The list panel drops the non-matching lead; the detail panel keeps
    // showing whatever was already selected, filter or not.
    expect(screen.queryByRole('button', { name: /Bakery Lead/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Studio Lead/ })).toBeInTheDocument();
  });

  it('deletes the active message after confirming, and picks a new active message', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          makeSubmission({ id: 'sub-1', data: { name: 'First Person' } }),
          makeSubmission({ id: 'sub-2', data: { name: 'Second Person' } })
        ]
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    renderModal();
    await screen.findByRole('heading', { name: 'First Person' });

    fireEvent.click(screen.getByTitle('Delete message'));
    const dialog = screen.getByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete message' }));

    await waitFor(() => expect(screen.queryByText('First Person')).not.toBeInTheDocument());
    expect(await screen.findByText('Message deleted.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Second Person' })).toBeInTheDocument();
  });

  it('cancelling the delete confirmation keeps the message', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [makeSubmission()] });
    renderModal();
    await screen.findByRole('heading', { name: 'Jane Doe' });

    fireEvent.click(screen.getByTitle('Delete message'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('heading', { name: 'Jane Doe' })).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('closes when Escape is pressed', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    const onClose = vi.fn();
    renderModal({ onClose });
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
