import React from 'react';
import { act } from 'react-dom/test-utils';
import { renderElementAsync } from '../../utils/transpile';
import { mount } from 'enzyme';
import LiveProvider from './LiveProvider';
import { useContext } from 'react';
import LiveContext from './LiveContext';

jest.mock('../../utils/transpile');

function waitAsync() {
  return act(() => new Promise(resolve => setTimeout(resolve, 0)));
}

it('applies a synchronous transformCode function', () => {
  function transformCode(code) {
    return `render(<div>${code}</div>)`;
  }

  mount(<LiveProvider code="hello" noInline transformCode={transformCode} />);

  return waitAsync().then(() => {
    expect(renderElementAsync).toHaveBeenCalledTimes(1);
    expect(renderElementAsync.mock.calls[0][0].code).toBe(
      'render(<div>hello</div>)'
    );
  });
});

it('applies an asynchronous transformCode function', () => {
  function transformCode(code) {
    return Promise.resolve(`render(<div>${code}</div>)`);
  }

  mount(<LiveProvider code="hello" noInline transformCode={transformCode} />);

  return waitAsync().then(() => {
    expect(renderElementAsync).toHaveBeenCalledTimes(1);
    expect(renderElementAsync.mock.calls[0][0].code).toBe(
      'render(<div>hello</div>)'
    );
  });
});

function ErrorRenderer() {
  const { error } = useContext(LiveContext);
  return <div data-testid="handledError">{error?.message}</div>;
}

it('catches errors from a synchronous transformCode function', () => {
  function transformCode() {
    throw new Error('testError');
  }

  const wrapper = mount(
    <LiveProvider code="hello" noInline transformCode={transformCode}>
      <ErrorRenderer />
    </LiveProvider>
  );

  return waitAsync().then(() => {
    expect(renderElementAsync).not.toHaveBeenCalled();

    const handledErrorWrapper = wrapper.find('[data-testid="handledError"]');
    expect(handledErrorWrapper.text()).toBe('testError');
  });
});

it('catches errors from an asynchronous transformCode function', () => {
  function transformCode() {
    return Promise.reject(new Error('testError'));
  }

  const wrapper = mount(
    <LiveProvider code="hello" noInline transformCode={transformCode}>
      <ErrorRenderer />
    </LiveProvider>
  );

  return waitAsync().then(() => {
    expect(renderElementAsync).not.toHaveBeenCalled();

    const handledErrorWrapper = wrapper.find('[data-testid="handledError"]');
    expect(handledErrorWrapper.text()).toBe('testError');
  });
});
