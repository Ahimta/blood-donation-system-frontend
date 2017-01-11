/* tslint:disable:no-unused-variable */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import Body from './Body';

describe('Body', () => {
  it('should be a main', () => {
    const body = TestUtils.renderIntoDocument(<Body />);
    const bodyNode = ReactDOM.findDOMNode(body as React.ReactInstance);
    expect(bodyNode.tagName).toEqual('MAIN');
  });
});
