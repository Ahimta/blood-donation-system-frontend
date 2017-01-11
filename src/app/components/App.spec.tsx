/* tslint:disable:no-unused-variable */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import App from './App';

describe('App', () => {
  it('should be a div', () => {
    const app = TestUtils.renderIntoDocument(<App />);
    const appNode = ReactDOM.findDOMNode(app as React.ReactInstance);
    expect(appNode.tagName).toEqual('DIV');
  });
});
