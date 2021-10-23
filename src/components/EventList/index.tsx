import React from 'react';
import ItemList from './ItemList';
import EventItem from './EventItem';
import { EventLog } from '../../features/event/slice';

export type EventListProps = React.HTMLAttributes<HTMLElement> & {
  events: EventLog[],
};

const EventList = (props: EventListProps) => {
  const { events = [], ...htmlProps } = props;

  return (
    <ItemList {...htmlProps}>
      {events.map((event) => <EventItem key={`event-${event.id}`} event={event} />)}
    </ItemList>
  )
};

export default EventList;