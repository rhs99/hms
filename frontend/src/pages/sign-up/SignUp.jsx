import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button, Box, Input, Field, Text, DateInput } from '@optiaxiom/react';
import { Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';
import { FaUserPlus } from 'react-icons/fa';

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

    axios.post(URL, data).then(() => {
      navigate('/sign-in');
    });
  };

  return (
    <Box className="signUp">
      <Box className="signUp-header">
        <Box className="signUp-icon">
          <FaUserPlus size={48} />
        </Box>
        <Text className="signUp-title">Create Account</Text>
        <Text className="signUp-subtitle">Join our healthcare management system</Text>
      </Box>
      <form onSubmit={handleSignUp} className="signUp-form">
        <Box className="form-row">
          <Field label="User Name">
            <Input
              placeholder="Choose a username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </Field>
          <Field label="Password">
            <Input
              placeholder="Create a password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
        </Box>
        <Field label="Full Name">
          <Input
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </Field>
        <Box className="form-row">
          <Field label="Email">
            <Input
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Phone">
            <Input
              placeholder="Phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Field>
        </Box>
        <Box className="form-row">
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
        </Box>
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
        <Button appearance="primary" type="submit" className="signUp-submit-button">
          Create Account
        </Button>
      </form>
      <Box className="signUp-footer">
        <Text>
          Already have an account?{' '}
          <Link to="/sign-in" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)', textDecoration: 'none' }}>
            Sign In
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default SignUp;
