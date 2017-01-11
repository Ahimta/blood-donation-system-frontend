/* tslint:disable:no-unused-variable */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import Header from './Header';

describe('Header', () => {
  it('should be a header', () => {
    const header = TestUtils.renderIntoDocument(<Header />);
    const headerNode = ReactDOM.findDOMNode(header as React.ReactInstance);
    expect(headerNode.tagName).toEqual('HEADER');
  });
});
