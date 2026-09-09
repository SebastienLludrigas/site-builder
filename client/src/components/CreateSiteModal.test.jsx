import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateSiteModal from './CreateSiteModal';

describe('CreateSiteModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <CreateSiteModal isOpen={false} onClose={vi.fn()} onSiteCreated={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('blocks submission and shows an error when the title is blank', async () => {
    const onSiteCreated = vi.fn();
    global.fetch = vi.fn();

    render(<CreateSiteModal isOpen={true} onClose={vi.fn()} onSiteCreated={onSiteCreated} />);

    const nameInput = screen.getByPlaceholderText(/Skyline Studio/i);
    fireEvent.change(nameInput, { target: { value: '   ' } });
    // Whitespace-only title clears the auto-generated slug; give it a manual
    // value so the browser's native `required` validation doesn't swallow
    // the submit event before our own "blank title" check ever runs.
    fireEvent.change(screen.getByPlaceholderText('my-site'), { target: { value: 'manual-slug' } });
    fireEvent.click(screen.getByRole('button', { name: /Create & Open Editor/i }));

    expect(await screen.findByText(/Please provide a name/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(onSiteCreated).not.toHaveBeenCalled();
  });

  it('auto-generates a URL-safe slug from the title', async () => {
    const user = userEvent.setup();
    render(<CreateSiteModal isOpen={true} onClose={vi.fn()} onSiteCreated={vi.fn()} />);

    const nameInput = screen.getByPlaceholderText(/Skyline Studio/i);
    await user.type(nameInput, 'Café Déjà Vu!!');

    const slugInput = screen.getByPlaceholderText('my-site');
    expect(slugInput.value).toBe('cafe-deja-vu');
  });

  it('submits the form and reports the created site', async () => {
    const onSiteCreated = vi.fn();
    const onClose = vi.fn();
    const createdSite = { id: 'site-1', title: 'My Site', slug: 'my-site' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => createdSite
    });

    render(<CreateSiteModal isOpen={true} onClose={onClose} onSiteCreated={onSiteCreated} />);

    fireEvent.change(screen.getByPlaceholderText(/Skyline Studio/i), {
      target: { value: 'My Site' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Create & Open Editor/i }));

    await waitFor(() => expect(onSiteCreated).toHaveBeenCalledWith(createdSite));
    expect(onClose).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('/api/sites', expect.objectContaining({
      method: 'POST'
    }));
  });

  it('surfaces the server error message when creation fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Slug already taken' })
    });

    render(<CreateSiteModal isOpen={true} onClose={vi.fn()} onSiteCreated={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/Skyline Studio/i), {
      target: { value: 'Taken Site' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Create & Open Editor/i }));

    expect(await screen.findByText('Slug already taken')).toBeInTheDocument();
  });
});
