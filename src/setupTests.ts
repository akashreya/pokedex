import '@testing-library/jest-dom';
import React from 'react';

// Mock fetch globally
(global as any).fetch = jest.fn();

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    li: ({ children, ...props }: any) => React.createElement('li', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }: any) => React.createElement('a', { href: to, ...props }, children),
  useParams: () => ({}),
  useNavigate: () => jest.fn(),
})); 