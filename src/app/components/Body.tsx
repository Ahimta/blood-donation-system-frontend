import classNames from 'classnames';
import * as React from 'react';
import { Alert, Button, Grid, Panel, ProgressBar } from 'react-bootstrap';
import * as ReactDOM from 'react-dom';

import DonationForm from './DonationForm';
import DonationInfoTable from './DonationInfoTable';
import IDonation from '../types/IDonation';

// copied from mapping module
type LoadMap = (elementId: string,
  getDonationUpdateForm: ((accessToken: string, id: string) => Promise<any>),
  getDonationInfoTable: ((donation: any) => any),
  getNewDonationForm: ((point: { latitude: number, longitude: number }) => any)) => Promise<(() => void)>;

interface IProps {
  readonly deleteDonation: (accessToken: string, id: string) => Promise<any>;
  readonly donate: (donation: IDonation) => Promise<{ code, data }>;
  readonly getDonation: (accessToken: string, id: string) => Promise<{ code, data }>;
  readonly loadMap: LoadMap;
  readonly updateDonation: (donation: IDonation) => Promise<{ code, data }>;
};

interface IState {
  readonly alertAccessToken: string;
  readonly alertId: string;
  readonly alertType: string;
};

export default class Body extends React.Component<IProps, IState> {
  private manageMapPromise: Promise<(action: string) => void>;

  constructor(props: IProps, context: any) {
    super(props, context);
    this.state = { alertAccessToken: '', alertId: '', alertType: '' };
  }

  componentDidMount() {
    const {loadMap} = this.props;

    this.manageMapPromise = loadMap('esriMap', this.getDonationUpdateForm.bind(this), this.getDonationInfoTable.bind(this),
      this.getNewDonationForm.bind(this));
  }

  render() {
    const {alertAccessToken, alertId, alertType} = this.state;

    return (<main>
      <Grid>
        <Alert bsStyle='warning'>
          <p><b>To donate blood</b>, click/tap your location on the map.</p>
          <p><b>To find a donor's info</b>, click/tap an anchor on the map.</p>
        </Alert>
        <Button bsSize='lg' bsStyle='success'
          onClick={() => this.manageMap('center-around-user-location', this.manageMapPromise)} block>
          Center map around my location
        </Button>
      </Grid>

      <hr />

      <Grid>
        <Alert bsStyle='success' className={classNames({ hidden: (alertType !== 'donation-added') })}
          onDismiss={() => this.setState({ alertAccessToken: '', alertId: '', alertType: '' } as IState)}>
          <p><b>Thanks!</b> You can edit or delete your donation from this&nbsp;
            <a href={`#/donations/${alertId}?accessToken=${alertAccessToken}`} rel='noopener'
              target='_blank'>
              secure page
            </a>.
          </p>
        </Alert>

        <Alert bsStyle='success' className={classNames({ hidden: (alertType !== 'donation-deleted') })}
          onDismiss={() => this.setState({ alertAccessToken: '', alertId: '', alertType: '' } as IState)}>
          <p>Your donation was removed successfully.</p>
        </Alert>

        <Alert bsStyle='success' className={classNames({ hidden: (alertType !== 'donation-updated') })}
          onDismiss={() => this.setState({ alertAccessToken: '', alertId: '', alertType: '' } as IState)}>
          <p>Your donation was updated successfully.</p>
        </Alert>

        <Panel bsStyle='primary' className='text-center' header='Map'>
          <section id='esriMap' style={{ height: '50em' }}>
            <ProgressBar now={100} striped />
          </section>
        </Panel>
      </Grid>
    </main>);
  }

  private manageMap(action: string, managePromise: Promise<(action: string) => void>) {
    managePromise.then((manage) => {
      manage(action);
    });
  }

  private deleteDonation(accessToken: string, id: string) {
    const {deleteDonation} = this.props;

    return deleteDonation(accessToken, id).then(() => {
      this.setState({ alertAccessToken: accessToken, alertId: id, alertType: 'donation-deleted' } as IState);
      this.manageMap('close-popup', this.manageMapPromise);
    });
  }

  private donate(donation: IDonation) {
    return this.props.donate(donation).then(({code, data}) => {
      const {_id, accessToken} = data;

      this.setState({ alertAccessToken: accessToken, alertId: _id, alertType: 'donation-added' } as IState);

      if (code === 200) {
        this.manageMap('close-popup', this.manageMapPromise);
      }
      return { code, data };
    });
  }

  private getDonationInfoTable(donation: any) {
    const div = document.createElement('div');
    ReactDOM.render(<DonationInfoTable {...donation} />, div);
    return div;
  }

  private getDonationUpdateForm(accessToken: string, id: string) {
    const div = document.createElement('div');
    const {getDonation} = this.props;

    return getDonation(accessToken, id).then(({data: donation}) => {
      const {latitude, longitude} = donation;
      const isAuthorized = !!donation;

      ReactDOM.render(<DonationForm deleteDonation={this.deleteDonation.bind(this)} donate={this.donate.bind(this)}
        donation={{ ...donation, accessToken }} isAuthorized={isAuthorized} latitude={latitude} longitude={longitude}
        updateDonation={this.updateDonation.bind(this)} />, div);

      return Promise.resolve({ latitude, longitude, popupContent: div });
    });
  }

  private getNewDonationForm(point: any) {
    const div = document.createElement('div');

    ReactDOM.render(<DonationForm deleteDonation={this.deleteDonation.bind(this)} donate={this.donate.bind(this)}
      {...point} updateDonation={this.updateDonation.bind(this)} />, div);
    return div;
  }

  private updateDonation(donation: IDonation) {
    const {updateDonation} = this.props;

    return updateDonation(donation).then(({code, data}) => {
      if (code === 200) {
        this.manageMap('close-popup', this.manageMapPromise);
        this.setState({ alertId: data._id, alertType: 'donation-updated' } as IState);
      }

      return { code, data };
    });
  }
}
