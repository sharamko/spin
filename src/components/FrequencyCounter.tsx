import React from 'react';
import { Item } from '@/types';
import Image from 'next/image';

interface Props {
  data: Item[];
  counts: Record<string, number>;
}

const FrequencyCounter: React.FC<Props> = ({ data, counts }) => (
  <div className="historyContainer">
    <p className="historyContainerTitle">LAST 100</p>
    <ul className="historyList">
      {data.map((d) => (
        <li key={d.id} className="historyItem">
          <Image src={d.value} alt={d.id} width={24} height={24} />
          <span>{counts[d.id] || 0}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default FrequencyCounter;
