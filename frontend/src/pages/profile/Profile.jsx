import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaPhone, FaCalendar, FaTint, FaVenusMars } from 'react-icons/fa';

import { Card, CardFooter, CardHeader, CardImage, CardPreview, Text, Box, Avatar, Badge } from '@optiaxiom/react';

import Config from '../../config';

import './_index.scss';

const Profile = () => {
  const { userName } = useParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
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
      <Box className="profile-loading">
        <Text fontSize="xl" color="fg.tertiary">
          Loading profile...
        </Text>
      </Box>
    );
  }

  return (
    <Box className="profile">
      <Card className="profile-card">
        <CardPreview className="profile-preview">
          <CardImage asChild>
            <Avatar size="3xl" color="fg.avatar.purple" name={profileData.full_name || profileData.user_name} />
          </CardImage>
        </CardPreview>
        <CardHeader className="profile-header">
          <Box className="profile-user-info">
            <Text className="profile-name">{profileData.full_name}</Text>
          </Box>
          <Box className="profile-details">
            <Box className="profile-detail-row">
              <Text className="profile-label">
                <FaVenusMars style={{ display: 'inline', marginRight: '8px' }} />
                Gender
              </Text>
              <Badge intent="success">{profileData.gender}</Badge>
            </Box>
            <Box className="profile-detail-row">
              <Text className="profile-label">
                <FaTint style={{ display: 'inline', marginRight: '8px' }} />
                Blood Group
              </Text>
              <Badge intent="danger">{getBloodGroup(profileData.blood_group)}</Badge>
            </Box>
            <Box className="profile-detail-row">
              <Text className="profile-label">
                <FaCalendar style={{ display: 'inline', marginRight: '8px' }} />
                Date of Birth
              </Text>
              <Text className="profile-value">{profileData.dob}</Text>
            </Box>
            <Box className="profile-detail-row">
              <Text className="profile-label">
                <FaEnvelope style={{ display: 'inline', marginRight: '8px' }} />
                Email
              </Text>
              <Text className="profile-value">{profileData.email}</Text>
            </Box>
            <Box className="profile-detail-row">
              <Text className="profile-label">
                <FaPhone style={{ display: 'inline', marginRight: '8px' }} />
                Phone
              </Text>
              <Text className="profile-value">{profileData.phone}</Text>
            </Box>
          </Box>
        </CardHeader>
        <CardFooter className="profile-footer">
          <Text className="profile-footer-text">Profile information is public and can be viewed by others.</Text>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default Profile;
