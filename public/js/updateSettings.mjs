/* eslint-disable */
import { showAlert } from './alerts.mjs';
//type may be 'data' or 'password'
export const updateSetting = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} uploaded successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
