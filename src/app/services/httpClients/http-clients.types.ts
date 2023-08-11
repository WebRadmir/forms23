export interface IPerson {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
  id?: number;
}

export interface IPost {
  userId: number;
  id?: number;
  title: string;
  body: string;
  editing: boolean;
  active: boolean;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
