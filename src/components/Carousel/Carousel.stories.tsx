import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CarouselContainer from './CarouselContainer';
import type { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof CarouselContainer> = {
  title: 'Components/Carousel',
  component: CarouselContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '이미지 캐러셀',
      },
    },
  },
  argTypes: {
    imgURL: {
      description: '표시할 이미지들의 URL들이 담긴 배열, children 우선 렌더',
    },
    children: {
      description: '표시할 요소들, imgURL 보다 우선순위 높음',
    },
    move: { description: '캐러셀 움직임 활성화' },
    arrow: {
      description:
        '탐색을 위해 화살표를 표시해야 하는지 여부를 나타내는 선택적 플래그 (기본값 = true)',
      defaultValue: true,
    },
    priority: {
      description: '해당 숫자 만큼 요소를 미리 렌더 (기본값 = 1)',
      defaultValue: 1,
    },
    showCurrentElement: {
      description:
        '현재 캐러셀 위치 표시의 상태창 표시 여부를 나타내는 선택적 플래그 (기본값 = true)',
      defaultValue: true,
    },
    showCurrentElementBackGround: {
      description:
        '상태창 표시 배경 여부를 나타내는 선택적 플래그 (기본값 = true)',
      defaultValue: true,
    },
    gap: {
      description:
        '캐러셀 요소 사이의 간격을 rem으로 지정하는 선택적 숫자 (기본값 = 0)',
      defaultValue: 0,
    },
    carouselMoveIntervalTime: {
      description:
        '캐러셀 움직이는 시간을 ms로 지정하는 선택적 숫자 (기본값 = 2000ms)',
      defaultValue: 2000,
    },
    arrowPushMoveWaitTime: {
      description:
        'Arrow를 누른 후 캐러셀 움직임을 멈추는 시간을 ms로 지정하는 선택적 숫자 (기본값 = 2000ms)',
      defaultValue: 2000,
    },
    movePause: {
      description: '캐러셀의 움직임을 true 동안 일시정지 (기본값 = false)',
      defaultValue: false,
    },
  },
  args: {
    imgURL: [
      'https://img.freepik.com/free-photo/pretty-woman-practising-hip-hop-dance_107420-85008.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/girl-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9249.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/dance-time-stylish-men-and-woman-dancing-hip-hop-in-bright-clothes-on-green-background-at-dance-hall-in-neon-light_155003-16406.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/two-beautiful-slender-girls-doing-dancing-and-gymnastics-in-the-dance-hall_1157-13817.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/boy-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9262.jpg?size=626&ext=jpg',
    ],
    move: true,
    arrow: true,
    showCurrentElement: true,
    showCurrentElementBackGround: true,
    gap: 0,
    priority: 1,
    carouselMoveIntervalTime: 2000,
    arrowPushMoveWaitTime: 2000,
    itemStyle: 'relative h-80 w-80 overflow-hidden',
  },
};

export default meta;
type Story = StoryObj<typeof CarouselContainer>;

export const 기본: Story = {
  render: (args) => <CarouselContainer {...args} />,
};

export function Focus동작() {
  const [focus, setFocus] = useState(false);

  const onFocus = () => {
    setFocus(true);
  };

  const offFocus = () => {
    setFocus(false);
  };

  return (
    <div onMouseLeave={offFocus} onMouseOver={onFocus}>
      <CarouselContainer
        imgURL={[
          'https://img.freepik.com/free-photo/pretty-woman-practising-hip-hop-dance_107420-85008.jpg?size=626&ext=jpg',
          'https://img.freepik.com/free-photo/girl-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9249.jpg?size=626&ext=jpg',
          'https://img.freepik.com/free-photo/dance-time-stylish-men-and-woman-dancing-hip-hop-in-bright-clothes-on-green-background-at-dance-hall-in-neon-light_155003-16406.jpg?size=626&ext=jpg',
          'https://img.freepik.com/free-photo/two-beautiful-slender-girls-doing-dancing-and-gymnastics-in-the-dance-hall_1157-13817.jpg?size=626&ext=jpg',
          'https://img.freepik.com/free-photo/boy-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9262.jpg?size=626&ext=jpg',
        ]}
        move={focus}
        arrow={focus}
        showCurrentElement={focus}
        itemStyle="relative h-80 w-80 overflow-hidden"
      />
    </div>
  );
}

