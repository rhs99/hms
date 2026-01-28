import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Box, Card, CardHeader, CardPreview, CardImage, Text, Heading } from '@optiaxiom/react';
import { FaPhone } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { CiLocationOn } from 'react-icons/ci';

import { SearchInput } from '@optiaxiom/react';
import Config from '../../config';

const HospitalBuildingImages = [
  'https://images.unsplash.com/photo-1626315869436-d6781ba69d6e?w=224',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=224',
  'https://images.unsplash.com/photo-1533042789716-e9a9c97cf4ee?w=224',
  'https://images.unsplash.com/photo-1586773860383-dab5f3bc1bcc?w=224',
];

const Homepage = () => {
  const [hospitalBranches, setHospitalBranches] = useState([]);
  const [matchedHospitalBranches, setMatchedHospitalBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hospitals and branches separately
        const hospitalsResponse = await axios.get(`${Config.SERVER_URL}/hospitals`);
        const branchesResponse = await axios.get(`${Config.SERVER_URL}/branches`);

        const hospitals = hospitalsResponse.data;
        const branches = branchesResponse.data;

        // Combine hospital and branch data
        const combined = branches.map((branch) => {
          const hospital = hospitals.find((h) => h.id === branch.hospital_id);
          return {
            hospitalId: hospital?.id,
            hospitalName: hospital?.name || 'Unknown Hospital',
            branchId: branch.id,
            address: branch.address,
            phone: branch.phone,
            email: branch.email,
          };
        });

        setHospitalBranches(combined);
        setMatchedHospitalBranches(combined);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setMatchedHospitalBranches(hospitalBranches);
    } else {
      const matched = hospitalBranches.filter(
        (item) =>
          item.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMatchedHospitalBranches(matched);
    }
  }, [searchTerm, hospitalBranches]);

  return (
    <Flex
      flexDirection="column"
      gap="16"
      style={{ maxHeight: '80vh', overflowY: 'auto', padding: 'var(--spacing-lg)' }}
    >
      <Heading level="3">Hospitals</Heading>
      <Flex flexDirection="row" justifyContent="flex-end">
        <SearchInput placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} w="224" />
      </Flex>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 'var(--spacing-lg)',
        }}
      >
        {matchedHospitalBranches.map((item, index) => (
          <Card
            key={`${item.hospitalName}-${item.branchId}`}
            maxW="xs"
            onClick={() => navigate(`/branches/${item.branchId}`)}
            style={{
              cursor: 'pointer',
              transition: 'transform var(--transition-base)',
              boxShadow: 'var(--shadow-md)',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <CardPreview>
              <CardImage asChild>
                <img
                  src={HospitalBuildingImages[index % 4]}
                  alt="Hospital Building"
                  style={{
                    transition: 'transform 0.3s',
                  }}
                />
              </CardImage>
            </CardPreview>
            <CardHeader>
              <Flex flexDirection="column" gap="8">
                <Text fontSize="lg" fontWeight="700">
                  {item.hospitalName}
                </Text>
                <Flex flexDirection="row" gap="8" alignItems="center">
                  <CiLocationOn /> <Text>{item.address}</Text>
                </Flex>
                <Flex flexDirection="row" gap="8" alignItems="center">
                  <FaPhone /> <Text>{item.phone}</Text>
                </Flex>
                <Flex flexDirection="row" gap="8" alignItems="center">
                  <MdOutlineEmail /> <Text fontSize="sm">{item.email}</Text>
                </Flex>
              </Flex>
            </CardHeader>
          </Card>
        ))}
      </Box>
    </Flex>
  );
};

export default Homepage;
