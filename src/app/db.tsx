
import io from 'socket.io-client';

import IDonation from './types/IDonation';

const socket = io('http://localhost:4000/');
let cachedLocation = {};

socket.on('connect', () => {
  console.log('connect');
});

export function deleteDonation(accessToken: string, id: string): Promise<{ accessToken: string, id: string }> {
  return new Promise((resolve, reject) => {
    socket.emit('delete-donation', { accessToken, id }, ({code, data}) => {
      console.log('delete-donation', { code, data });

      if (code === 200) {
        resolve({ code, data });
      } else {
        reject({ code, data });
      }
    });
  });
}

export function donate(donation: IDonation) {
  return new Promise((resolve, reject) => {
    socket.emit('donate', donation, ({code, data}) => {
      console.log('donate', { code, data });

      if (code === 200) {
        resolve({ code, data });
      } else {
        reject({ code, data });
      }
    });
  });
}

export function getCachedLocation() {
  return cachedLocation;
}

export function getDonation(accessToken: string, id: string): Promise<{code, data}> {
  return new Promise((resolve, reject) => {
    socket.emit('get-donation', {accessToken, id}, ({code, data}) => {
      console.log('get-donation', { code, data });

      if (code === 200) {
        resolve({ code, data });
      } else {
        reject({ code, data });
      }
    });
  });
}

export function getDonations(box: [[number, number], [number, number]]) {
  return new Promise((resolve, reject) => {
    socket.emit('get-donations', box, ({code, data}) => {
      console.log('get-donations', { code, data });

      if (code === 200) {
        resolve({ code, data });
      } else {
        reject({ code, data });
      }
    });
  });
}

export function getNearestDonation(point: [number, number]): Promise<{code, data}> {
  return new Promise((resolve, reject) => {
    socket.emit('get-nearest-donation', point, ({code, data}) => {
      console.log('get-nearest-donation', { code, data });

      if (code === 200) {
        resolve({ code, data });
      } else {
        reject({ code, data });
      }
    });
  });
}

export function onDonationAdded(cb: (donation: IDonation) => void) {
  socket.on('donation-added', ({code, data: donation}) => {
    console.log('donation-added', donation);

    if (code === 200) {
      cb(donation);
    }
  });
}

export function onDonationUpdated(cb: (donation: IDonation) => void) {
  socket.on('donation-updated', ({code, data: donation}) => {
    console.log('donation-updated', donation);

    if (code === 200) {
      cb(donation);
    }
  });
}

export function onDonationsChanged(cb: (donations: ReadonlyArray<IDonation>) => void) {
  socket.on('donations', ({code, data: donations}) => {
    if (code === 200) {
      console.log('donations', donations);
      cb(donations);
    }
  });
}

export function onDonationDeleted(cb: (x: { accessToken: string, id: string }) => void) {
  socket.on('donation-deleted', ({code, data: id}) => {
    console.log('donation-deleted', { code, id });

    if (code === 200) {
      cb(id);
    }
  });
}

export function onLocationChanged(cb: (x: { longitude?: number, latitude?: number }) => void) {
  socket.on('location', ({code, data}) => {
    console.log('location', { code, data });

    if (code === 200) {
      cachedLocation = data;
      cb(data);
    }
  });
}

export function updateDonation(donation: IDonation): Promise<{ code, data }> {
  return new Promise((resolve, reject) => {
    socket.emit('update-donation', donation, ({code, data}) => {
      console.log('update-donation', { code, data });

      if (code === 200) {
        resolve({ code, data });
      } else {
        reject({ code, data });
      }
    });
  });
}
