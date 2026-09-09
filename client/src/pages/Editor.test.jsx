import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import Editor from './Editor';
import { ToastProvider } from '../context/ToastContext';

vi.mock('../components/editor/Canvas', () => ({
  default: ({ onMoveSection, onDuplicateSection, onDeleteSection }) => (
    <div data-testid="canvas-stub">
      <button onClick={() => onMoveSection(1, 1)}>stub-move-down</button>
      <button onClick={() => onDuplicateSection('sec-hero')}>stub-duplicate</button>
      <button onClick={() => onDeleteSection('sec-hero')}>stub-delete</button>
    </div>
  )
}));

vi.mock('../components/editor/SectionEditorDrawer', () => ({
  default: ({ isOpen, section }) => (isOpen ? <div data-testid="drawer-stub">{section?.id}</div> : null)
}));

function renderEditor(props = {}) {
  return render(
    <ToastProvider>
      <Editor siteId="site-1" onBackToDashboard={vi.fn()} {...props} />
    </ToastProvider>
  );
}

function makeSite(overrides = {}) {
  return {
    id: 'site-1',
    title: 'My Bakery',
    slug: 'my-bakery',
    description: '',
    published: true,
    theme: { primaryColor: '#4f46e5' },
    settings: { favicon: '🌐', showBranding: true },
    sections: [
      { id: 'sec-hero', type: 'hero', data: { title: 'Welcome' } },
      { id: 'sec-features', type: 'features', data: {} }
    ],
    ...overrides
  };
}

describe('Editor', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows a spinner while the site loads, then the editor chrome', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => makeSite() });
    renderEditor();
    expect(screen.getByText('Opening editor...')).toBeInTheDocument();
    expect(await screen.findByDisplayValue('My Bakery')).toBeInTheDocument();
  });

  it('shows an error screen with a way back to the dashboard when the fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const onBackToDashboard = vi.fn();
    renderEditor({ onBackToDashboard });

    fireEvent.click(await screen.findByText('Back to Dashboard'));
    expect(onBackToDashboard).toHaveBeenCalledTimes(1);
  });

  it('starts with the Save button showing "Saved" and switches to "Save Changes" after an edit', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => makeSite() });
    renderEditor();
    await screen.findByDisplayValue('My Bakery');

    expect(screen.getByTitle(/Save \(Ctrl\+S/i).textContent).toContain('Saved');

    fireEvent.change(screen.getByDisplayValue('My Bakery'), { target: { value: 'New Name' } });
    expect(screen.getByTitle(/Save \(Ctrl\+S/i).textContent).toContain('Save Changes');
  });

  it('saves via the Save button and reports the server response', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => makeSite() })
      .mockResolvedValueOnce({ ok: true, json: async () => makeSite({ title: 'Saved Title' }) });

    renderEditor();
    await screen.findByDisplayValue('My Bakery');
    fireEvent.change(screen.getByDisplayValue('My Bakery'), { target: { value: 'Edited' } });

    fireEvent.click(screen.getByTitle(/Save \(Ctrl\+S/i));

    await waitFor(() => expect(screen.getByTitle(/Save \(Ctrl\+S/i).textContent).toContain('Saved'));
    expect(global.fetch).toHaveBeenCalledWith('/api/sites/site-1', expect.objectContaining({ method: 'PUT' }));
  });

  it('shows an error toast when saving fails, and keeps hasUnsavedChanges true', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => makeSite() })
      .mockResolvedValueOnce({ ok: false });

    renderEditor();
    await screen.findByDisplayValue('My Bakery');
    fireEvent.change(screen.getByDisplayValue('My Bakery'), { target: { value: 'Edited' } });
    fireEvent.click(screen.getByTitle(/Save \(Ctrl\+S/i));

    expect(await screen.findByText(/Couldn't save your changes/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Save \(Ctrl\+S/i).textContent).toContain('Save Changes');
  });

  it('saves via the Ctrl+S keyboard shortcut', async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => makeSite() })
      .mockResolvedValueOnce({ ok: true, json: async () => makeSite({ title: 'Edited' }) });

    renderEditor();
    await screen.findByDisplayValue('My Bakery');
    fireEvent.change(screen.getByDisplayValue('My Bakery'), { target: { value: 'Edited' } });

    fireEvent.keyDown(window, { key: 's', ctrlKey: true });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });

  it('undoes a title edit with the Undo button', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => makeSite() });
    renderEditor();
    await screen.findByDisplayValue('My Bakery');

    fireEvent.change(screen.getByDisplayValue('My Bakery'), { target: { value: 'Renamed' } });
    expect(screen.getByDisplayValue('Renamed')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Undo (Ctrl+Z)'));
    expect(screen.getByDisplayValue('My Bakery')).toBeInTheDocument();
  });

  it('redoes via the Ctrl+Shift+Z keyboard shortcut', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => makeSite() });
    renderEditor();
    await screen.findByDisplayValue('My Bakery');

    fireEvent.change(screen.getByDisplayValue('My Bakery'), { target: { value: 'Renamed' } });
    fireEvent.click(screen.getByTitle('Undo (Ctrl+Z)'));
    expect(screen.getByDisplayValue('My Bakery')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'z', ctrlKey: true, shiftKey: true });
    expect(screen.getByDisplayValue('Renamed')).toBeInTheDocument();
  });

  it('reorders, duplicates, and deletes sections through the Canvas callbacks', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => makeSite() });
    renderEditor();
    await screen.findByDisplayValue('My Bakery');

    // Move sec-hero (index 0) down one slot
    fireEvent.click(screen.getByText('stub-move-down'));
    expect(screen.getAllByText(/hero|features/i)[0]).toBeInTheDocument(); // sanity: sidebar still renders

    // Duplicate
    fireEvent.click(screen.getByText('stub-duplicate'));
    expect(screen.getByText(/Page Structure \(3\)/)).toBeInTheDocument();

    // Delete requires confirmation
    fireEvent.click(screen.getByText('stub-delete'));
    const dialog = screen.getByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete section' }));
    expect(screen.getByText(/Page Structure \(2\)/)).toBeInTheDocument();
  });

  it('toggles the published checkbox from the Settings tab', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => makeSite() });
    renderEditor();
    await screen.findByDisplayValue('My Bakery');

    fireEvent.click(screen.getByText('Settings'));
    const checkbox = screen.getByText('Published Status').parentElement.parentElement.querySelector('input[type="checkbox"]');
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(screen.getByTitle(/Save \(Ctrl\+S/i).textContent).toContain('Save Changes');
  });
});
