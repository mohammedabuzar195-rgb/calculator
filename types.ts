
export type Operator = '+' | '-' | '*' | '/' | null;

export interface CalcState {
  currentValue: string;
  previousValue: string;
  operator: Operator;
  overwrite: boolean;
  history: string;
  error: string | null;
}
