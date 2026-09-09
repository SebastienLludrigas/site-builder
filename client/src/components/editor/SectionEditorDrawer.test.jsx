import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SectionEditorDrawer from './SectionEditorDrawer';
import { AVAILABLE_SECTIONS } from '../../data/defaultTemplates';

function renderDrawer(section, props = {}) {
  return render(
    <SectionEditorDrawer
      isOpen={true}
      onClose={vi.fn()}
      section={section}
      onUpdateSection={vi.fn()}
      {...props}
    />
  );
}

describe('SectionEditorDrawer', () => {
  it('renders nothing when closed or without a section', () => {
    const { container: closed } = render(
      <SectionEditorDrawer isOpen={false} onClose={vi.fn()} section={{ type: 'hero', data: {} }} onUpdateSection={vi.fn()} />
    );
    expect(closed).toBeEmptyDOMElement();

    const { container: noSection } = render(
      <SectionEditorDrawer isOpen={true} onClose={vi.fn()} section={null} onUpdateSection={vi.fn()} />
    );
    expect(noSection).toBeEmptyDOMElement();
  });

  it('gives every AVAILABLE_SECTIONS type at least one editable field', () => {
    // Regression guard: this drawer previously had no form at all for the
    // "stats", "newsletter", and "ctaBanner" section types — the drawer
    // opened with just a header and zero inputs, so those sections could
    // only ever show their default template content, never be edited.
    for (const sec of AVAILABLE_SECTIONS) {
      const section = { id: `sec-${sec.type}`, type: sec.type, data: JSON.parse(JSON.stringify(sec.defaultData)) };
      const { container, unmount } = renderDrawer(section);
      const fieldCount = container.querySelectorAll('input, textarea, select').length;
      expect(fieldCount, `section type "${sec.type}" has no editable fields in the drawer`).toBeGreaterThan(0);
      unmount();
    }
  });

  it('updates a simple text field through onUpdateSection', () => {
    const onUpdateSection = vi.fn();
    const section = { id: 's1', type: 'ctaBanner', data: { title: 'Old Title' } };
    renderDrawer(section, { onUpdateSection });

    fireEvent.change(screen.getByDisplayValue('Old Title'), { target: { value: 'New Title' } });

    expect(onUpdateSection).toHaveBeenCalledWith(expect.objectContaining({
      id: 's1',
      data: expect.objectContaining({ title: 'New Title' })
    }));
  });

  it('adds and removes stat items', () => {
    const onUpdateSection = vi.fn();
    const section = {
      id: 's1',
      type: 'stats',
      data: { title: 'Numbers', items: [{ number: '98%', label: 'Satisfaction' }] }
    };
    const { rerender } = renderDrawer(section, { onUpdateSection });

    fireEvent.click(screen.getByText('Add Stat'));
    const added = onUpdateSection.mock.calls[0][0];
    expect(added.data.items).toHaveLength(2);

    rerender(<SectionEditorDrawer isOpen={true} onClose={vi.fn()} section={added} onUpdateSection={onUpdateSection} />);
    fireEvent.click(screen.getAllByRole('button').find(b => b.querySelector('.lucide-trash2')));
    const afterDelete = onUpdateSection.mock.calls[1][0];
    expect(afterDelete.data.items).toHaveLength(1);
  });

  it('closes when Escape is pressed and the nested image picker is not open', () => {
    const onClose = vi.fn();
    renderDrawer({ id: 's1', type: 'hero', data: {} }, { onClose });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
