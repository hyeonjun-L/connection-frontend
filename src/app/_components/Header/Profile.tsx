'use client';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { ArrowUpSVG } from '@/icons/svg';
import { useUserStore } from '@/store';
import { useScrollStore } from '@/store/scrollStore';
import ProfileMenu from './ProfileMenu';
import ProfileImage from '@/components/Profile/ProfileImage';

const Profile = ({
  defaultProfileImg,
}: {
  defaultProfileImg: string | null;
}) => {
  const { authUser } = useUserStore((state) => ({
    authUser: state.authUser,
  }));
  const [isProfileMenu, setIsProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const { isScrollingUp } = useScrollStore((state) => ({
    isScrollingUp: state.isScrollingUp,
  }));

  useEffect(() => {
    if (!isScrollingUp) {
      setIsProfileMenu(false);
    }
  }, [isScrollingUp]);

  useClickAway(menuRef, () => {
    setIsProfileMenu(false);
  });

  const userMenuHandler = () => {
    setIsProfileMenu((prev) => !prev);
  };

  const profileImg = authUser ? authUser.profileImage : defaultProfileImg;

  return (
    <div className="relative hidden w-[4.8125rem] sm:block" ref={menuRef}>
      <div
        onClick={userMenuHandler}
        className="absolute -top-10 flex h-12 w-full cursor-pointer items-center justify-center rounded-[3.125rem] bg-white shadow-horizontal "
      >
        <div className="relative ml-1.5 overflow-hidden rounded-full">
          <ProfileImage size="small" src={profileImg} label={false} />
        </div>
        <ArrowUpSVG
          className={`h-[34px] w-[34px] fill-black ${
            isProfileMenu ? 'transform' : '-translate-x-0.5 rotate-180'
          } `}
        />
      </div>

      {isProfileMenu && <ProfileMenu />}
    </div>
  );
};

export default Profile;
