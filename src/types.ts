export type Item = {
  id: string;
  value: string;
  name: string;
  coef: number;
};

export type TableRow = {
  col1: string;
  col2: string;
};

export type CardData = {
  color: string;
  title: {
    primary: string;
    secondary: string;
  };
  header: {
    field1: string;
    field2: string;
  };
  rows: TableRow[];
};
