import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemePanel from './ThemePanel';
import { THEME_PALETTES, TYPOGRAPHY_PRESETS } from '../../data/defaultTemplates';

describe('ThemePanel', () => {
  it('applies a full palette (all 5 colors) when a preset is clicked', () => {
    const onUpdateTheme = vi.fn();
    render(<ThemePanel theme={{}} onUpdateTheme={onUpdateTheme} />);

    const preset = THEME_PALETTES[1]; // Cyber Indigo
    fireEvent.click(screen.getByText(preset.name));

    expect(onUpdateTheme).toHaveBeenCalledWith(expect.objectContaining({
      palette: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor
    }));
  });

  it('applies a typography preset without touching colors', () => {
    const onUpdateTheme = vi.fn();
    const theme = { primaryColor: '#123456' };
    render(<ThemePanel theme={theme} onUpdateTheme={onUpdateTheme} />);

    const preset = TYPOGRAPHY_PRESETS[0];
    fireEvent.click(screen.getByText(preset.name));

    expect(onUpdateTheme).toHaveBeenCalledWith({
      primaryColor: '#123456',
      fontHeading: preset.heading,
      fontBody: preset.body
    });
  });

  it('applies a border radius choice', () => {
    const onUpdateTheme = vi.fn();
    render(<ThemePanel theme={{}} onUpdateTheme={onUpdateTheme} />);

    fireEvent.click(screen.getByText('Rounded'));

    expect(onUpdateTheme).toHaveBeenCalledWith(expect.objectContaining({ borderRadius: 'rounded-2xl' }));
  });

  it('updates a single custom color via its color input without affecting others', () => {
    const onUpdateTheme = vi.fn();
    const theme = { primaryColor: '#111111', accentColor: '#222222' };
    render(<ThemePanel theme={theme} onUpdateTheme={onUpdateTheme} />);

    const primaryColorInput = screen.getByDisplayValue('#111111');
    fireEvent.change(primaryColorInput, { target: { value: '#abcdef' } });

    expect(onUpdateTheme).toHaveBeenCalledWith({
      primaryColor: '#abcdef',
      accentColor: '#222222'
    });
  });
});
