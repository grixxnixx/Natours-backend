/* eslint-disable */
import Axios from 'axios';
import { showAlert } from './alerts';

export const updateSetting = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    const res = await Axios({
      method: 'PATCH',
      url,
      data
    });
    // console.log(updateUser);

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} update successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
