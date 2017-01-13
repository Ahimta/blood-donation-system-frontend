import * as React from 'react';

import Body from './Body';
import Footer from './Footer';
import Header from './Header';

import * as db from '../db';
import * as mapping from '../mapping';

interface IProps { };
interface IState { };

export default class App extends React.Component<IProps, IState> {
  render() {
    return (<div>
      <Header />
      <Body deleteDonation={db.deleteDonation} donate={db.donate} getDonation={db.getDonation}
        loadMap={mapping.loadMap} updateDonation={db.updateDonation} />
      <Footer />
    </div>);
  }
}
