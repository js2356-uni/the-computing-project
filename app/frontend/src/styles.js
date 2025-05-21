/**
 * Centralized styling system for the energy dashboard application
 * Contains theme-based styling patterns used across components
 */

// Colors for the dashboard app
export const colors = {
  light: {
    background: '#f7f9fc',
    cardBackground: '#ffffff',
    text: '#1a202c',
    secondaryText: '#4a5568',
    border: '#e2e8f0',
    accentPrimary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  dark: {
    background: '#0f172a',
    cardBackground: '#1e293b',
    text: '#f1f5f9',
    secondaryText: '#cbd5e1',
    border: '#334155',
    accentPrimary: '#60a5fa',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
  }
};

// Font sizes
export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  xxl: '1.5rem',
};

// Spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem',
};

// Border radius
export const borderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  circle: '50%',
};

// Shadows
export const shadows = {
  light: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
    md: '0 4px 6px rgba(0, 0, 0, 0.2), 0 10px 15px rgba(0, 0, 0, 0.3)',
  }
};

// Transitions
export const transitions = {
  default: 'all 0.3s ease',
  slow: 'all 0.5s ease',
  fast: 'all 0.15s ease',
};

// Gradients
export const gradients = {
  light: {
    primary: 'linear-gradient(135deg, #4f46e5 0%, #7dd3fc 100%)',
  },
  dark: {
    primary: 'linear-gradient(135deg, #312e81 0%, #0369a1 100%)',
  }
};

// Container styles
export const containerStyles = {
  panel: `
    padding: 1.5rem;
    margin-bottom: 2rem;
    overflow: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  `,
  card: `
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  `,
};

// Helper function for theme styles
export const getThemeStyles = (theme) => {
  return {
    text: theme === 'light' ? '#1a202c' : '#f1f5f9',
    background: theme === 'light' ? '#f7f9fc' : '#0f172a',
    cardBackground: theme === 'light' ? '#ffffff' : '#1e293b',
    border: theme === 'light' ? '#e2e8f0' : '#334155',
    accent: theme === 'light' ? '#3b82f6' : '#60a5fa',
    shadow: theme === 'light' ? '0 4px 6px rgba(0, 0, 0, 0.05)' : '0 4px 6px rgba(0, 0, 0, 0.2)',
  };
};

// Common animation durations
export const animation = {
  fast: '0.15s',
  medium: '0.25s',
  slow: '0.4s',
};

// Responsive breakpoints
export const breakpoints = {
  small: '640px',
  medium: '768px',
  large: '1024px',
  xlarge: '1280px',
  xxlarge: '1536px',
};

// Typography scale
export const typography = {
  fontSizeSmall: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
  fontSizeBase: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
  fontSizeMedium: 'clamp(1rem, 0.925rem + 0.375vw, 1.125rem)',
  fontSizeLarge: 'clamp(1.125rem, 1rem + 0.625vw, 1.5rem)',
  fontSizeXL: 'clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem)',
  fontSizeXXL: 'clamp(2rem, 1.75rem + 1.25vw, 3rem)',
  fontWeightNormal: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  fontWeightBold: '700',
  lineHeightTight: '1.2',
  lineHeightNormal: '1.5',
  lineHeightLoose: '1.75',
  letterSpacingTight: '-0.025em',
  letterSpacingNormal: '0',
  letterSpacingWide: '0.025em',
  letterSpacingHeader: '-0.05em',
};

// Common button styles
export const buttonStyles = {
  base: `
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 1rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    font-size: 1rem;
  `,
  primary: (theme) => `
    background: ${theme === 'light' ? '#3b82f6' : '#60a5fa'};
    color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    &:hover {
      transform: translateY(-2px);
    }
  `,
  secondary: (theme) => `
    background: transparent;
    border: 1px solid ${theme === 'light' ? '#e2e8f0' : '#334155'};
    color: ${theme === 'light' ? '#1a202c' : '#f1f5f9'};
    &:hover {
      background: ${theme === 'light' ? '#f7f9fc' : '#1e293b'};
    }
  `,
};

// Common input styles
export const inputStyles = {
  base: `
    border-radius: 0.5rem;
    padding: 1rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    width: 100%;
    box-sizing: border-box;
  `,
  light: `
    background: #ffffff;
    border: 1px solid #e2e8f0;
    color: #1a202c;
    &:focus {
      border-color: #3b82f6;
      outline: none;
    }
  `,
  dark: `
    background: #1e293b;
    border: 1px solid #334155;
    color: #f1f5f9;
    &:focus {
      border-color: #60a5fa;
      outline: none;
    }
  `,
}; 