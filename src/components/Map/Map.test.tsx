import { render } from '@testing-library/react';
import { StudioLocationMap } from './AddressMap';

describe('Map', () => {
  it('renders without crashing', () => {
    render(
      <StudioLocationMap
        address="서울특별시 성동구 뚝섬로13길 33"
        studioName="원밀리언 댄스 스튜디오"
      />,
    );
  });
});
