import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { NativeTree } from '../NativeTree';
import { mockItems } from '../../mocks/mock';

describe('NativeTree', () => {
  it('показывает полный список', () => {
    render(<NativeTree items={mockItems} />);

    expect(screen.getByText('label-0')).toBeInTheDocument();
    expect(screen.getByText('label-499')).toBeInTheDocument();
  });

  it('раскрывает и закрывает вложенные элементы по клику', () => {
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
      throw new Error('Элемент не найден');
    }

    expect(nested).not.toBeVisible();

    fireEvent.click(expandable);

    expect(nested).toBeVisible();
  });

  it('вызывает внешние обработчики изменения состояния элементов', () => {
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
      throw new Error('Элемент не найден');
    }

    fireEvent.click(expandable);

    expect(mockedOnToggle).nthCalledWith(1, '0');
  });

  it('принимает переданные CSS-классы', () => {
    const className = 'some-class';
    const { container } = render(
      <NativeTree items={mockItems} className={className} />
    );
    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    expect(container.getElementsByClassName(className).length).toBe(1);
  });

  it('может принимать пустой список', () => {
    const { container } = render(<NativeTree items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('предоставляет возможность использовать заданные пользователем рендер-функции', () => {
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
