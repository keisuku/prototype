import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Position, Trade, TradeSignal } from '../types/bot';
import {
  evaluateSignal,
  calculatePositionSize,
  calculatePnl,
  closeTrade,
} from '../core/botEngine';
import defaults from '../config/defaults.json';

interface BotState {
  balance: number;
  activePosition: Position | null;
  tradeHistory: Trade[];
  totalRealizedPnl: number;
  unrealizedPnl: number;

  updateBot: (closes: number[], currentPrice: number) => void;
  resetPortfolio: () => void;
}

export const useBotStore = create<BotState>()(
  persist(
    (set, get) => ({
      balance: defaults.startingBalance,
      activePosition: null,
      tradeHistory: [],
      totalRealizedPnl: 0,
      unrealizedPnl: 0,

      updateBot: (closes: number[], currentPrice: number) => {
        const { activePosition, balance } = get();

        // Update unrealized P&L
        if (activePosition) {
          set({ unrealizedPnl: calculatePnl(activePosition, currentPrice) });
        }

        // Evaluate trade signal
        const signal = evaluateSignal(closes, activePosition);
        if (!signal) return;

        if (signal.action === 'close' && activePosition) {
          const trade = closeTrade(activePosition, signal.price);
          set((state) => ({
            activePosition: null,
            tradeHistory: [trade, ...state.tradeHistory].slice(0, 100),
            totalRealizedPnl: state.totalRealizedPnl + trade.pnl,
            balance: state.balance + trade.pnl,
            unrealizedPnl: 0,
          }));
        } else if (
          signal.action === 'open_long' ||
          signal.action === 'open_short'
        ) {
          const size = calculatePositionSize(balance, signal.price);
          const direction = signal.action === 'open_long' ? 'long' : 'short';
          set({
            activePosition: {
              direction,
              entryPrice: signal.price,
              size,
              entryTime: signal.timestamp,
            } as Position,
          });
        }
      },

      resetPortfolio: () => {
        set({
          balance: defaults.startingBalance,
          activePosition: null,
          tradeHistory: [],
          totalRealizedPnl: 0,
          unrealizedPnl: 0,
        });
      },
    }),
    {
      name: 'bot-portfolio',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
