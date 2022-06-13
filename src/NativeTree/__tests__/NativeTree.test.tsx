import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { NativeTree } from '../NativeTree';
import { mockItems } from '../../mocks/mock';

describe('NativeTree', () => {
  it('shows full list', () => {
    render(<NativeTree items={mockItems} />);

    expect(screen.getByText('label-0')).toBeInTheDocument();
    expect(screen.getByText('label-499')).toBeInTheDocument();
  });

  it('toggles nested elements by click', () => {
    render(
      <NativeTree
        items={[
          {
            ...mockItems[0],
            children: [{ id: 'nested', label: 'nested', children: [] }],
          },
        ]}
      />
    );

    const expandable = screen.getByText('label-0');
    const nested = screen.getByText('nested');

    if (!expandable) {
      throw new Error('Element is not found');
    }

    expect(nested).not.toBeVisible();

    fireEvent.click(expandable);

    expect(nested).toBeVisible();
  });

  it('calls outer handlers on changing items state', () => {
    const mockedOnToggle = jest.fn();

    render(
      <NativeTree
        items={[
          {
            ...mockItems[0],
            children: [{ id: 'nested', label: 'nested', children: [] }],
          },
        ]}
        onToggle={mockedOnToggle}
      />
    );

    const expandable = screen.getByText('label-0');

    if (!expandable) {
      throw new Error('Element is not found');
    }

    fireEvent.click(expandable);

    expect(mockedOnToggle).nthCalledWith(1, '0');
  });

  it('uses given CSS-classes', () => {
    const className = 'some-class';
    const { container } = render(
      <NativeTree items={mockItems} className={className} />
    );
    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    expect(container.getElementsByClassName(className).length).toBe(1);
  });

  it('can handle empty list', () => {
    const { container } = render(<NativeTree items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('allows to use given render-functions', () => {
    render(
      <NativeTree
        renderBranch={({ id, label }) => `+++${id}+++ ---${label}---`}
        renderListItem={({ id, label }) => `???${id}??? !!!${label}!!!`}
        items={[
          {
            ...mockItems[0],
            children: [
              { id: 'nested-id', label: 'nested-label', children: [] },
            ],
          },
        ]}
      />
    );

    expect(screen.getByText('+++0+++ ---label-0---')).toBeInTheDocument();
    expect(
      screen.getByText('???nested-id??? !!!nested-label!!!')
    ).toBeInTheDocument();
  });
});
