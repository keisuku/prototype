export type PositionDirection = 'long' | 'short';

export interface Position {
  direction: PositionDirection;
  entryPrice: number;
  size: number;
  entryTime: number;
}

export interface Trade {
  id: string;
  direction: PositionDirection;
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  entryTime: number;
  exitTime: number;
}

export interface TradeSignal {
  action: 'open_long' | 'open_short' | 'close';
  price: number;
  timestamp: number;
}

export interface Portfolio {
  balance: number;
  activePosition: Position | null;
  tradeHistory: Trade[];
  totalRealizedPnl: number;
}
