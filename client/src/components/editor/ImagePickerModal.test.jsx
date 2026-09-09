import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImagePickerModal from './ImagePickerModal';
import { CURATED_IMAGES } from '../../data/curatedImages';

describe('ImagePickerModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <ImagePickerModal isOpen={false} onClose={vi.fn()} onSelectImage={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('opens on the curated library tab, showing the first category', () => {
    render(<ImagePickerModal isOpen={true} onClose={vi.fn()} onSelectImage={vi.fn()} />);
    const firstImage = CURATED_IMAGES[0].images[0];
    expect(screen.getByAltText(firstImage.alt)).toBeInTheDocument();
  });

  it('selects a curated image and closes', () => {
    const onSelectImage = vi.fn();
    const onClose = vi.fn();
    render(<ImagePickerModal isOpen={true} onClose={onClose} onSelectImage={onSelectImage} />);

    const firstImage = CURATED_IMAGES[0].images[0];
    fireEvent.click(screen.getByAltText(firstImage.alt));

    expect(onSelectImage).toHaveBeenCalledWith(firstImage.url);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('switches categories within the curated library', () => {
    render(<ImagePickerModal isOpen={true} onClose={vi.fn()} onSelectImage={vi.fn()} />);
    const secondCategory = CURATED_IMAGES[1];

    fireEvent.click(screen.getByRole('button', { name: secondCategory.category }));

    expect(screen.getByAltText(secondCategory.images[0].alt)).toBeInTheDocument();
  });

  it('uploads a file on the Upload tab and applies the returned URL', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ url: '/uploads/image-123.png' }) });
    const onSelectImage = vi.fn();
    const onClose = vi.fn();

    render(<ImagePickerModal isOpen={true} onClose={onClose} onSelectImage={onSelectImage} />);
    fireEvent.click(screen.getByRole('button', { name: /Upload from Computer/i }));

    const file = new File(['(binary)'], 'photo.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => expect(onSelectImage).toHaveBeenCalledWith('/uploads/image-123.png'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({ method: 'POST' }));
  });

  it('shows an error message when the upload fails, without closing', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const onClose = vi.fn();

    render(<ImagePickerModal isOpen={true} onClose={onClose} onSelectImage={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Upload from Computer/i }));

    const file = new File(['(binary)'], 'photo.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(await screen.findByText('Failed to upload image file.')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies a pasted external URL on the URL tab', () => {
    const onSelectImage = vi.fn();
    const onClose = vi.fn();
    render(<ImagePickerModal isOpen={true} onClose={onClose} onSelectImage={onSelectImage} />);

    fireEvent.click(screen.getByRole('button', { name: /External Image URL/i }));
    fireEvent.change(screen.getByPlaceholderText('https://images.unsplash.com/...'), {
      target: { value: 'https://example.com/photo.jpg' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Apply Image' }));

    expect(onSelectImage).toHaveBeenCalledWith('https://example.com/photo.jpg');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<ImagePickerModal isOpen={true} onClose={onClose} onSelectImage={vi.fn()} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
