import React from 'react';
import { render } from '@testing-library/react';
import Index from '../pages/App/App';

test('renders learn react link', () => {
  const { getByText } = render(<Index />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
