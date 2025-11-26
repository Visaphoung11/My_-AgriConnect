export interface IUser {
  _id?: String;
  firstName: String;
  lastName: String;
  userName: String;
   age: Number;
  role: String;
  phone: String;
  email: String;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterInput {
  firstName: String;
  lastName: String;
  // userName: String;
  age: Number;
  role?: String;
  phone: String;
  email: String;
  password: String;
}

export interface JwtPayloadInput {
  id: string;
  role: string;
  email: string;
  userName: string;
  roles: string[];
} // we have to use export interface because it is the input type
