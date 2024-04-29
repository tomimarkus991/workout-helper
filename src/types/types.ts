export interface IRegularRouter {
  to: string;
  element?: JSX.Element;
}

export interface UserType {
  id: string;
  email: string;
  username: string;
  avatar: string;
  bigger_text: boolean;
}
