import { useMutation } from '@tanstack/react-query';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AlarmSVG } from '@/icons/svg';
import { sendNotifications } from '@/lib/apis/notifications';
import ProfileImg from '../Profile/ProfileImage';
import { MemberData } from '@/types/instructor';
import { ISendNotification } from '@/types/notifications';

interface NotificationSenderModalProps {
  memberList: MemberData[];
  totalItemCount: number;
}

const NotificationSenderModal = ({
  memberList,
  totalItemCount,
}: NotificationSenderModalProps) => {
  const formMethods = useForm<ISendNotification>({
    shouldFocusError: true,
  });
  const { handleSubmit, register, control, watch, setValue } = formMethods;

  const selectedTargets = watch('targets', []);

  const onSubmit = (data: ISendNotification) => {
    sendNotificationsMutate(data);
  };

  const onError = (errors: FieldErrors<ISendNotification>) => {
    if (errors.description) {
      toast.error(errors.description.message);
    }

    if (errors.targets) {
      toast.error(errors.targets.message);
    }
  };

  const { mutate: sendNotificationsMutate, isPending } = useMutation({
    mutationFn: sendNotifications,
    onSuccess: () => toast.success('알림 전송 완료'),
  });

  return (
    <article className="relative grid size-full max-w-[39rem] grid-rows-[auto_1fr] sm:h-auto sm:w-screen">
      <header className="flex gap-2 border-b border-solid border-gray-500 px-5 py-6 text-lg font-bold">
        <AlarmSVG width="31" height="31" className="fill-black" />
        알림 보내기
      </header>
      <section className="grid grid-rows-[1fr_auto_3fr] overflow-hidden px-4 pb-6 pt-2 text-sm sm:block">
        <textarea
          {...register('description', {
            required: '전달할 알림 메세지를 적어주세요.',
          })}
          className="w-full resize-none rounded-md border border-sub-color1 px-5 py-3 outline-none sm:h-[6.563rem]"
          placeholder="수강생에게 전달할 알림 메세지를 적어주세요."
        />
        <div className="mb-4 mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <input
              id="allSelect"
              type="checkbox"
              checked={selectedTargets.length === memberList.length}
              onChange={(e) => {
                e.target.checked
                  ? setValue(
                      'targets',
                      memberList.map(({ user }) => user.id),
                    )
                  : setValue('targets', []);
              }}
              className="size-[18px] accent-sub-color1"
            />
            <label htmlFor="allSelect" className="cursor-pointer select-none">
              전체선택
            </label>
            <p className="text-base font-bold">{totalItemCount}명</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <button
              disabled={isPending}
              className="rounded-md border border-solid border-black bg-white px-[6px] py-[5px] text-black hover:bg-black/10 active:bg-black active:text-white disabled:bg-black/10"
            >
              {selectedTargets.length}명에게 전송하기
            </button>
          </form>
        </div>
        <Controller
          name="targets"
          control={control}
          defaultValue={[]}
          rules={{
            required: '전송하실 회원을 선택해 주세요.',
          }}
          render={({ field }) => (
            <ul className="grid h-fit max-h-full grid-cols-2 gap-x-2 gap-y-4 overflow-y-scroll sm:max-h-72">
              {memberList.map(({ user }) => {
                const checked = field.value.includes(user.id);
                return (
                  <li className="h-fit" key={user.id}>
                    <div className="flex items-center">
                      <input
                        id={user.nickname}
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          checked
                            ? field.onChange(
                                field.value.filter((id) => id !== user.id),
                              )
                            : field.onChange([...field.value, user.id])
                        }
                        className="mr-2 size-[18px] accent-sub-color1"
                      />
                      <label
                        htmlFor={user.nickname}
                        className="grid flex-grow cursor-pointer grid-cols-[auto_1fr] items-center"
                      >
                        <ProfileImg src={user.userProfileImage} size="small" />
                        <p className="truncate">{user.nickname}</p>
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        />
      </section>
    </article>
  );
};

export default NotificationSenderModal;
