# Colony Event List
This project is to demostrate how to use [colony-js](https://github.com/JoinColony/colonyJS) to query the events and logs come from [Colony Network](https://github.com/JoinColony/colonyNetwork) smart contracts deployed on the Ethereum Mainnet.

### Tech Stack
---
#### CRA with Redux+Typescript
It's created with [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) CLI:
```
npx create-react-app react-demo-app --template redux-typescript
```
#### CSS Modules with SCSS
CRA comes with [CSS Modules](https://github.com/css-modules/css-modules) support, and we would like to use SCSS here.
```
npm install --save-dev node-sass
```
#### ColonyJS and ether.js
As mentioned we are going to use [ColonyJS](https://github.com/JoinColony/colonyJS) to connect Colony Network. We need to install [ether.js](https://github.com/ethers-io/ethers.js/) as well.
```
npm install --save @colony/colony-js@2
npm install --save ethers@4
```
#### react-blockies
We would like to use an avatar library that can generated avatar by given an address, and we use [react-blockies](https://www.npmjs.com/package/react-blockies) here:
```
npm install --save react-blockies
```
#### dayjs
We would like to format the date. While [momentjs](https://momentjs.com/) is promising, it's now a legacy project in maintenance mode. And we are going to install its alternative [dayjs](https://day.js.org/) as suggested.
```
npm install --save dayjs
```
### Dealing with Data
---
We refer to [here](https://github.com/JoinColony/coding-challenge-events-list#fetching-events-data) on how to use [ColonyJS](https://github.com/JoinColony/colonyJS) to query the raw data and how to process them.

Detail implementation can be refered in `src/features/event/api.ts`.
### Data Types
---
There are plenty of types defined to provide a human readable shapes of the converted data after processed from the raw data. Most of them are located at `src/features/event/slice.ts`, e.g.:
- `ColonyInitialisedEventLog`
- `ColonyRoleSetEventLog`
- `PayoutClaimedEventLog`
- `DomainAddedEventLog`

All these are the event log types for different event types. And `EventLog` is a superset of all of them.
### React Components
---
The data is prepared, processed and ready in Redux store, and the data types are ready. And we need to render the data on UI.
#### `src/App.tsx`
The main container app. When it renders at the first time, event logs data will be queried, processed and then put in the Redux store. When Redux store data is available, the data will be passed into `EventList` component.
#### `src/components/EventList`
The react component that to render the event log list. The spec can be referred to [here](https://github.com/JoinColony/coding-challenge-events-list#design).
### How to run
---
To install:
```
npm install
```
To run in development mode locally (since it needs to connect to the server API that doesnt support CORS, it doesnt work on Firefox):
```
npm start
```
To build in production mode:
```
npm run build
```
To build for [github page](https://shawtim.github.io/colony-event-list/) (the build will be available on github page, but again the server API doesnt support CORS so it's not expected to work on github page):
```
npm run build:github
```
To run test (unfortunately no tests is yet available - but the framework is here):
```
npm test
```
To run test coverage report:
```
npm test -- --coverage
```
### Improvement
---
The project is expected to be a 4 hours project so I dont expect it will be perfect. We have a list of future improvements here:
- Unit test with high test coverage
- Pagination
- Loading components (e.g. [react-content-loader](https://github.com/danilowoz/react-content-loader))