export const 여러요소표시: Story = {
  render: ({ imgURL }) => (
    <div className="h-80 w-[70vw]">
      {imgURL && (
        <CarouselContainer
          imgURL={imgURL}
          move={true}
          priority={imgURL?.length}
          itemStyle="h-full w-1/3"
          carouselContainerStyle="relative size-full overflow-hidden"
        />
      )}
    </div>
  ),
};

const list = [
  {
    id: 1,
    nickname: '홍길동',
    imgURL: [
      'https://img.freepik.com/free-photo/pretty-woman-practising-hip-hop-dance_107420-85008.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/girl-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9249.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/dance-time-stylish-men-and-woman-dancing-hip-hop-in-bright-clothes-on-green-background-at-dance-hall-in-neon-light_155003-16406.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/two-beautiful-slender-girls-doing-dancing-and-gymnastics-in-the-dance-hall_1157-13817.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/boy-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9262.jpg?size=626&ext=jpg',
    ],
  },
  {
    id: 2,
    nickname: '고길동',
    imgURL: [
      'https://img.freepik.com/free-photo/pretty-woman-practising-hip-hop-dance_107420-85008.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/girl-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9249.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/dance-time-stylish-men-and-woman-dancing-hip-hop-in-bright-clothes-on-green-background-at-dance-hall-in-neon-light_155003-16406.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/two-beautiful-slender-girls-doing-dancing-and-gymnastics-in-the-dance-hall_1157-13817.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/boy-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9262.jpg?size=626&ext=jpg',
    ],
  },
  {
    id: 3,
    nickname: '이길동',
    imgURL: [
      'https://img.freepik.com/free-photo/pretty-woman-practising-hip-hop-dance_107420-85008.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/girl-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9249.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/dance-time-stylish-men-and-woman-dancing-hip-hop-in-bright-clothes-on-green-background-at-dance-hall-in-neon-light_155003-16406.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/two-beautiful-slender-girls-doing-dancing-and-gymnastics-in-the-dance-hall_1157-13817.jpg?size=626&ext=jpg',
      'https://img.freepik.com/free-photo/boy-dancing-hip-hop-in-stylish-clothes-on-gradient-background-at-dance-hall-in-neon-light_155003-9262.jpg?size=626&ext=jpg',
    ],
  },
];

export function Children사용() {
  const [focus, setFocus] = useState(false);

  const onFocus = () => {
    setFocus(true);
  };

  const offFocus = () => {
    setFocus(false);
  };

  const repeatCount = Math.ceil(6 / list.length);

  const InstructorList = Array(repeatCount).fill(list).flat().slice(0, 6);

  return (
    <div className="relative w-[70vw] bg-black px-4 py-3">
      <CarouselContainer
        move={true}
        priority={6}
        gap={16}
        mobileShowCurrentElement={false}
        showCurrentElement={false}
        movePause={focus}
        itemStyle="h-[9.375rem] w-[9.25rem]"
        carouselContainerStyle="overflow-hidden w-full"
      >
        {InstructorList.map(({ id, imgURL, nickname }, index) => (
          <div
            key={imgURL[0] + index}
            onMouseOver={onFocus}
            onMouseLeave={offFocus}
            className="size-full overflow-hidden rounded-md"
          >
            <Link href={`/instructor/${id}`} className="flex h-full flex-col">
              <div className="relative flex-grow">
                <Image
                  src={imgURL[0]}
                  alt="Connection 댄스 춤 이미지"
                  fill
                  sizes="(max-width: 720px) 60vw, (max-width: 1440px) 30vw"
                  style={{ objectFit: 'cover' }}
                  priority={true}
                />
              </div>
              <div className="flex h-6 items-center justify-center truncate bg-white text-sm lg:h-8 lg:text-base lg:font-bold">
                {nickname}
              </div>
            </Link>
          </div>
        ))}
      </CarouselContainer>
    </div>
  );
}
