import * as React from 'react';
import { Button, Table } from 'react-bootstrap';

import IDonation from '../types/IDonation';

const ProtectedElement = ({children, isHidden, makeVisible}: { children?: any, isHidden: boolean, makeVisible: Function }) => {
  if (isHidden) {
    return (<Button bsSize='xs' bsStyle='primary' onClick={makeVisible as any}>Click to Show</Button>);
  } else {
    return <span>{children}</span>;
  }
};

type IProps = IDonation;

interface IState {
  readonly isEmailHidden: boolean;
  readonly isPhoneHidden: boolean;
};

export default class Body extends React.Component<IProps, IState> {
  private makeVisibleFactory: Function;

  constructor(props: IProps, context: any) {
    super(props, context);
    this.state = {
      isEmailHidden: true,
      isPhoneHidden: true
    };

    this.makeVisibleFactory = (fieldName: ('isEmailHidden' | 'isPhoneHidden')) => (event) => {
      this.setState({ [fieldName]: false } as IState);
    };
  }

  render() {
    const {bloodGroup, email, firstName, lastName, phone} = this.props;
    const {isEmailHidden, isPhoneHidden} = this.state;

    return (<article>
      <Table responsive>
        <tbody>
          <tr>
            <th>Full Name</th>
            <td>{firstName} {lastName}</td>
          </tr>
          <tr>
            <th>Contact Number</th>
            <td>
              <ProtectedElement isHidden={isPhoneHidden} makeVisible={this.makeVisibleFactory('isPhoneHidden')}>
                <a href={`tel:${phone}`} rel='noopener' target='_blank'>{phone}</a>
              </ProtectedElement>
            </td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td>
              <ProtectedElement isHidden={isEmailHidden} makeVisible={this.makeVisibleFactory('isEmailHidden')}>
                <a href={`mailto:${email}`} rel='noopener' target='_blank'>{email}</a>
              </ProtectedElement>
            </td>
          </tr>
          <tr>
            <th>Blood Group</th>
            <td>{bloodGroup}</td>
          </tr>
        </tbody>
      </Table>
    </article>);
  }
}
