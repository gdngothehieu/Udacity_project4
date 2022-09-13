// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
// API Gateway ID
//Done
// had to get new node modules folder for typescript error. knowldge center answer juan answered for me.
//Only file changed on frontend
const apiId = "m87yshtzh7";
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`;

export const authConfig = {
  domain: "dev-p8g3a2x0.us.auth0.com", // Auth0 domain
  clientId: "6yIgm4yTDiz1IbIDIGLQfPV7FeejUFoN", // Auth0 client id
  callbackUrl: "http://localhost:3000/callback",
};
