import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, Box, Input, Field, Text, Flex, DateInput } from '@optiaxiom/react';

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
    <Box className="signUp">
      <Text className="signUp-title">Sign Up</Text>
      <form onSubmit={handleSignUp} className="signUp-form">
        <Field label="User Name">
          <Input
            placeholder="Enter user name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <Input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Field label="Full Name">
          <Input
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </Field>
        <Field label="Email">
          <Input placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Field>
        <Field label="Phone">
          <Input placeholder="Enter phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </Field>
        <Field label="Date of Birth">
          <DateInput value={dob} onChange={setDob} required />
        </Field>
        <Field label="Gender">
          <Input placeholder="Enter gender" value={gender} onChange={(e) => setGender(e.target.value)} required />
        </Field>
        <Field label="Blood Group">
          <Input placeholder="Enter blood group" value={bg} onChange={(e) => setBg(e.target.value)} required />
        </Field>
        <Flex flexDirection="row" justifyContent="flex-end">
          <Button appearance="primary" type="submit">
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default SignUp;
