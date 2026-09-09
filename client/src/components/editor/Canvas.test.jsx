import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Canvas from './Canvas';
import { AVAILABLE_SECTIONS } from '../../data/defaultTemplates';

function renderCanvas(sections) {
  const site = {
    theme: {},
    settings: {},
    sections
  };
  return render(
    <Canvas
      site={site}
      viewport="desktop"
      isPreviewMode={false}
      selectedSectionId={null}
      onSelectSection={vi.fn()}
      onEditSection={vi.fn()}
      onMoveSection={vi.fn()}
      onDuplicateSection={vi.fn()}
      onDeleteSection={vi.fn()}
      onInsertSectionAt={vi.fn()}
      onPickImageForSection={vi.fn()}
    />
  );
}

describe('Canvas', () => {
  it('renders a real preview for every section type the Add Section library offers, not the "unknown type" placeholder', () => {
    // Regression guard: Canvas's switch previously had no case for
    // "testimonials", so any site using that (very common) section type
    // silently fell through to the "Section type: testimonials" placeholder
    // in the live editor, even though the hosted-site renderer supported it.
    for (const sec of AVAILABLE_SECTIONS) {
      const { unmount } = renderCanvas([{ id: `sec-${sec.type}`, type: sec.type, data: sec.defaultData }]);
      expect(
        screen.queryByText(`Section type: ${sec.type}`),
        `Canvas has no real renderer for section type "${sec.type}"`
      ).not.toBeInTheDocument();
      unmount();
    }
  });

  it('renders an empty-state prompt when the site has no sections', () => {
    renderCanvas([]);
    expect(screen.getByText(/Add New Section|no sections|empty/i)).toBeInTheDocument();
  });

  it('shows the SiteCraft branding badge unless it is explicitly disabled', () => {
    const { rerender } = render(
      <Canvas
        site={{ theme: {}, settings: {}, sections: [] }}
        viewport="desktop"
        isPreviewMode={false}
        selectedSectionId={null}
        onSelectSection={vi.fn()}
        onEditSection={vi.fn()}
        onMoveSection={vi.fn()}
        onDuplicateSection={vi.fn()}
        onDeleteSection={vi.fn()}
        onInsertSectionAt={vi.fn()}
        onPickImageForSection={vi.fn()}
      />
    );
    expect(screen.getByText(/Powered by/i)).toBeInTheDocument();

    rerender(
      <Canvas
        site={{ theme: {}, settings: { showBranding: false }, sections: [] }}
        viewport="desktop"
        isPreviewMode={false}
        selectedSectionId={null}
        onSelectSection={vi.fn()}
        onEditSection={vi.fn()}
        onMoveSection={vi.fn()}
        onDuplicateSection={vi.fn()}
        onDeleteSection={vi.fn()}
        onInsertSectionAt={vi.fn()}
        onPickImageForSection={vi.fn()}
      />
    );
    expect(screen.queryByText(/Powered by/i)).not.toBeInTheDocument();
  });
});
