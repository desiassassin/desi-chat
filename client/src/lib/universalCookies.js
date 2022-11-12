import Cookies from "universal-cookie";
import SessionExpired from "../components/misc/SessionExpired";
const cookies = new Cookies();

/**
 * Fetches and returns the access token stored in the cookie
 * @param {String} tokenName name of the cookie containing the access token
 * @param {Boolean} expireSession default True. Opens the session expired modal and redirects the user back to the login screen.
 * @returns Token or Null
 */
export const fetchToken = (tokenName, expireSession = true) => {
     const token = cookies.get(tokenName);
     if (!token && expireSession) SessionExpired.open();
     else if (!token) return null;
     return token;
};

export default cookies;
