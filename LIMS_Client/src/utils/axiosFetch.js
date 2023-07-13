import axios from "axios";
import { ServerUri } from "../config";
import { getUser, setAuthenticated } from "../slices/auth";
import { store } from "../store";

const axiosFetch = axios.create({
    baseURL: ServerUri,
    headers: {
        "Content-Type": "application/json",
    },
});

// not authorized? delete token
axiosFetch.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response.status === 401) {
            store.dispatch(setAuthenticated(false));
            store.dispatch(getUser({}));
            localStorage.removeItem('accessToken');
            window.location.href = '/authentication/login';
        }
        return Promise.reject(err);
    }
);

export default axiosFetch;
