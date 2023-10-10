import React from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import './loadingspinner.css';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <h2 className='loadingText'>Loading the Fun!</h2>
      <ClipLoader className='spinner' css={override} size={50} color={'#123abc'} loading={true} />
    </div>
  );
};

export default LoadingSpinner;