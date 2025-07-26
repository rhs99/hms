import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Card, CardFooter, CardHeader, CardImage, CardPreview, Text, Flex, Avatar, Badge } from '@optiaxiom/react';

import Config from '../../config';

const Profile = () => {
  const { userName } = useParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch profile data based on userName
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${Config.SERVER_URL}/users?user_name=${userName}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    void fetchProfileData();
  }, [userName]);

  const getBloodGroup = (bloodGroup) => {
    switch (bloodGroup) {
      case 'A_NEG':
        return 'A-';
      case 'A_POS':
        return 'A+';
      case 'B_NEG':
        return 'B-';
      case 'B_POS':
        return 'B+';
      case 'O_NEG':
        return 'O-';
      case 'O_POS':
        return 'O+';
      case 'AB_NEG':
        return 'AB-';
      case 'AB_POS':
        return 'AB+';
      default:
        return 'Unknown';
    }
  };

  if (!profileData) {
    return (
      <Flex justifyContent="center" alignItems="center" style={{ minHeight: '60vh' }}>
        <Text fontSize="xl" color="fg.tertiary">
          Loading profile...
        </Text>
      </Flex>
    );
  }

  return (
    <Flex justifyContent="center" alignItems="center" style={{ background: '#f7f9fa' }}>
      <Card style={{ width: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderRadius: 16, background: '#fff' }}>
        <CardPreview
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0 16px 0' }}
        >
          <CardImage asChild>
            <Avatar size="3xl" color="fg.avatar.purple" name={profileData.full_name || profileData.user_name} />
          </CardImage>
        </CardPreview>
        <CardHeader style={{ padding: '0 32px' }}>
          <Flex flexDirection="column" gap="8">
            <Flex flexDirection="column" gap="4" alignItems="center">
              <Badge intent="information">{profileData.user_name}</Badge>
              <Text fontSize="xl" fontWeight="700" style={{ marginBottom: 4 }}>
                {profileData.full_name}
              </Text>
            </Flex>
            <Flex flexDirection="column" gap="8">
              <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text color="fg.tertiary">Gender</Text>
                <Badge intent="success">{profileData.gender}</Badge>
              </Flex>
              <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text color="fg.tertiary">Blood Group</Text>
                <Badge intent="danger">{getBloodGroup(profileData.blood_group)}</Badge>
              </Flex>
              <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text color="fg.tertiary">Date of Birth</Text>
                <Text fontWeight="500">{profileData.dob}</Text>
              </Flex>
              <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text color="fg.tertiary">Email</Text>
                <Text fontWeight="500">{profileData.email}</Text>
              </Flex>
              <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                <Text color="fg.tertiary">Phone</Text>
                <Text fontWeight="500">{profileData.phone}</Text>
              </Flex>
            </Flex>
          </Flex>
        </CardHeader>
        <CardFooter style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
          <Text fontSize="sm" color="fg.tertiary">
            Profile information is public and can be viewed by others.
          </Text>
        </CardFooter>
      </Card>
    </Flex>
  );
};

export default Profile;
