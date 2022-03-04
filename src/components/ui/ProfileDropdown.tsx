import { useDecodeToken } from 'modules/custom/useDecodeToken';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dropdown, Nav } from 'react-bootstrap';

const ProfileDropdown: React.FC = () => {
  const [profile] = useDecodeToken();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.setItem('token', '');
    localStorage.setItem('management', '');
    router.replace(process.env.PAMAFIX_LOGOUT_URL as string);
  };

  return (
    <Dropdown as={Nav.Item} className="dropdown-profile">
      <Dropdown.Toggle as={Nav.Link}>
        <div className="dropdown-user__overflow">
          <Image
            src="/images/john-doe.jpg"
            width={32}
            height={32}
            alt="Profile image"
            className="img-fluid profile-image"
          />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu align="right">
        <Dropdown.Header>
          <div className="dropdown-profile__item">
            <Image
              src="/images/john-doe.jpg"
              width={62}
              height={62}
              alt="Profile image"
              className="img-fluid dropdown-profile__image"
            />
            <div className="dropdown-profile__name">
              <p className="text__blue text__bold mb-0 dropdown-profile__name-title">
                {profile?.name}
              </p>
              <p className="text__blue text__bolder mb-0 mt-1 dropdown-profile__name-title">
                {profile?.email}
              </p>
              <span className="caption__blue caption__bold text-capitalize">
                {profile?.type}
              </span>
              <br />
              <span className="caption__blue caption__bold text-capitalize">
                {profile?.role}
              </span>
            </div>
          </div>
        </Dropdown.Header>
        <Dropdown.Item
          className="dropdown-profile__link"
          onClick={handleLogout}
        >
          <div className="dropdown-profile__item">
            <Image
              src="/images/menu_nav_icon/log-out.svg"
              width={20}
              height={20}
              alt="Log Out"
            />
            <div className="dropdown-profile__name">
              <h5 className="text__blue dropdown-profile__link-title">
                Log Out
              </h5>
            </div>
          </div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
