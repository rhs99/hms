import { useState } from 'react';
import axios from 'axios';
import { Button, Flex, SearchInput, Text, Badge } from '@optiaxiom/react';

import Config from '../config';

const DoctorSearch = ({ onDoctorSelect, validate }) => {
  const [registrationNo, setRegistrationNo] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const handleSearch = () => {
    if (!registrationNo.trim()) return;

    setDoctor(null);
    setSearchError(null);

    const url = Config.SERVER_URL + `/doctors?registration_no=${registrationNo.trim()}`;
    axios
      .get(url)
      .then((response) => {
        if (!response.data) {
          setSearchError('No doctor found with this registration number.');
          return;
        }

        if (validate) {
          const validationError = validate(response.data);
          if (validationError) {
            setSearchError(validationError);
            return;
          }
        }

        setDoctor(response.data);
        onDoctorSelect(response.data);
      })
      .catch(() => {
        setSearchError('Failed to load doctor. Please try again.');
      });
  };

  return (
    <Flex flexDirection="column" gap="8">
      <Flex flexDirection="row" gap="8">
        <SearchInput
          value={registrationNo}
          onChange={(e) => setRegistrationNo(e.target.value)}
          placeholder="Enter Registration No"
          style={{ flex: 1 }}
        />
        <Button onClick={handleSearch}>Search</Button>
      </Flex>
      {searchError && (
        <Text color="fg.error" fontSize="sm">
          {searchError}
        </Text>
      )}
      {doctor && (
        <Flex flexDirection="column" gap="4">
          <Badge w="fit" intent="success">
            Found
          </Badge>
          <Text>{doctor.full_name}</Text>
          <Text>{doctor.degree}</Text>
          <Text>{doctor.experience}</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default DoctorSearch;
