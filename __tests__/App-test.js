import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import App from '../modules/App';

describe('Boilerplate', () => {

  it('contains hello text', () => {
    // This places our component into our test to find off of
    var appRendered = TestUtils.renderIntoDocument(<App/>);
    // find h1 on page
    var heading = TestUtils.findRenderedDOMComponentWithClass(appRendered, "heading");
    // assert it has text
    expect(heading.textContent).toEqual("Hello!");
  });
});
