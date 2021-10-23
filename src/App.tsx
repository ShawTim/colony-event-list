import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { getEventLogsAsync } from './features/event/slice';
import EventList from './components/EventList';
import styles from './App.module.scss';

const App = () => {
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.event.events ?? []);

  useEffect(() => {
    dispatch(getEventLogsAsync());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <EventList events={events} />
    </div>
  );
};

export default App;