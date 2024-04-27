import { useQuery } from '@tanstack/react-query';
import { CloseSVG } from '@/icons/svg';
import { getOpponentInfo } from '@/lib/apis/chatApi';
import ProfileImg from '@/components/Profile/ProfileImage';
import { userType } from '@/types/auth';
import { Chat } from '@/types/chat';

interface ChatPreviewProps {
  chat: Chat;
  opponentType: userType;
  closeChatPreview: () => void;
}

const ChatPreviews = ({
  chat,
  opponentType,
  closeChatPreview,
}: ChatPreviewProps) => {
  const opponentId = chat.sender[
    opponentType === 'lecturer' ? 'lecturerId' : 'userId'
  ] as number;

  const { data, isLoading } = useQuery({
    queryKey: ['opponentProfile', opponentType, opponentId],
    queryFn: () => getOpponentInfo(opponentType, opponentId),
    staleTime: Infinity,
  });

  const closePreviewHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closeChatPreview();
  };

  return (
    <>
      <div className="relative grid grid-cols-[auto_1fr] items-center">
        {isLoading ? (
          <>
            <div className="mr-3 size-[34px] flex-shrink-0 animate-pulse rounded-full bg-gray-500" />
            <div className="h-4 w-14 animate-pulse bg-gray-500" />
          </>
        ) : (
          <>
            <ProfileImg src={data?.profileImg} size="small" />
            <p className="flex-grow truncate text-left font-bold">
              {data?.nickname}
            </p>
          </>
        )}
        <button
          className="absolute -right-1 -top-1"
          onClick={closePreviewHandler}
        >
          <CloseSVG className="size-[17px] stroke-[#414141] stroke-[3px]" />
        </button>
      </div>
      <p className="line-clamp-2 whitespace-pre-wrap text-left text-sm">
        {chat.imageUrl ? '이미지' : chat.content}
      </p>
    </>
  );
};

export default ChatPreviews;
