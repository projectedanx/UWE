
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loader, { FullScreenLoader } from './Loader';

describe('Loader Components', () => {
  describe('Loader', () => {
    it('should render the loader SVG', () => {
      render(<Loader />);
      const svgElement = document.querySelector('svg');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveClass('animate-spin');
    });
  });

  describe('FullScreenLoader', () => {
    it('should render with default text', () => {
      render(<FullScreenLoader />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      render(<FullScreenLoader text="Please wait" />);
      expect(screen.getByText('Please wait')).toBeInTheDocument();
    });

    it('should contain the spinning SVG', () => {
        render(<FullScreenLoader />);
        const svgElement = document.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
        expect(svgElement).toHaveClass('animate-spin');
      });
  });
});
