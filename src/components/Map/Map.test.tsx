import { render } from '@testing-library/react';
import AddressMap from './AddressMap';

describe('Map', () => {
  it('renders without crashing', () => {
    render(
      <AddressMap
        address="서울특별시 성동구 뚝섬로13길 33"
        studioName="원밀리언 댄스 스튜디오"
      />,
    );
  });
});
