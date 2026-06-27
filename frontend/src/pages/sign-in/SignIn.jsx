import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Field, Flex, Heading, Input, Link, Text } from '@optiaxiom/react';
import { FaUserMd } from 'react-icons/fa';

import AuthContext from '../../store/auth';
import Config from '../../config';

const SignIn = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const URL = Config.SERVER_URL + '/sessions';
    axios.post(URL, { user_name: userName, password }).then(({ data }) => {
      authCtx.login({
        userName: data.user_name,
        userId: data.id,
        isAdmin: data.is_admin,
      });
      navigate('/');
    });
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
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <Flex flexDirection="column" gap="24">
          <Flex flexDirection="column" gap="8">
            <Flex alignItems="center" gap="8" color="fg.accent.strong">
              <FaUserMd />
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
              Sign in
            </Heading>
            <Text fontSize="sm" color="fg.tertiary">
              Enter your credentials to continue.
            </Text>
          </Flex>

          <form onSubmit={handleSignIn}>
            <Flex flexDirection="column" gap="16">
              <Field label="Username">
                <Input
                  placeholder="yourusername"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </Field>
              <Field label="Password">
                <Input
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Button appearance="primary" type="submit" w="full" justifyContent="center">
                Sign in
              </Button>
            </Flex>
          </form>

          <Flex flexDirection="row" alignItems="center" justifyContent="center" gap="4">
            <Text fontSize="sm" color="fg.tertiary">
              New here?
            </Text>
            <Link asChild>
              <RouterLink to="/sign-up">Create an account</RouterLink>
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SignIn;
