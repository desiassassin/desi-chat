import Cookies from "universal-cookie";
import SessionExpired from "../components/misc/SessionExpired";
const cookies = new Cookies();

export const fetchToken = (tokenName, expireSession = true) => {
     const token = cookies.get(tokenName);
     if (!token && expireSession) SessionExpired.open();
     else if (!token) return false;
     return token;
};

export default cookies;
