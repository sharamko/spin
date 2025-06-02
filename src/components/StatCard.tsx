import { CardData } from '@/types';
import React from 'react';

interface Props {
  data: CardData;
}

const StatCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="statCard">
      <div
        className="statCardTitle"
        style={{ backgroundColor: `#${data.color}` }}
      >
        <span>{data.title.primary}</span>
        <span>{data.title.secondary}</span>
      </div>

      <div className="statCardHeader">
        <p>{data.header.field1}</p>
        <p>
          <img src="/coin.svg" width={20} height={20} alt="coin" />
          <span className="statCardHeader__value">{data.header.field2}</span>
        </p>
      </div>
      <div className="statCardRows">
        {data.rows.map((row, idx) => (
          <div className="statCardRow" key={`${row.col1}-${idx}`}>
            <p>
              <img src="/rank.svg" width={20} height={20} alt="coin" />
              <span>{row.col1}</span>
            </p>
            <p>
              <img src="/coin.svg" width={20} height={20} alt="coin" />
              <span>{row.col2}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatCard;
