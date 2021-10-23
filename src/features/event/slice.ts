import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { getEventLogs } from './api';

export enum EventTypes {
  ColonyInitialised,
  ColonyRoleSet,
  PayoutClaimed,
  DomainAdded,
}

type EventLogBase = {
  id: string,
  colonyAddress: string,
  eventType: EventTypes,
  logTime: number,
};

export type ColonyInitialisedEventLog = EventLogBase;

export type ColonyRoleSetEventLog = EventLogBase & {
  role: string,
  userAddress: string,
  domainId: string,
};

export type PayoutClaimedEventLog = EventLogBase & {
  userAddress: string,
  amount: string,
  token: string,
  fundingPotId: string,
};

export type DomainAddedEventLog = EventLogBase & {
  domainId: string,
};

export type EventLog = ColonyInitialisedEventLog | ColonyRoleSetEventLog | PayoutClaimedEventLog | DomainAddedEventLog;

export type EventState = {
  events: EventLog[],
}

const initialState: EventState = {
  events: [],
};

export const getEventLogsAsync = createAsyncThunk(
  'event/getEventLogs',
  async () => {
    const events = await getEventLogs();
    return events;
  }
);

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEventLogsAsync.fulfilled, (state, action) => {
        state.events = action.payload;
      });
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: RootState) => state.event.events;

export default eventSlice.reducer;
