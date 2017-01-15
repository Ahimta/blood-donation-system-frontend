import _ from 'lodash';

import * as db from './db';

const isClose = (p1, p2, zoom) => {
  if (!p1 || !p2) {
    return false;
  } else {
    const dx = (p1.latitude - p2.latitude);
    const dy = (p1.longitude - p2.longitude);

    return (Math.sqrt(dx * dx + dy * dy) * zoom < 0.5);
  }
};

const getMarker = (attributesAndPoint): Promise<any> => {
  return window.esriPromise.then(({Graphic, Point, SimpleMarkerSymbol}) => {

    const {latitude, longitude} = attributesAndPoint;
    const geometry = new Point({ latitude, longitude });
    const symbol = new SimpleMarkerSymbol({
      color: [226, 119, 40],
      outline: {
        color: [255, 255, 255],
        width: 2
      }
    });

    return new Graphic({ attributes: attributesAndPoint, geometry, symbol });
  });
};

const getParams = (url: string): ({ accessToken, id } | null) => {
  const matches = url.match(/donations\/(\w+)\?accessToken=(.+)$/);

  if (matches) {
    const [, id, accessToken] = matches;
    return (accessToken && id) ? { accessToken, id } : null;
  } else {
    return null;
  }
};

export function loadMap(elementId: string,
  getDonationUpdateForm: ((accessToken: string, id: string) => Promise<any>),
  getDonationInfoTable: ((donation: any) => any),
  getNewDonationForm: ((point: { latitude: number, longitude: number }) => any)): Promise<(() => void)> {

  return window.esriPromise.then(({Map, MapView, webMercatorUtils}) => {
    const map = new Map({
      basemap: 'streets-navigation-vector'
    });

    const view = new MapView({
      constraints: { minZoom: 2 },
      container: elementId,
      map: map,
      zoom: 3
    });

    view.then(() => {
      const urlParams = getParams(window.location.hash);

      if (urlParams) {
        const {accessToken, id} = urlParams;

        getDonationUpdateForm(accessToken, id).then(({latitude, longitude, popupContent}) => {

          view.popup.open({
            title: 'Manage Donation',
            content: popupContent,
            location: { latitude, longitude }
          });
        });
      }
    });

    db.onDonationAdded((donation) => {
      getMarker(donation).then((marker) => {
        view.graphics.add(marker);
      });
    });

    db.onDonationsChanged((donations) => {
      view.graphics.removeAll();
      Promise.all(donations.map(getMarker)).then((markers) => {
        view.graphics.addMany(markers);
      });
    });

    db.onDonationDeleted((id) => {
      const {graphics} = view;
      const donationMarker = graphics.find(({attributes: {_id}}) => _id === id);

      if (donationMarker) {
        graphics.remove(donationMarker);
      }
    });

    db.onDonationUpdated((donation) => {
      const {graphics} = view;
      const donationMarker = graphics.find(({attributes: {_id}}) => _id === donation._id);

      if (donationMarker) {
        graphics.remove(donationMarker);
        getMarker(donation).then((marker) => {
          graphics.add(marker);
        });
      }
    });

    view.watch('extent', _.throttle((newExtent) => {
      const {xmin, ymin, xmax, ymax} = newExtent;
      const box: [[number, number], [number, number]] = [
        webMercatorUtils.xyToLngLat(Math.min(xmin, xmax), Math.min(ymin, ymax)),
        webMercatorUtils.xyToLngLat(Math.max(xmin, xmax), Math.max(ymin, ymax)),
      ];

      db.getDonations(box);
    }, 500));

    view.on('click', (event) => {
      db.getNearestDonation([event.mapPoint.longitude, event.mapPoint.latitude]).then(({data: donation}) => {
        const nearestMarker = view.graphics.find((g) => g.attributes._id === donation._id);
        const nearestDonation = nearestMarker ? nearestMarker.attributes : null;

        if (isClose(event.mapPoint, nearestDonation, view.zoom)) {
          view.popup.open({
            title: 'Donation Info',
            content: getDonationInfoTable(nearestDonation),
            location: { latitude: nearestDonation.latitude, longitude: nearestDonation.longitude }
          });
        } else {
          const {latitude, longitude} = event.mapPoint;

          view.popup.open({
            title: 'New Donation Info',
            content: getNewDonationForm({ latitude, longitude }),
            location: event.mapPoint
          });
        }
      });
    });

    return (action: string = 'close-popup') => {
      if (action === 'close-popup') {
        view.popup.close();
      } else if (action === 'center-around-user-location') {
        view.goTo(db.getCachedLocation());
      }
    };
  });
}
