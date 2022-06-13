import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { CustomTree } from '../CustomTree';
import { mockItems } from '../../mocks/mock';

describe('CustomTree', () => {
  const observeMock = jest.fn();

  class IntersectionObserverMock {
    observe = observeMock;
    disconnect = jest.fn();
    unobserve = jest.fn();
  }

  beforeAll(() => {
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: IntersectionObserverMock,
    });

    Object.defineProperty(global, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: IntersectionObserverMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows full list in full mode', () => {
    render(<CustomTree items={mockItems} mode="full" />);

    expect(screen.getByText('label-0')).toBeInTheDocument();
    expect(screen.getByText('label-499')).toBeInTheDocument();
  });

  it('shows all elements in auto mode if their quantity is no more than 4 block heights', () => {
    render(<CustomTree items={mockItems.slice(0, 156)} />);

    expect(screen.getByText('label-0')).toBeInTheDocument();
    expect(screen.getByText('label-100')).toBeInTheDocument();
    expect(screen.getByText('label-155')).toBeInTheDocument();
  });

  it('does not activate preloading mode if items quantity is no more than 4 block heights', () => {
    render(<CustomTree items={mockItems.slice(0, 156)} />);

    expect(observeMock).not.toHaveBeenCalled();
  });

  it('shows part of items in auto mode if their amount is more than 4 block heights', () => {
    render(<CustomTree items={mockItems} />);

    expect(screen.getByText('label-0')).toBeInTheDocument();
    expect(screen.getByText('label-100')).toBeInTheDocument();
    expect(screen.getByText('label-155')).toBeInTheDocument();
    expect(screen.queryByText('label-156')).not.toBeInTheDocument();
  });

  it('activates preloading mode if number of elements is more than 4 block heights', () => {
    render(<CustomTree items={mockItems} />);

    expect(observeMock).toHaveBeenCalledTimes(1);
  });

  it('toggles nested elements by click, remembering status of nested items', () => {
    render(
      <CustomTree
        items={[
          {
            ...mockItems[0],
            children: [
              {
                id: 'nested',
                label: 'nested',
                children: [
                  { id: 'super-nested', label: 'super-nested', children: [] },
                ],
              },
            ],
          },
        ]}
      />
    );

    const expandable = screen.getByText('label-0');

    if (!expandable) {
      throw new Error('Element is not found');
    }

    expect(screen.getByText('nested')).toBeInTheDocument();
    expect(screen.getByText('super-nested')).toBeInTheDocument();

    fireEvent.click(expandable);

    expect(screen.queryByText('nested')).not.toBeInTheDocument();

    fireEvent.click(expandable);

    expect(screen.getByText('nested')).toBeInTheDocument();
    expect(screen.getByText('super-nested')).toBeInTheDocument();

    fireEvent.click(screen.getByText('nested'));

    fireEvent.click(expandable);

    expect(screen.queryByText('nested')).not.toBeInTheDocument();
    expect(screen.queryByText('super-nested')).not.toBeInTheDocument();

    fireEvent.click(expandable);

    expect(screen.getByText('nested')).toBeInTheDocument();
    expect(screen.queryByText('super-nested')).not.toBeInTheDocument();
  });

  it('calls outer handlers on changing items state', () => {
    const mockedOnToggle = jest.fn();

    render(
      <CustomTree
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

    expect(mockedOnToggle).nthCalledWith(1, { id: '0', isExpanded: false });
  });

  it('uses given CSS-classes for short list', () => {
    const className = 'some-class';
    const { container } = render(
      <CustomTree items={mockItems.slice(0, 114)} className={className} />
    );
    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    expect(container.getElementsByClassName(className).length).toBe(1);
  });

  it('uses given CSS-classes for long list', () => {
    const className = 'some-class';
    const { container } = render(
      <CustomTree items={mockItems} className={className} />
    );
    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    expect(container.getElementsByClassName(className).length).toBe(1);
  });

  it('can handle empty list', () => {
    const { container } = render(<CustomTree items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('allows to use given render-functions', () => {
    render(
      <CustomTree
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
