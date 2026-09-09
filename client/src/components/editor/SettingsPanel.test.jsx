import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsPanel from './SettingsPanel';

function baseSite(overrides = {}) {
  return {
    title: 'My Site',
    slug: 'my-site',
    description: '',
    published: true,
    settings: { favicon: '🌐', showBranding: true, contactEmail: '' },
    ...overrides
  };
}

describe('SettingsPanel', () => {
  it('calls onUpdateTitle when the title field changes', () => {
    const onUpdateTitle = vi.fn();
    render(
      <SettingsPanel
        site={baseSite()}
        onUpdateSettings={vi.fn()}
        onUpdateSlug={vi.fn()}
        onUpdateTitle={onUpdateTitle}
        onUpdatePublished={vi.fn()}
      />
    );
    fireEvent.change(screen.getByDisplayValue('My Site'), { target: { value: 'New Title' } });
    expect(onUpdateTitle).toHaveBeenCalledWith('New Title');
  });

  it('sanitizes the slug field to lowercase alphanumerics and dashes', () => {
    const onUpdateSlug = vi.fn();
    render(
      <SettingsPanel
        site={baseSite()}
        onUpdateSettings={vi.fn()}
        onUpdateSlug={onUpdateSlug}
        onUpdateTitle={vi.fn()}
        onUpdatePublished={vi.fn()}
      />
    );
    fireEvent.change(screen.getByDisplayValue('my-site'), { target: { value: 'My Cool Site!! 2' } });
    expect(onUpdateSlug).toHaveBeenCalledWith('mycoolsite2');
  });

  it('selects a favicon emoji via onUpdateSettings, preserving other settings fields', () => {
    const onUpdateSettings = vi.fn();
    render(
      <SettingsPanel
        site={baseSite()}
        onUpdateSettings={onUpdateSettings}
        onUpdateSlug={vi.fn()}
        onUpdateTitle={vi.fn()}
        onUpdatePublished={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('🥐'));
    expect(onUpdateSettings).toHaveBeenCalledWith(expect.objectContaining({
      favicon: '🥐',
      showBranding: true
    }));
  });

  it('toggles published status', () => {
    const onUpdatePublished = vi.fn();
    render(
      <SettingsPanel
        site={baseSite({ published: true })}
        onUpdateSettings={vi.fn()}
        onUpdateSlug={vi.fn()}
        onUpdateTitle={vi.fn()}
        onUpdatePublished={onUpdatePublished}
      />
    );
    fireEvent.click(screen.getByText('Published Status').parentElement.parentElement.querySelector('input[type="checkbox"]'));
    expect(onUpdatePublished).toHaveBeenCalledWith(false);
  });

  it('toggles the SiteCraft branding badge', () => {
    const onUpdateSettings = vi.fn();
    render(
      <SettingsPanel
        site={baseSite()}
        onUpdateSettings={onUpdateSettings}
        onUpdateSlug={vi.fn()}
        onUpdateTitle={vi.fn()}
        onUpdatePublished={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('SiteCraft Badge').parentElement.parentElement.querySelector('input[type="checkbox"]'));
    expect(onUpdateSettings).toHaveBeenCalledWith(expect.objectContaining({ showBranding: false }));
  });
});
