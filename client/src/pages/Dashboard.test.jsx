import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Dashboard from './Dashboard';
import { ToastProvider } from '../context/ToastContext';

function renderDashboard(props = {}) {
  return render(
    <ToastProvider>
      <Dashboard onOpenEditor={vi.fn()} {...props} />
    </ToastProvider>
  );
}

function makeSite(overrides = {}) {
  return {
    id: 'site-1',
    title: 'My Bakery',
    slug: 'my-bakery',
    description: 'A cozy bakery',
    published: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    sectionsCount: 3,
    submissionsCount: 0,
    unreadSubmissionsCount: 0,
    views: 0,
    heroImage: null,
    theme: { primaryColor: '#4f46e5' },
    ...overrides
  };
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows a loading skeleton while sites are being fetched', () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    renderDashboard();
    expect(screen.getByRole('status', { name: 'Loading your websites' })).toBeInTheDocument();
  });

  it('renders fetched sites once loaded', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [makeSite()] });
    renderDashboard();
    expect(await screen.findByText('My Bakery')).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: 'Loading your websites' })).not.toBeInTheDocument();
  });

  it('shows an empty state with a create action when there are no sites', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    renderDashboard();
    expect(await screen.findByText('No websites found')).toBeInTheDocument();
    expect(screen.getByText('Start by creating your first website now!')).toBeInTheDocument();
  });

  it('filters sites by the search box', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [makeSite({ id: 's1', title: 'Bakery' }), makeSite({ id: 's2', title: 'Photo Studio' })]
    });
    renderDashboard();
    await screen.findByText('Bakery');

    fireEvent.change(screen.getByPlaceholderText('Search websites...'), { target: { value: 'photo' } });
    expect(screen.queryByText('Bakery')).not.toBeInTheDocument();
    expect(screen.getByText('Photo Studio')).toBeInTheDocument();
  });

  it('defaults to sorting by last updated, most recent first', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        makeSite({ id: 's1', title: 'Older', updatedAt: '2026-01-01T00:00:00.000Z' }),
        makeSite({ id: 's2', title: 'Newer', updatedAt: '2026-06-01T00:00:00.000Z' })
      ]
    });
    renderDashboard();
    await screen.findByText('Older');

    const titles = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    expect(titles).toEqual(['Newer', 'Older']);
  });

  it('sorts alphabetically when "Name A–Z" is selected', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        makeSite({ id: 's1', title: 'Zebra Site' }),
        makeSite({ id: 's2', title: 'Alpha Site' })
      ]
    });
    renderDashboard();
    await screen.findByText('Zebra Site');

    fireEvent.change(screen.getByLabelText('Sort websites by'), { target: { value: 'name' } });
    const titles = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    expect(titles).toEqual(['Alpha Site', 'Zebra Site']);
  });

  it('sorts by view count when "Most views" is selected', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        makeSite({ id: 's1', title: 'Quiet Site', views: 3 }),
        makeSite({ id: 's2', title: 'Popular Site', views: 200 })
      ]
    });
    renderDashboard();
    await screen.findByText('Quiet Site');

    fireEvent.change(screen.getByLabelText('Sort websites by'), { target: { value: 'views' } });
    const titles = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
    expect(titles).toEqual(['Popular Site', 'Quiet Site']);
  });

  it('filters sites by published/draft tab', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        makeSite({ id: 's1', title: 'Live Site', published: true }),
        makeSite({ id: 's2', title: 'Draft Site', published: false })
      ]
    });
    renderDashboard();
    await screen.findByText('Live Site');

    fireEvent.click(screen.getByRole('button', { name: /Drafts/i }));
    expect(screen.queryByText('Live Site')).not.toBeInTheDocument();
    expect(screen.getByText('Draft Site')).toBeInTheDocument();
  });

  it('deletes a site after confirming in the dialog and shows a success toast', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [makeSite({ title: 'Doomed Site' })] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    renderDashboard();
    await screen.findByText('Doomed Site');

    fireEvent.click(screen.getByTitle('Delete website'));
    const dialog = screen.getByRole('alertdialog');
    expect(within(dialog).getByText('Delete website', { selector: 'h2' })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete website' }));

    await waitFor(() => expect(screen.queryByText('Doomed Site')).not.toBeInTheDocument());
    expect(await screen.findByText('"Doomed Site" was deleted.')).toBeInTheDocument();
  });

  it('shows an error toast when deleting a site fails', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [makeSite({ title: 'Stubborn Site' })] })
      .mockResolvedValueOnce({ ok: false });

    renderDashboard();
    await screen.findByText('Stubborn Site');

    fireEvent.click(screen.getByTitle('Delete website'));
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Delete website' }));

    expect(await screen.findByText('The server could not delete this website.')).toBeInTheDocument();
    expect(screen.getByText('Stubborn Site')).toBeInTheDocument(); // not removed on failure
  });

  it('cancelling the delete confirmation keeps the site', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [makeSite({ title: 'Safe Site' })] });
    renderDashboard();
    await screen.findByText('Safe Site');

    fireEvent.click(screen.getByTitle('Delete website'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Safe Site')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1); // only the initial GET, no DELETE call
  });

  it('copies the live site link to the clipboard', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [makeSite({ slug: 'my-bakery' })] });
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    renderDashboard();
    await screen.findByText('My Bakery');

    fireEvent.click(screen.getByTitle('Copy live website link'));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/site/my-bakery`));
    expect(await screen.findByText('Link copied to clipboard.')).toBeInTheDocument();
  });

  it('shows an error toast when copying the link fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [makeSite({ slug: 'my-bakery' })] });
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    renderDashboard();
    await screen.findByText('My Bakery');

    fireEvent.click(screen.getByTitle('Copy live website link'));

    expect(await screen.findByText(/Could not copy the link/i)).toBeInTheDocument();
  });
});
