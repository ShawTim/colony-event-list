import { getColonyNetworkClient, getLogs, getBlockTime, Network, ColonyClientV4, ColonyRole } from '@colony/colony-js';
import { Wallet } from 'ethers';
import { InfuraProvider } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';
import {
  ColonyInitialisedEventLog,
  ColonyRoleSetEventLog,
  PayoutClaimedEventLog,
  DomainAddedEventLog,
  EventLog,
  EventTypes,
} from './slice';

// Set up the network address constants that you"ll be using
// The two below represent the current ones on mainnet
// Don't worry too much about them, just use them as-is
const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

// this magic number is used for handling numbers in BigNumber
const BIGNUM_POW18 = new BigNumber(10).pow(18);
// mapping from address to token
const TOKEN_MAP: { [key: string]: string } = {
  "0x0dd7b8f3d1fa88FAbAa8a04A0c7B52FC35D4312c": "ΒLNY",
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": "DAI",
};

export const getEventLogs = async (): Promise<EventLog[]> => {
  const provider = new InfuraProvider();
  const wallet = Wallet.createRandom();
  const connectedWallet = wallet.connect(provider);
  const networkClient = await getColonyNetworkClient(Network.Mainnet, connectedWallet, { networkAddress: MAINNET_NETWORK_ADDRESS });

  // filter for event type "ColonyRoleSet" available in ColonyClientV4 but not ColonyClient
  const colonyClient = await networkClient.getColonyClient(MAINNET_BETACOLONY_ADDRESS) as ColonyClientV4;

  // get event logs (async) for 4 types: ColonyInitialised, ColonyRoleSet, PayoutClaimed, DomainAdded
  const [colonyInitialisedLogs, colonyRoleSetLogs, payoutClaimedLogs, domainAddedLogs] = await Promise.all([
    getColonyInitialisedLogs(colonyClient, provider),
    getColonyRoleSetLogs(colonyClient, provider),
    getPayoutClaimedLogs(colonyClient, provider),
    getDomainAddedLogs(colonyClient, provider),
  ]);

  const allLogs = ([] as EventLog[]).concat(colonyInitialisedLogs).concat(colonyRoleSetLogs).concat(payoutClaimedLogs).concat(domainAddedLogs);
  const sortedLogs = allLogs.sort((a, b) => b.logTime - a.logTime);

  return sortedLogs;
};

const getColonyInitialisedLogs = async (colonyClient: ColonyClientV4, provider: InfuraProvider): Promise<ColonyInitialisedEventLog[]> => {
  const colonyInitialisedFilter = colonyClient.filters.ColonyInitialised(null, null);
  const colonyInitialisedRawLogs = await getLogs(colonyClient, colonyInitialisedFilter);
  const colonyInitialisedLogs = await Promise.all(colonyInitialisedRawLogs.map(async (event) => {
    const logTime = await getBlockTime(provider, event.blockHash ?? "");
    return {
      id: `ColonyInitialised-${event.blockHash}-${event.logIndex}`,
      colonyAddress: event.address,
      eventType: EventTypes.ColonyInitialised,
      logTime,
    };
  }));
  return colonyInitialisedLogs;
};

const getColonyRoleSetLogs = async (colonyClient: ColonyClientV4, provider: InfuraProvider): Promise<ColonyRoleSetEventLog[]> => {
  const colonyRoleSetFilter = colonyClient.filters.ColonyRoleSet(null, null, null, null);
  const colonyRoleSetRawLogs = await getLogs(colonyClient, colonyRoleSetFilter);
  const colonyRoleSetLogs = await Promise.all(colonyRoleSetRawLogs.map(async (event) => {
    const parsedLog = colonyClient.interface.parseLog(event);
    const { user, role } = parsedLog.values;
    const domainId = new BigNumber(parsedLog.values.domainId);
    const logTime = await getBlockTime(provider, event.blockHash ?? "");
    return {
      id: `ColonyRoleSet-${event.blockHash}-${event.logIndex}`,
      colonyAddress: event.address,
      eventType: EventTypes.ColonyRoleSet,
      role: ColonyRole[role],
      userAddress: user,
      domainId: domainId.toString(),
      logTime,
    };
  }));
  return colonyRoleSetLogs;
};

const getPayoutClaimedLogs = async (colonyClient: ColonyClientV4, provider: InfuraProvider): Promise<PayoutClaimedEventLog[]> => {
  const payoutClaimedFilter = colonyClient.filters.PayoutClaimed(null, null, null);
  const payoutClaimedRawLogs = await getLogs(colonyClient, payoutClaimedFilter);
  const payoutClaimedLogs = await Promise.all(payoutClaimedRawLogs.map(async (event) => {
    const parsedLog = colonyClient.interface.parseLog(event);
    const { token } = parsedLog.values;
    const amount = new BigNumber(parsedLog.values.amount).div(BIGNUM_POW18);
    const fundingPotId = new BigNumber(parsedLog.values.fundingPotId);
    const { associatedTypeId } = await colonyClient.getFundingPot(fundingPotId);
    const { recipient } = await colonyClient.getPayment(associatedTypeId);
    const logTime = await getBlockTime(provider, event.blockHash ?? "");
    return {
      id: `PayoutClaimed-${event.blockHash}-${event.logIndex}`,
      colonyAddress: event.address,
      eventType: EventTypes.PayoutClaimed,
      userAddress: recipient,
      amount: amount.toString(),
      token: TOKEN_MAP[token] ?? ` ${token}`,
      fundingPotId: fundingPotId.toString(),
      logTime,
    };
  }));
  return payoutClaimedLogs;
};

const getDomainAddedLogs = async (colonyClient: ColonyClientV4, provider: InfuraProvider): Promise<DomainAddedEventLog[]> => {
  const domainAddedFilter = colonyClient.filters.DomainAdded(null);
  const domainAddedRawLogs = await getLogs(colonyClient, domainAddedFilter);
  const domainAddedLogs = await Promise.all(domainAddedRawLogs.map(async (event) => {
    const parsedLog = colonyClient.interface.parseLog(event);
    const domainId = new BigNumber(parsedLog.values.domainId);
    const logTime = await getBlockTime(provider, event.blockHash ?? "");
    return {
      id: `DomainAdded-${event.blockHash}-${event.logIndex}`,
      colonyAddress: event.address,
      eventType: EventTypes.DomainAdded,
      domainId: domainId.toString(),
      logTime,
    };
  }));
  return domainAddedLogs;
};