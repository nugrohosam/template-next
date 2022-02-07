import jwt_decode from 'jwt-decode';
import { Profile } from 'modules/profile/entities';

export const decodeToken: (token: string) => Profile | undefined = (
  token: string | null
) => {
  if (!token) {
    return undefined;
  }

  const decoded: Profile = jwt_decode(token);
  return decoded;
};
