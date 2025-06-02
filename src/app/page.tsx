import { CardData, Item } from '@/types';
import StatCards from '@/components/StatCards';
import HorizontalRoulette from '@/components/roulette';

const sampleData: Item[] = [
  { id: 'u1', name: 'Red Joker', coef: 7.14, value: '/joker-red.svg' },
  { id: 'u2', name: 'Green Card', coef: 14.26, value: '/green.svg' },
  { id: 'u3', name: 'Dark Joker', coef: 7.14, value: '/joker-dark.svg' },
  { id: 'r1', name: 'Red Card', coef: 2.32, value: '/card-red.svg' },
  { id: 'r2', name: 'Dark Card', coef: 2.32, value: '/card-dark.svg' },
];

const exampleData: CardData[] = [
  {
    color: 'ff4242',
    title: {
      primary: 'BET ON RED',
      secondary: 'PAYS 2X',
    },
    header: {
      field1: '4 Bets total',
      field2: '100.00',
    },
    rows: [
      { col1: 'User', col2: '100.00' },
      { col1: 'User', col2: '80.00' },
      { col1: 'User', col2: '50.00' },
      { col1: 'User', col2: '0.80' },
    ],
  },
  {
    color: '47ff69',
    title: {
      primary: 'BET ON GREEN',
      secondary: 'PAYS 14X',
    },
    header: {
      field1: '4 Bets total',
      field2: '100.00',
    },
    rows: [
      { col1: 'User', col2: '100.00' },
      { col1: 'User', col2: '80.00' },
      { col1: 'User', col2: '50.00' },
      { col1: 'User', col2: '0.80' },
    ],
  },
  {
    color: '343843',
    title: {
      primary: 'BET ON BLACK',
      secondary: 'PAYS 2X',
    },
    header: {
      field1: '4 Bets total',
      field2: '100.00',
    },
    rows: [
      { col1: 'User', col2: '100.00' },
      { col1: 'User', col2: '80.00' },
      { col1: 'User', col2: '50.00' },
      { col1: 'User', col2: '0.80' },
    ],
  },
  {
    color: '7246d9',
    title: {
      primary: 'BET ON JOKER',
      secondary: 'PAYS 7X',
    },
    header: {
      field1: '4 Bets total',
      field2: '100.00',
    },
    rows: [
      { col1: 'User', col2: '100.00' },
      { col1: 'User', col2: '80.00' },
      { col1: 'User', col2: '50.00' },
      { col1: 'User', col2: '0.80' },
    ],
  },
];

export default function Page() {
  return (
    <div className="page">
      <HorizontalRoulette data={sampleData} />
      <StatCards data={exampleData} />
    </div>
  );
}
