import { CardData } from '@/types';
import React from 'react';
import StatCard from './StatCard';

interface Props {
  data: CardData[];
}

const StatCards: React.FC<Props> = ({ data }) => {
  return (
    <div className="statCards">
      {data.map((card) => (
        <StatCard key={card.color} data={card} />
      ))}
    </div>
  );
};

export default StatCards;
