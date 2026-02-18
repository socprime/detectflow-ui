import { FC } from 'react';

import './SpinnerSquare.scss';

export type SpinnerSquareProps = {
  variant?: 'fixed' | 'absolute' | 'default';
};

export const SpinnerSquare: FC<SpinnerSquareProps> = ({ variant = 'default' }) => (
  <div className={`square-spinner ${variant}`}>
    <div className="square-spinner__main">
      <div className="square-spinner__square">
        <span />
        <span />
        <span />
      </div>
      <div className="square-spinner__square">
        <span />
        <span />
        <span />
      </div>
      <div className="square-spinner__square">
        <span />
        <span />
        <span />
      </div>
    </div>
  </div>
);
