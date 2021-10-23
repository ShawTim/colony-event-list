import React from 'react';
import Blockies from 'react-blockies';
import {
  ColonyInitialisedEventLog,
  ColonyRoleSetEventLog,
  PayoutClaimedEventLog,
  DomainAddedEventLog,
  EventLog,
  EventTypes,
} from '../../features/event/slice';
import { formatDate } from './utils';
import styles from './index.module.scss';

export type EventItemProps = React.HTMLAttributes<HTMLElement> & {
  event: EventLog,
};
export type ColonyInitialisedEventItemProps = React.HTMLAttributes<HTMLElement> & {
  event: ColonyInitialisedEventLog,
};
export type ColonyRoleSetEventItemProps = React.HTMLAttributes<HTMLElement> & {
  event: ColonyRoleSetEventLog,
};
export type PayoutClaimedEventItemProps = React.HTMLAttributes<HTMLElement> & {
  event: PayoutClaimedEventLog,
};
export type DomainAddedEventItemProps = React.HTMLAttributes<HTMLElement> & {
  event: DomainAddedEventLog,
};

export const ColonyInitialisedEventItem = (props: ColonyInitialisedEventItemProps) => {
  const { event, ...htmlProps } = props;

  return (
    <li {...htmlProps} className={styles.eventItem}>
      <div className={styles.avatar}>
        <Blockies seed={event.colonyAddress} />
      </div>
      <div className={styles.content}>
        <div className={styles.primary}>
          <span>Congratulations! It's a beautiful baby colony!</span>
        </div>
        <div className={styles.secondary}>{formatDate(event.logTime)}</div>
      </div>
    </li>
  );
};

export const ColonyRoleSetEventItem = (props: ColonyRoleSetEventItemProps) => {
  const { event, ...htmlProps } = props;

  return (
    <li {...htmlProps} className={styles.eventItem}>
      <div className={styles.avatar}>
        <Blockies seed={event.userAddress} />
      </div>
      <div className={styles.content}>
        <div className={styles.primary}>
          <span className={styles.heavy}>{event.role}</span>
          <span> role assigned to user </span>
          <span className={styles.heavy}>{event.userAddress}</span>
          <span> in domain </span>
          <span className={styles.heavy}>{event.domainId}</span>
          <span>.</span>
        </div>
        <div className={styles.secondary}>{formatDate(event.logTime)}</div>
      </div>
    </li>
  );
};

export const PayoutClaimedEventItem = (props: PayoutClaimedEventItemProps) => {
  const { event, ...htmlProps } = props;

  return (
    <li {...htmlProps} className={styles.eventItem}>
      <div className={styles.avatar}>
        <Blockies seed={event.userAddress} />
      </div>
      <div className={styles.content}>
        <div className={styles.primary}>
          <span>User </span>
          <span className={styles.heavy}>{event.userAddress}</span>
          <span> claimed </span>
          <span className={styles.heavy}>{event.amount}</span>
          <span className={styles.heavy}>{event.token}</span>
          <span> payout from pot </span>
          <span className={styles.heavy}>{event.fundingPotId}</span>
          <span>.</span>
        </div>
        <div className={styles.secondary}>{formatDate(event.logTime)}</div>
      </div>
    </li>
  );
};

export const DomainAddedEventItem = (props: DomainAddedEventItemProps) => {
  const { event, ...htmlProps } = props;

  return (
    <li {...htmlProps} className={styles.eventItem}>
      <div className={styles.avatar}>
        <Blockies seed={event.colonyAddress} />
      </div>
      <div className={styles.content}>
        <div className={styles.primary}>
          <span>Domain </span>
          <span className={styles.heavy}>{event.domainId}</span>
          <span> added.</span>
        </div>
        <div className={styles.secondary}>{formatDate(event.logTime)}</div>
      </div>
    </li>
  );
};

const EventItem = (props: EventItemProps) => {
  const { event, ...htmlProps } = props;

  switch (event?.eventType) {
    case EventTypes.ColonyInitialised:
      return <ColonyInitialisedEventItem {...htmlProps} event={event as ColonyInitialisedEventLog} />;
    case EventTypes.ColonyRoleSet:
      return <ColonyRoleSetEventItem {...htmlProps} event={event as ColonyRoleSetEventLog} />;
    case EventTypes.PayoutClaimed:
      return <PayoutClaimedEventItem {...htmlProps} event={event as PayoutClaimedEventLog} />;
    case EventTypes.DomainAdded:
      return <DomainAddedEventItem {...htmlProps} event={event as DomainAddedEventLog} />;
    default:
      return null;
  }
};

export default EventItem;