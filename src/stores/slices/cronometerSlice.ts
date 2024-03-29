import {StateCreator} from 'zustand';

export interface CronometerSlice {
  time: number;
  isCronometerStarted: boolean;
  
  startCount: () => void;
  stopCount: () => void;
  resetCount: () => void;
  increaseCount: () => void;
  setCount: (time: number) => void
}

export const createCronometerSlice: StateCreator<
  CronometerSlice,
  [],
  [],
  CronometerSlice
> = set => ({
  time: 0,
  isCronometerStarted: false,
  startCount: () => set(() => ({isCronometerStarted: true})),
  stopCount: () => set(() => ({isCronometerStarted: false})),
  resetCount: () => set(() => ({isCronometerStarted: false, time: 0})),
  increaseCount: () => set(state => ({time: state.time + 1})),
  setCount: (time: number) => set(() => ({time}))
});
