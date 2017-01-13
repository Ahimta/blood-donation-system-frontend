interface IDonation {
  readonly accessToken?: string;
  readonly bloodGroup: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;

  readonly coordinates: [number, number];
  readonly latitude?: number;
  readonly longitude?: number;

  readonly _id?: string;
}

export default IDonation;
