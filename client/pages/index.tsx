import axios from "axios";

import buildClient from "../api/build-client";

function LandingPage({ currentUser }) {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT sign in</h1>
  );
}

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);

  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;
