import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./pages/Dashboard', () => ({
  default: () => <div>Dashboard Page</div>
}));

vi.mock('./pages/Editor', () => ({
  default: ({ siteId }) => <div>Editor Page for {siteId}</div>
}));

function setPath(path) {
  window.history.pushState({}, '', path);
}

describe('App routing', () => {
  afterEach(() => {
    setPath('/');
  });

  it('renders the Dashboard at the root path', () => {
    setPath('/');
    render(<App />);
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
  });

  it('renders the Editor for a /editor/:siteId path', () => {
    setPath('/editor/site-abc-123');
    render(<App />);
    expect(screen.getByText('Editor Page for site-abc-123')).toBeInTheDocument();
  });

  it('renders the Editor for a #/editor/:siteId hash path', () => {
    setPath('/#/editor/site-hash-1');
    render(<App />);
    expect(screen.getByText('Editor Page for site-hash-1')).toBeInTheDocument();
  });
});
