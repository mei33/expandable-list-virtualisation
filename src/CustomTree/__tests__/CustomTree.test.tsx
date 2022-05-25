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
    })
    
    Object.defineProperty(global, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: IntersectionObserverMock,
    })
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('показывает полный список в полном режиме', () => {
    render(<CustomTree items={mockItems} mode="full" />);

    expect(screen.getByText('label-0')).toBeInTheDocument();
    expect(screen.getByText('label-499')).toBeInTheDocument();
  });

  it('отображает все элементы в автоматическом режиме, если их количество не превышает 3 размеров блока', () => {
    render(<CustomTree items={mockItems.slice(0, 117)} />);

    expect(screen.getByText('label-0')).toBeInTheDocument();
    expect(screen.getByText('label-100')).toBeInTheDocument();
    expect(screen.getByText('label-116')).toBeInTheDocument();
  });

  it('не активирует режим подгрузки, если их количество элементов не превышает 3 высоты блока', () => {
    render(<CustomTree items={mockItems.slice(0, 117)} />);

    expect(observeMock).not.toHaveBeenCalled();
  });

  it('отображает часть элементов в автоматическом режиме, если их количество превышает 3 высоты блока', () => {
    render(<CustomTree items={mockItems} />);

    expect(screen.getByText('label-0')).toBeInTheDocument();
    expect(screen.getByText('label-100')).toBeInTheDocument();
    expect(screen.getByText('label-116')).toBeInTheDocument();
    expect(screen.queryByText('label-117')).not.toBeInTheDocument();
  });

  it('активирует режим подгрузки, если количество элементов превышает 3 высоты блока', () => {
    render(<CustomTree items={mockItems} />);

    expect(observeMock).toHaveBeenCalledTimes(1);
  });

  it('раскрывает и закрывает вложенные элементы по клику, запоминая статус вложенности', () => {
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
      throw new Error('Элемент не найден');
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

  it('вызывает внешние обработчики изменения состояния элементов', () => {
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
      throw new Error('Элемент не найден');
    }

    fireEvent.click(expandable);

    expect(mockedOnToggle).nthCalledWith(1, { id: '0', isExpanded: false });
  });

  it('принимает переданные CSS-классы для короткого списка', () => {
    const className = 'some-class';
    // todo: возможно протестить это же для каждого из компонентов
    const { container } = render(
      <CustomTree items={mockItems.slice(0, 114)} className={className} />
    );
    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    expect(container.getElementsByClassName(className).length).toBe(1);
  });

  it('принимает переданные CSS-классы для длинного списка', () => {
    const className = 'some-class';
    const { container } = render(
      <CustomTree items={mockItems} className={className} />
    );
    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    expect(container.getElementsByClassName(className).length).toBe(1);
  });

  it('может принимать пустой список', () => {
    const { container } = render(<CustomTree items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('предоставляет возможность использовать заданные пользователем рендер-функции', () => {
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
