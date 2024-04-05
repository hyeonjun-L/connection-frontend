import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { ToastContainer } from 'react-toastify';
import { getChatSocketRoomsId } from '@/lib/apis/serverApis/chatApi';
import {
  getInstructorProfile,
  getMyProfile,
} from '@/lib/apis/serverApis/userApi';
import NaverMapsProviders from '@/lib/provider/NaverMapsProviders';
import Providers from '@/lib/provider/providers';
import { convertToProfileInfo } from '@/utils/apiDataProcessor';
import ChatModal from './_components/chat/ChatModal';
import ControlOptions from './_components/ControlOptions';
import Footer from './_components/Footer';
import Header from './_components/Header/Header';
import UserProfileLinks from './_components/Header/UserProfileLinks';
import UserStoreInitializer from './_components/Header/UserStoreInitializer';
import MobileNav from './_components/MobileNav';
import SocketInitializer from './_components/SocketInitializer';
import { profileInfo, userType } from '@/types/auth';
import type { Metadata } from 'next';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toastify.css';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Connection',
  description: 'Generated by Connection',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const user = cookieStore.get('userAccessToken')?.value;
  const lecturer = cookieStore.get('lecturerAccessToken')?.value;
  let authUser: profileInfo | null = null;
  let userType: userType | null = null;
  let socketRooms: string[] | null = null;

  try {
    if (user) {
      const userProfile = await getMyProfile();
      authUser = convertToProfileInfo(userProfile);
      userType = 'user';
    }

    if (lecturer) {
      const instructorProfile = await getInstructorProfile();
      authUser = convertToProfileInfo(instructorProfile);
      userType = 'lecturer';
    }

    if (authUser) {
      socketRooms = await getChatSocketRoomsId(authUser.id);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }

  return (
    <html lang="ko">
      <body
        className={`${inter.className} mx-auto flex min-h-screen max-w-desktop flex-col`}
      >
        <Providers>
          <UserStoreInitializer authUser={authUser} userType={userType} />
          <SocketInitializer
            userType={userType}
            userId={authUser?.id}
            rooms={socketRooms}
          />
          <Header>
            <UserProfileLinks authUser={authUser} userType={userType} />
          </Header>
          <ChatModal />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <NaverMapsProviders>{children}</NaverMapsProviders>
          {children}
          <ControlOptions />
          <Footer />
          <MobileNav />
        </Providers>
        <GoogleAnalytics gaId="G-JSWE2TFJ10" />
        <GoogleTagManager gtmId="GTM-WV6RNCC9" />
      </body>
    </html>
  );
}
