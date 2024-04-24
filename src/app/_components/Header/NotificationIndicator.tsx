'use client';
import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { AlarmSVG, ChatSVG } from '@/icons/svg';
import { getUnreadCount } from '@/lib/apis/chatApi';
import { getNotificationsUnreadCount } from '@/lib/apis/notifications';
import { useChatStore } from '@/store';
import { useNotificationsStore } from '@/store/notificationsStore';
import { useScrollStore } from '@/store/scrollStore';
import NotificationList from './NotificationList';
import ChatPreviews from './Previews/ChatPreviews';
import NotificationsPreviews from './Previews/NotificationsPreviews';
import PreviewsContainer from './Previews/PreviewsContainer';
import { userType } from '@/types/auth';
import { ChatRoom } from '@/types/chat';
import { NotificationType } from '@/types/notifications';

interface NotificationIndicatorProps {
  id: string;
  userType: userType;
  isMobile: boolean;
}

const NotificationIndicator = ({
  id,
  userType,
  isMobile,
}: NotificationIndicatorProps) => {
  const [openAlarm, setOpenAlarm] = useState(false);
  const [previews, setPreviews] = useState<NotificationType | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationRef = useRef(null);
  const pathName = usePathname();

  const isNotificationsPath = pathName.startsWith('/notifications');
  const userIdType = userType === 'user' ? 'userId' : 'lecturerId';
  const opponentType = userType === 'user' ? 'lecturer' : 'user';

  const { chatView, newChat, setChatView, setChatRoomSelect, setNewChat } =
    useChatStore((state) => ({
      setChatView: state.setChatView,
      chatView: state.chatView,
      newChat: state.newChat,
      setChatRoomSelect: state.setChatRoomSelect,
      setNewChat: state.setNewChat,
    }));

  const { newNotifications, setNewNotifications } = useNotificationsStore(
    (state) => ({
      newNotifications: state.newNotifications,
      setNewNotifications: state.setNewNotifications,
    }),
  );

  const { isScrollingUp } = useScrollStore((state) => ({
    isScrollingUp: state.isScrollingUp,
  }));

  const [{ data: chatCount }, { data: alarmCount }] = useQueries({
    queries: [
      {
        queryKey: ['commentCount'],
        queryFn: () => getUnreadCount(),
        staleTime: Infinity,
        refetchOnWindowFocus: 'always',
      },
      {
        queryKey: ['notificationCount'],
        queryFn: () => getNotificationsUnreadCount(),
        staleTime: Infinity,
        refetchOnWindowFocus: 'always',
      },
    ],
  });

  const closePreviews = useCallback(() => {
    setPreviews(null);
    setNewChat(null);
    setNewNotifications(null);
  }, [setNewChat, setNewNotifications]);

  const startTimer = useCallback(() => {
    timerRef.current = setTimeout(() => closePreviews(), 5000);
  }, [closePreviews]);

  const stopTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const clickChatPreviewsHandler = () => {
    if (!newChat) return;
    closePreviews();
    setChatView(true);

    const newChatRoom: ChatRoom = {
      id: newChat.chatRoomId,
      user: {
        id: newChat.receiver.userId || (newChat.sender.userId as number),
        participation: true,
      },
      lecturer: {
        id:
          newChat.receiver.lecturerId || (newChat.sender.lecturerId as number),
        participation: true,
      },
      lastChat: {
        ...newChat,
      },
    };

    setChatRoomSelect(newChatRoom);
  };

  useClickAway(notificationRef, () => {
    setOpenAlarm(false);
  });

  useEffect(() => {
    if (!isScrollingUp) {
      setOpenAlarm(false);
    }
  }, [isScrollingUp]);

  useEffect(() => {
    if (
      newNotifications ||
      (newChat && newChat.receiver[userIdType] === Number(id))
    ) {
      setPreviews(newChat ? 'CHAT' : 'NOTIFICATIONS');
      startTimer();
    }

    return () => stopTimer();
  }, [id, newChat, newNotifications, startTimer, userIdType]);

  const displatCountHandler = (count?: number) => {
    return count
      ? count > 99
        ? '99+'
        : count > 0
        ? count.toString()
        : ''
      : '';
  };

  const displayChatCount = useMemo(
    () => displatCountHandler(chatCount),
    [chatCount],
  );

  const displayAlarmCount = useMemo(
    () => displatCountHandler(alarmCount),
    [alarmCount],
  );

  return (
    <div className="flex items-center gap-3">
      <div ref={notificationRef} className="relative flex items-center">
        <motion.div layoutId="NOTIFICATIONS" />
        {isMobile ? (
          <Link href="/notifications">
            <AlarmIconWrapper
              alarmCount={displayAlarmCount}
              isView={isNotificationsPath || openAlarm}
            />
          </Link>
        ) : (
          <button onClick={() => setOpenAlarm((prev) => !prev)}>
            <AlarmIconWrapper
              alarmCount={displayAlarmCount}
              isView={isNotificationsPath || openAlarm}
            />
          </button>
        )}
        {!isNotificationsPath && openAlarm && (
          <NotificationList userType={userType} />
        )}
        {!isNotificationsPath &&
          previews === 'NOTIFICATIONS' &&
          newNotifications && (
            <PreviewsContainer
              layoutId="NOTIFICATIONS"
              startTimer={startTimer}
              stopTimer={stopTimer}
              closePreviews={closePreviews}
            >
              <NotificationsPreviews
                notifications={newNotifications}
                userType={userType}
              />
            </PreviewsContainer>
          )}
      </div>
      <div className="relative flex items-center">
        <button onClick={() => setChatView(!chatView)}>
          <ChatSVG
            width="29"
            height="30"
            className={chatView ? 'fill-main-color' : 'fill-black'}
          />
          <motion.div layoutId="CHAT" />
          <span className="absolute -right-1.5 top-0 min-w-[1rem] rounded-full bg-main-color px-1 text-xs font-bold text-white">
            {displayChatCount}
          </span>
        </button>
        {newChat && previews === 'CHAT' && !chatView && (
          <PreviewsContainer
            layoutId="CHAT"
            startTimer={startTimer}
            stopTimer={stopTimer}
            onClick={clickChatPreviewsHandler}
            closePreviews={closePreviews}
          >
            <ChatPreviews
              chat={newChat}
              opponentType={opponentType}
              closeChatPreview={closePreviews}
            />
          </PreviewsContainer>
        )}
      </div>
    </div>
  );
};

export default NotificationIndicator;

interface AlarmIconWrapperProps {
  isView: boolean;
  alarmCount?: string;
}

const AlarmIconWrapper = ({ alarmCount, isView }: AlarmIconWrapperProps) => (
  <>
    <AlarmSVG
      className={`${isView ? 'fill-main-color' : 'fill-black'} pt-0.5`}
      width="31"
      height="31"
    />
    <span className="absolute -right-1.5 top-0 min-w-[1rem] rounded-full bg-main-color px-1 text-xs font-bold text-white">
      {alarmCount}
    </span>
  </>
);
