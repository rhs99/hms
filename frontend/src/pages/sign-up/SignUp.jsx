import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, Box, Input, Field, Text, Flex, DateInput } from '@optiaxiom/react';
import { Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';

import Config from '../../config';

import './_index.scss';

const GENDER_OPTIONS = ['Male', 'Female'];
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState(null);
  const [bloodGroup, setBloodGroup] = useState(null);

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
      gender,
      blood_group: bloodGroup,
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
          <DateInput value={dob} onValueChange={setDob} required />
        </Field>
        <Field label="Gender">
          <Menu
            options={GENDER_OPTIONS.map((option, index) => ({
              label: option,
              execute: () => setGender(index + 1),
            }))}
          >
            <MenuTrigger>{gender ? GENDER_OPTIONS[gender - 1] : 'Select gender'}</MenuTrigger>
            <MenuContent />
          </Menu>
        </Field>
        <Field label="Blood Group">
          <Menu
            options={BLOOD_GROUP_OPTIONS.map((option, index) => ({
              label: option,
              execute: () => setBloodGroup(index + 1),
            }))}
          >
            <MenuTrigger>{bloodGroup ? BLOOD_GROUP_OPTIONS[bloodGroup - 1] : 'Select blood group'}</MenuTrigger>
            <MenuContent />
          </Menu>
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
