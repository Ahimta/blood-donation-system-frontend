import * as React from 'react';
import { PageHeader } from 'react-bootstrap';

interface IProps { };
interface IState { };

export default class Header extends React.Component<IProps, IState> {
  render() {
    return (<header>
      <PageHeader className='text-center'>
        Blood Donation System <small>For donors and patients</small>
      </PageHeader>
    </header>);
  }
}
