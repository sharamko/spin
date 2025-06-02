import React from 'react';
import { Item } from '@/types';
import Image from 'next/image';

interface Props {
  lastTenSpins: Item[];
}

const LastTenSpins: React.FC<Props> = ({ lastTenSpins }) => (
  <div className="lastTen">
    <div className="lastTenList">
      {lastTenSpins.map((item, idx) => (
        <div key={`${item.id}-last10-${idx}`} className="lastTenItem">
          <Image src={item.value} alt={item.id} width={32} height={32} />
        </div>
      ))}
    </div>
  </div>
);

export default LastTenSpins;
