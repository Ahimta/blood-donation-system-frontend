import classNames from 'classnames';
import * as React from 'react';
import { Button, ButtonGroup, ControlLabel, FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import IDonation from '../types/IDonation';

interface IProps {
  readonly deleteDonation: (accessToken: string, id: string) => Promise<any>;
  readonly donate: (donation: IDonation) => Promise<{ code: number, data: any }>;
  readonly donation?: IDonation;
  readonly updateDonation: (donation: IDonation) => Promise<{ code, data }>;

  readonly latitude: number;
  readonly longitude: number;

  readonly isAuthorized?: boolean;
};

interface IState {
  readonly errors: any;
  readonly donation: IDonation;
};

export default class Body extends React.Component<IProps, IState> {
  static defaultProps = {
    donation: {
      accessToken: '',
      bloodGroup: 'O+',
      email: '',
      firstName: '',
      lastName: '',
      phone: ''
    },
    isAuthorized: false
  };

  private onChangeFactory: Function;

  constructor(props: IProps, context: any) {
    super(props, context);
    this.state = { errors: {}, donation: props.donation };

    this.onChangeFactory = (fieldName) => (event) => {
      const inputValue = event.target.value;

      const currentState = this.state;
      const currentDonation = currentState.donation;
      const newState = { ...currentState, donation: { ...currentDonation, [fieldName]: inputValue } };

      this.setState(newState);
    };
  }

  render() {
    const {errors, donation} = this.state;
    const {_id, accessToken, bloodGroup, email, firstName, lastName, phone} = donation;

    return (<form onSubmit={this.onSubmit.bind(this)}>
      <FormGroup controlId='firstName' validationState={errors.firstName ? 'error' : null}>
        <ControlLabel className='sr-only'>First Name</ControlLabel>
        <InputGroup>
          <InputGroup.Addon>First Name</InputGroup.Addon>
          <FormControl onChange={this.onChangeFactory('firstName')} placeholder='John' type='text' value={firstName}
            required />
        </InputGroup>
      </FormGroup>

      <FormGroup controlId='lastName' validationState={errors.lastName ? 'error' : null}>
        <ControlLabel className='sr-only'>Last Name</ControlLabel>
        <InputGroup>
          <InputGroup.Addon>Last Name</InputGroup.Addon>
          <FormControl onChange={this.onChangeFactory('lastName')} placeholder='Smith' type='text' value={lastName}
            required />
        </InputGroup>
      </FormGroup>

      <FormGroup controlId='contactNumber' validationState={errors.phone ? 'error' : null}>
        <ControlLabel className='sr-only'>Contact Number</ControlLabel>
        <InputGroup>
          <InputGroup.Addon>Contact Number</InputGroup.Addon>
          <FormControl onChange={this.onChangeFactory('phone')} placeholder='+xx xxx xxxx xxx' type='tel' value={phone}
            required />
        </InputGroup>
        <HelpBlock className={classNames({hidden: !errors.phone})}>Correct format: +xx xxx xxxx xxx</HelpBlock>
      </FormGroup>

      <FormGroup controlId='Email Address' validationState={errors.email ? 'error' : null}>
        <ControlLabel className='sr-only'>Email Address</ControlLabel>
        <InputGroup>
          <InputGroup.Addon>Email Address</InputGroup.Addon>
          <FormControl onChange={this.onChangeFactory('email')} placeholder='j.smith@gmail.com' type='email'
            value={email} required />
        </InputGroup>
      </FormGroup>

      <FormGroup controlId='bloodGroup' validationState={errors.bloodGroup ? 'error' : null}>
        <ControlLabel>Blood Group</ControlLabel>
        <FormControl onChange={this.onChangeFactory('bloodGroup')} componentClass='select' placeholder='A+'
          value={bloodGroup}>
          <option value='A-'>A-</option>
          <option value='A+'>A+</option>
          <option value='AB-'>AB-</option>
          <option value='AB+'>AB+</option>
          <option value='B-'>B-</option>
          <option value='B+'>B+</option>
          <option value='O-'>O-</option>
          <option value='O+'>O+</option>
        </FormControl>
      </FormGroup>

      {this.getSubmitButtons(accessToken, _id)}
    </form>);
  }

  private getSubmitButtons(accessToken: string, id: string) {
    const {deleteDonation, isAuthorized} = this.props;

    if (accessToken) {
      return (<div className='text-center'>
        <ButtonGroup>
          <Button bsStyle='primary' bsSize='lg' disabled={!isAuthorized} onClick={this.updateDonation.bind(this)}>Edit</Button>
          <Button bsStyle='danger' bsSize='lg' disabled={!isAuthorized} onClick={() => deleteDonation(accessToken, id)}>Delete</Button>
        </ButtonGroup>
      </div>);
    } else {
      return (<Button bsSize='lg' bsStyle='success' type='submit' block>Donate Blood</Button>);
    }
  }

  private onSubmit(event: Event) {
    const {donate, latitude, longitude} = this.props;
    const {donation} = this.state;

    event.preventDefault();
    console.log('Submitting...', this.state);

    if (donation.accessToken) {
      console.log('updating donation');
    } else {
      donate({ ...donation, latitude, longitude }).then(({data}) => {
        console.log('donate-succeeded', data);
        this.setState({errors: {}} as IState);
      }).catch(({code, data}) => {
        if (code === 400) {
          this.setState({ errors: data } as IState);
        }
        console.log('donate-failed', { code, data });
      });
    }
  }

  private updateDonation() {
    const {updateDonation} = this.props;
    const {donation} = this.state;

    return updateDonation(donation).catch(({code, data}) => {
      if (code === 400) {
        this.setState({ errors: data } as IState);
      }

      return { code, data };
    });
  }
}
