import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner, { SkeletonCard, SkeletonText } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('generic');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders fullscreen when specified', () => {
    render(<LoadingSpinner fullScreen />);
    const container = screen.getByRole('generic').parentElement;
    expect(container).toHaveClass('fixed', 'inset-0');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('generic').firstChild).toHaveClass('w-4', 'h-4');

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByRole('generic').firstChild).toHaveClass('w-12', 'h-12');
  });
});

describe('SkeletonCard', () => {
  it('renders skeleton card structure', () => {
    render(<SkeletonCard />);
    const card = screen.getByRole('generic');
    expect(card).toHaveClass('animate-pulse');
  });
});

describe('SkeletonText', () => {
  it('renders default number of lines', () => {
    render(<SkeletonText />);
    const lines = screen.getAllByRole('generic');
    expect(lines).toHaveLength(3);
  });

  it('renders custom number of lines', () => {
    render(<SkeletonText lines={5} />);
    const lines = screen.getAllByRole('generic');
    expect(lines).toHaveLength(5);
  });
});