import { memo } from 'react';
import ApplyClass from './ApplyClass';
import FindClass from './FindClass';

const LearnerLanding = () => {
  return (
    <>
      <FindClass />
      <ApplyClass />
    </>
  );
};

export default memo(LearnerLanding);
