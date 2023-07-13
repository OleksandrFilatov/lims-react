import axiosFetch from './axiosFetch';

const setAuthToken = token => {
  if (token) {
    // Apply to every request
    axiosFetch.defaults.headers.common['Authorization'] = token;
  } else {
    // Delete auth header
    delete axiosFetch.defaults.headers.common['Authorization'];
  }
};


export default setAuthToken;
