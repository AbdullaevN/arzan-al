import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
//  import { RootState, AppDispatch } from '../store';
import { API } from '../constants/api';

const Register: React.FC = () => {
  // const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({ username: '', password: '' });
  // const { status, error } = useSelector((state: RootState) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    // dispatch(registerUser(formData));
    try{
      const res = await API.post('/api/auth/registration',{
        clientId:formData.username,
        password:formData.password,
        phone:'0500737080'
      })
      console.log(111,res);
      
    }catch(e){
      console.error(e)
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Register</button>
      {/* {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>} */}
    </form>
  );
};

export default Register;
