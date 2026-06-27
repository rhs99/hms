import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaCalendar, FaTint, FaVenusMars, FaUser } from 'react-icons/fa';

import { Avatar, Badge, Box, Card, CardFooter, CardHeader, CardPreview, Flex, Heading, Text } from '@optiaxiom/react';

import Config from '../../config';
import { AlertBanner } from '../../component/alerts';
import { useAlertState } from '../../component/useAlertState';

const BLOOD_GROUP_LABELS = {
  A_POS: 'A+',
  A_NEG: 'A-',
  B_POS: 'B+',
  B_NEG: 'B-',
  O_POS: 'O+',
  O_NEG: 'O-',
  AB_POS: 'AB+',
  AB_NEG: 'AB-',
};

const formatBloodGroup = (bg) => BLOOD_GROUP_LABELS[bg] || 'Unknown';

const DetailRow = ({ icon, label, children }) => (
  <Flex flexDirection="row" alignItems="center" justifyContent="space-between" p="12" rounded="md" gap="16">
    <Flex flexDirection="row" alignItems="center" gap="8" color="fg.tertiary">
      {icon}
      <Text fontSize="sm" fontWeight="500" color="fg.tertiary">
        {label}
      </Text>
    </Flex>
    {children}
  </Flex>
);

const Profile = () => {
  const { userName } = useParams();
  const [profileData, setProfileData] = useState(null);
  const { alert, show, dismiss } = useAlertState();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${Config.SERVER_URL}/users?username=${userName}`);
        setProfileData(response.data);
      } catch {
        show('danger', 'Failed to load profile.');
      }
    };

    void fetchProfileData();
  }, [userName, show]);

  if (!profileData) {
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="16"
        bg="bg.page"
        p="24"
        style={{ minHeight: '85vh' }}
      >
        {alert ? (
          <Box style={{ width: '100%', maxWidth: '520px' }}>
            <AlertBanner alert={alert} onDismiss={dismiss} />
          </Box>
        ) : (
          <Text fontSize="lg" color="fg.tertiary">
            Loading profile...
          </Text>
        )}
      </Flex>
    );
  }

  const displayName = profileData.full_name || profileData.user_name;

  return (
    <Flex alignItems="center" justifyContent="center" bg="bg.page" p="24" style={{ minHeight: '85vh' }}>
      <Card style={{ width: '100%', maxWidth: '520px' }}>
        <CardPreview bg="bg.accent.subtle" p="32">
          <Flex flexDirection="column" alignItems="center" gap="12">
            <Avatar size="3xl" color="fg.avatar.purple" name={displayName} />
            <Heading level="3" color="fg.default">
              {displayName}
            </Heading>
            {profileData.user_name && (
              <Badge intent="information">
                <Flex alignItems="center" gap="4">
                  <FaUser />@{profileData.user_name}
                </Flex>
              </Badge>
            )}
          </Flex>
        </CardPreview>

        <CardHeader>
          <Flex flexDirection="column" gap="4">
            <DetailRow icon={<FaVenusMars />} label="Gender">
              <Badge intent="success">{profileData.gender || 'N/A'}</Badge>
            </DetailRow>
            <DetailRow icon={<FaTint />} label="Blood Group">
              <Badge intent="danger">{formatBloodGroup(profileData.blood_group)}</Badge>
            </DetailRow>
            <DetailRow icon={<FaCalendar />} label="Date of Birth">
              <Text fontSize="sm" fontWeight="600" color="fg.default">
                {profileData.dob || 'N/A'}
              </Text>
            </DetailRow>
            <DetailRow icon={<FaEnvelope />} label="Email">
              <Text fontSize="sm" fontWeight="600" color="fg.default">
                {profileData.email || 'N/A'}
              </Text>
            </DetailRow>
            <DetailRow icon={<FaPhone />} label="Phone">
              <Text fontSize="sm" fontWeight="600" color="fg.default">
                {profileData.phone || 'N/A'}
              </Text>
            </DetailRow>
          </Flex>
        </CardHeader>

        <CardFooter>
          <Box bg="bg.secondary" p="12" rounded="md" style={{ width: '100%', textAlign: 'center' }}>
            <Text fontSize="xs" color="fg.tertiary" style={{ fontStyle: 'italic' }}>
              Profile information is public and can be viewed by others.
            </Text>
          </Box>
        </CardFooter>
      </Card>
    </Flex>
  );
};

export default Profile;
