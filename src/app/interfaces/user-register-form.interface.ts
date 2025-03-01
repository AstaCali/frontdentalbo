export interface RegisterFormUsuario {
  email:      string;
  password:   string;
  role_id:    number;
  name:    string;
  last_name: string;
  ci:    number;
  celular: number;// aumente esto
  gender: string;
  createdAt:  Date;
  updatedAt:  Date;
}