import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import {
  Box,
  Button,
  DateInput,
  Field,
  Flex,
  Heading,
  Input,
  Link,
  Menu,
  MenuContent,
  MenuTrigger,
  Text,
} from '@optiaxiom/react';
import { FaUserPlus } from 'react-icons/fa';

import Config from '../../config';

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

    const URL = Config.SERVER_URL + '/users';
    axios
      .post(URL, {
        user_name: userName,
        password,
        full_name: fullName,
        email,
        phone,
        dob,
        gender,
        blood_group: bloodGroup,
      })
      .then(() => navigate('/sign-in'));
  };

  return (
    <Flex alignItems="center" justifyContent="center" bg="bg.page" p="24" style={{ minHeight: '85vh' }}>
      <Box
        bg="bg.default"
        rounded="xl"
        border="1"
        borderColor="border.secondary"
        shadow="sm"
        p="32"
        style={{ width: '100%', maxWidth: '560px' }}
      >
        <Flex flexDirection="column" gap="24">
          <Flex flexDirection="column" gap="8">
            <Flex alignItems="center" gap="8" color="fg.accent.strong">
              <FaUserPlus />
              <Text
                fontSize="xs"
                fontWeight="600"
                textTransform="uppercase"
                color="fg.accent.strong"
                style={{ letterSpacing: '1px' }}
              >
                Healthcare Portal
              </Text>
            </Flex>
            <Heading level="2" color="fg.default">
              Create your account
            </Heading>
            <Text fontSize="sm" color="fg.tertiary">
              A few details so providers can find you.
            </Text>
          </Flex>

          <form onSubmit={handleSignUp}>
            <Flex flexDirection="column" gap="16">
              <Flex flexDirection="row" gap="16" style={{ flexWrap: 'wrap' }}>
                <Field label="Username" style={{ flex: '1 1 200px' }}>
                  <Input
                    placeholder="yourusername"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Password" style={{ flex: '1 1 200px' }}>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>
              </Flex>

              <Field label="Full name">
                <Input placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </Field>

              <Flex flexDirection="row" gap="16" style={{ flexWrap: 'wrap' }}>
                <Field label="Email" style={{ flex: '1 1 200px' }}>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field label="Phone" style={{ flex: '1 1 200px' }}>
                  <Input
                    placeholder="+1 555 123 4567"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Field>
              </Flex>

              <Flex flexDirection="row" gap="16" style={{ flexWrap: 'wrap' }}>
                <Field label="Date of birth" style={{ flex: '1 1 200px' }}>
                  <DateInput value={dob} onValueChange={setDob} required />
                </Field>
                <Field label="Gender" style={{ flex: '1 1 120px' }}>
                  <Menu
                    options={GENDER_OPTIONS.map((option, index) => ({
                      label: option,
                      execute: () => setGender(index + 1),
                    }))}
                  >
                    <MenuTrigger>{gender ? GENDER_OPTIONS[gender - 1] : 'Select'}</MenuTrigger>
                    <MenuContent />
                  </Menu>
                </Field>
                <Field label="Blood group" style={{ flex: '1 1 120px' }}>
                  <Menu
                    options={BLOOD_GROUP_OPTIONS.map((option, index) => ({
                      label: option,
                      execute: () => setBloodGroup(index + 1),
                    }))}
                  >
                    <MenuTrigger>{bloodGroup ? BLOOD_GROUP_OPTIONS[bloodGroup - 1] : 'Select'}</MenuTrigger>
                    <MenuContent />
                  </Menu>
                </Field>
              </Flex>

              <Button appearance="primary" type="submit" w="full" justifyContent="center">
                Create account
              </Button>
            </Flex>
          </form>

          <Flex flexDirection="row" alignItems="center" justifyContent="center" gap="4">
            <Text fontSize="sm" color="fg.tertiary">
              Already have an account?
            </Text>
            <Link asChild>
              <RouterLink to="/sign-in">Sign in</RouterLink>
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SignUp;
