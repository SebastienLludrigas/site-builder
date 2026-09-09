import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddSectionModal from './AddSectionModal';
import { AVAILABLE_SECTIONS } from '../../data/defaultTemplates';

describe('AddSectionModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <AddSectionModal isOpen={false} onClose={vi.fn()} onAddSection={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('lists every available section when open', () => {
    render(<AddSectionModal isOpen={true} onClose={vi.fn()} onAddSection={vi.fn()} />);
    for (const sec of AVAILABLE_SECTIONS) {
      expect(screen.getByText(sec.name)).toBeInTheDocument();
    }
  });

  it('filters sections by category', () => {
    render(<AddSectionModal isOpen={true} onClose={vi.fn()} onAddSection={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Commerce' }));

    const commerceSections = AVAILABLE_SECTIONS.filter(s => s.category === 'Commerce');
    const otherSections = AVAILABLE_SECTIONS.filter(s => s.category !== 'Commerce');

    for (const sec of commerceSections) {
      expect(screen.getByText(sec.name)).toBeInTheDocument();
    }
    for (const sec of otherSections) {
      expect(screen.queryByText(sec.name)).not.toBeInTheDocument();
    }
  });

  it('gives every distinct AVAILABLE_SECTIONS category a working filter pill', () => {
    // Regression guard: the category pill list is a hardcoded array separate
    // from AVAILABLE_SECTIONS, so a new/renamed category could silently make
    // some sections unreachable by filter (though still visible under "All").
    const categories = [...new Set(AVAILABLE_SECTIONS.map(s => s.category))];
    for (const category of categories) {
      const { unmount } = render(<AddSectionModal isOpen={true} onClose={vi.fn()} onAddSection={vi.fn()} />);
      fireEvent.click(screen.getByRole('button', { name: category }));
      const expected = AVAILABLE_SECTIONS.filter(s => s.category === category);
      for (const sec of expected) {
        expect(screen.getByText(sec.name), `category "${category}" should show "${sec.name}"`).toBeInTheDocument();
      }
      unmount();
    }
  });

  it('adds a deep-cloned section with a fresh id at the requested index and closes', () => {
    const onAddSection = vi.fn();
    const onClose = vi.fn();
    const target = AVAILABLE_SECTIONS[0];

    render(
      <AddSectionModal isOpen={true} onClose={onClose} onAddSection={onAddSection} insertIndex={3} />
    );
    fireEvent.click(screen.getByText(target.name));

    expect(onAddSection).toHaveBeenCalledTimes(1);
    const [newSection, insertIndex] = onAddSection.mock.calls[0];
    expect(newSection.type).toBe(target.type);
    expect(newSection.id).toMatch(new RegExp(`^${target.type}-\\d+$`));
    expect(newSection.data).toEqual(target.defaultData);
    expect(newSection.data).not.toBe(target.defaultData); // deep clone, not the same reference
    expect(insertIndex).toBe(3);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<AddSectionModal isOpen={true} onClose={onClose} onAddSection={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
