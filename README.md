# Interview Scheduler

## Description

A responsive single-page scheduler built using React (with Hooks) and using an API with a WebSocket server for a realtime experience.
Storybook used to build and view React components in isolation.
Integration tests implemented using Jest. End-to-end testing implemented using Cypress.

To visit my deployed scheduler: https://distracted-euler-113c4b.netlify.com/

To set up locally, the back end API is needed and can be found here: https://github.com/jonny-ms/scheduler-api. Follow README instructions to set up database.

## Screenshots

!["Add an interview"](./public/images/add_interview.gif) 
!["Delete an interview"](./public/images/delete_interview.gif)
!["Responsive"](./public/images/responsive.gif)

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
