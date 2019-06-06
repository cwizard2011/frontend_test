# TURING-FRONTEND (eStore)

The project is boot-strapped with Facebook's create-react-app.<br />

## Quick start

1. Run `yarn` to install dependencies<br />
2. Run `yarn build` to create production ready build<br />
3. Run `yarn start` to start the development server <br />
   _At this point you can see the app at `http://localhost:3000`._<br />
4. Run `yarn test` to run all test suites<br />

## Tech Stack

1. React<br />
2. Redux<br />
3. React-Router<br />
4. Redux-Saga<br />
5. Sass<br />

## Code Structure

All code is available in `src` folder.<br />
`src/components` includes presentational components for each route or page.<br />
`src/containers` includes logical containers; managing state, actions and apis for each route or page.<br />
`src/styles` includes custom classes for different components. `container.scss` included generic styling classes.<br />
`src/index.js` is the root entry point for the application. It wraps the app inside router, stripe and redux providers.<br />
`src/reducer` combines all reducers and provides to the store.<br />
`src/routes` provides and renders routes and their corresponding components.<br />
`src/saga` combines and forks all sagas of the application and provides to the store.<br />
`src/service` provides a general functionality for CRUD operations and uses axios for api calls.<br />
`src/store` provides a stores with history, redux and saga middlewares.<br />
`src/utils` includes helper functions used throughout the app for managing local storage, form validations, cart management and calculations, etc.<br />
`src/__tests__` folder includes one file containing all tests.<br />

`src/containers/{app}/constants` includes action identifiers.<br />
`src/containers/{app}/actions` includes actions which are intercepted by reducers and sagas.<br />
`src/containers/{app}/reducer` includes reducers which intercept the action and manage global state accordingly.<br />
`src/containers/{app}/sagas` includes sagas which intercept the action and call the relevant api.<br />
`src/containers/{app}/services` includes apis which are used by sagas.<br />
`src/containers/{app}/selectors` use saga side effects to select state directly from the store.<br />
`src/containers/{app}/transformers` includes functions to map the data in required shape.<br />
`src/containers/{app}/index` maps the state and actions and provides them to the relevant component as props.<br />

Instead of calling cart apis at each interaction I manage and store the cart locally and update it at the backend at the time of creating an order. While creating an order I check if a cart id is available locally. If it is then I update it, if not then I request a new cart id and map it to the locally managed cart. Cart's state is persisted as long as an order is created. After an order with a cart id is created, the cart is removed from storage and a new cart is created for the next batch of products.<br />

Using the above approach I have made the application much smoother and responsive because now a user would not have to wait for the server to send back the updated cart after each interaction.<br />

User's jwt token is also persisted in local storage for the expiry time limit during which a user is automatically logged in.<br />

Locally stored cart is independent of user. It could have been linked to the current user but it is a decision I made on my own. Reason being I cannot store the cart id with user on the backend (no api support) and maintaining a cart for 24 hrs or as long as the current user is persisted seems redundant. In each new session cart's state is updated to the one used in the last session independent of user.<br />

## Important

App is deployed on heroku.<br />
Add heroku app domain in Facebook for developers domains to enable login.<br />
App sleeps after 30 mins of inactivity on heroku and a delay is encountered when deployed app restarts. Inorder to remove this delay I've added a function which pings my app every 5 mins to prevent it from sleeping.<br />
**The above method no longer works on heroku. They have modified their dyno settings. Please restart the application if it fails to start due to startup delay.**

Deployed app link: https://turing-estore.herokuapp.com

## Issues Found So Far

1) Search from any page:
- Expected: Search from any page takes me back to products home page with filtered results<br /
- Actual: Search takes back to home page but filtered list is replaced with new list dur to api call on component mount<br />
- fix: No need to make api call if search query is entered, also handle resetting search query state<br />

2) Pagination not resetting:
- Expected: Pagination resets on changing parameters to get products list<br />
- Actual: Pagination does not reset due to which if a user filters results on category then stored pagination is also applied and may not bring any results<br />
- fix: Reset pagination on any product list call other than through pagination<br />

3) User Orders screen not showing empty data card when no previous orders are found
- Expected: Screen loads and shows no data card<br />
- Actual: Screen keeps on loading<br />
- fix: Update user orders state if api return successfully but with no data
