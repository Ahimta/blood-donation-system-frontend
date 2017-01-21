import * as React from 'react';
import { MenuItem, Nav, Navbar, NavDropdown, PageHeader } from 'react-bootstrap';

interface IProps { };
interface IState { };

export default class Header extends React.Component<IProps, IState> {
  render() {
    return (<header>
      <Navbar collapseOnSelect fixedTop inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='#'>Blood Donation System</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavDropdown title='Associated Websites' id='other-websites'>
              <MenuItem href='http://ctw.getforge.io/' rel='noopener' target='_blank'>
                Clinton, Trump, what's up
            </MenuItem>
              <MenuItem href='https://blood-donation-system0.herokuapp.com/' rel='noopener' target='_blank' active>
                Blood Donation System
            </MenuItem>
              <MenuItem divider />
              <MenuItem className='text-right' href='https://ahimta.github.io/fuel-consumption-calculator/'
                rel='noopener' target='_blank'>
                أسعار البنزين و المياه و الكهرباء
            </MenuItem>
              <MenuItem className='text-right' href='http://ahimta.github.io/saudi-radios' rel='noopener'
                target='_blank'>
                الإذاعات السعودية
            </MenuItem>
              <MenuItem className='text-right' href='https://donation-web-pla-1479993243743.firebaseapp.com/'
                rel='noopener' target='_blank'>
                منصة التبرعات
            </MenuItem>
              <MenuItem className='text-right' href='https://ahimta.github.io/bagi/' rel='noopener' target='_blank'>
                باقي
            </MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <PageHeader className='text-center' style={{ marginTop: '5em' }}>
        Blood Donation System <small>For donors and patients</small>
      </PageHeader>
    </header>);
  }
}
