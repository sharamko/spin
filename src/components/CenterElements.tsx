import React from 'react';
import Image from 'next/image';

const CenterElements: React.FC = () => (
  <div className="centerElements">
    <Image src="/coin.svg" alt="Coin" width={16} height={16} />
    <div className="centerElementsCardWrapper">
      <div className="centerElementsCard"></div>
      <div className="centerElementsCard"></div>
      <div className="centerElementsCard"></div>
    </div>
  </div>
);

export default CenterElements;
