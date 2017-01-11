import * as React from 'react';

import Body from './Body';
import Footer from './Footer';
import Header from './Header';

interface IProps { };
interface IState { };

export default class App extends React.Component<IProps, IState> {
  render() {
    return (<div>
      <Header />
      <Body />
      <Footer />
    </div>);
  }
}
