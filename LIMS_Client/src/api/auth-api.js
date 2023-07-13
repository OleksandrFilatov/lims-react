import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { createResourceId } from '../utils/create-resource-id';
import { sign, JWT_SECRET, JWT_EXPIRES_IN } from '../utils/jwt';
import { wait } from '../utils/wait';
// import { ServerUri } from '../config';
import axiosFetch from '../utils/axiosFetch';

const users = [
  {
    id: '5e86809283e28b96d2d38537',
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
    email: 'demo@devias.io',
    name: 'Anika Visser',
    password: 'Password123!',
    plan: 'Premium'
  }
];

class AuthApi {
  async login(username, password) {
    try {
      const res = await axiosFetch.post('/login_user', {
        userName: username,
        password: password
      });
      return res.data;
    } catch (err) {
      return err.response.data;
      // this.setState({ errors: err.response.data })
    }
  }

  async register({ email, name, password }) {
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        // Check if a user already exists
        let user = users.find((_user) => _user.email === email);

        if (user) {
          reject(new Error('User already exists'));
          return;
        }

        user = {
          id: createResourceId(),
          avatar: undefined,
          email,
          name,
          password,
          plan: 'Standard'
        };

        users.push(user);

        const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        resolve(accessToken);
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  me(accessToken) {
    return new Promise((resolve, reject) => {
      try {
        const user = jwt_decode(accessToken);

        if (!user) {
          reject(new Error('Invalid authorization token'));
          return;
        }

        resolve({
          id: user.id,
          userType: user.userType,
          labInput: user.labInput,
          labAnalysis: user.labAnalysis,
          labAdmin: user.labAdmin,
          stockUser: user.stockUser,
          stockAdmin: user.stockAdmin,
          hsImport: user.hsImport,
          hsExport: user.hsExport,
          hsAdmin: user.hsAdmin,
          geologyImport: user.geologyImport,
          geologyExport: user.geologyExport,
          geologyAdmin: user.geologyAdmin,
          remark: user.remark,
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
