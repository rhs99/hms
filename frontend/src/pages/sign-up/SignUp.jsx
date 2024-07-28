import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Config from '../../config';

import './_index.scss';

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState(null);
  const [bg, setBg] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    const URL = Config.SERVER_URL + '/users/sign-up';
    const data = {
      user_name: userName,
      password: password,
      full_name: fullName,
      email,
      phone,
      dob,
      gender: parseInt(gender),
      blood_group: parseInt(bg),
    };

    axios.post(URL, data).then(({ data }) => {
      navigate('/sign-in');
    });
  };

  return (
    <div className="signUp">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input placeholder="Enter user name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
        <input placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input placeholder="Enter full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Enter phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input placeholder="Enter date of birth" value={dob} onChange={(e) => setDob(e.target.value)} required />
        <input placeholder="Enter gender" value={gender} onChange={(e) => setGender(e.target.value)} required />
        <input placeholder="Enter blood group" value={bg} onChange={(e) => setBg(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SignUp;
