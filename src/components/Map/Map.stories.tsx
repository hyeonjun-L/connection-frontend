import { StoryObj, Meta } from '@storybook/react';
import AddressMap from './AddressMap';

const meta: Meta<typeof AddressMap> = {
  title: 'Components/Map',
  component: AddressMap,
  tags: ['autodocs'],
  argTypes: {
    address: {
      description: '지도 위치를 표시할 상세 주소',
    },
    studioName: {
      description: '마커 아래 표시할 스튜디오 이름',
    },
  },
  args: {
    address: '서울특별시 성동구 뚝섬로13길 33',
    studioName: '원밀리언 댄스 스튜디오',
  },
};

export default meta;
type Story = StoryObj<typeof AddressMap>;

export const 기본: Story = {
  render: (args) => (
    <div className=" h-96 w-full ">
      <AddressMap {...args} />
    </div>
  ),
};
