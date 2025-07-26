import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Box, Text, Menu, MenuContent, MenuTrigger, Badge } from '@optiaxiom/react';
import Config from '../../config';
import { Card, CardHeader, CardImage, CardPreview } from '@optiaxiom/react';

import { FaUserDoctor } from 'react-icons/fa6';

const Branch = () => {
  const [depts, setDepts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);

  const { branchId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/branch-depts?branch_id=${branchId}`;
    axios.get(url).then(({ data }) => {
      setDepts(data);
    });
  }, [branchId]);

  useEffect(() => {
    if (!selectedDeptId) return;
    const url = Config.SERVER_URL + `/branch-depts/doctors?branch_id=${branchId}&dept_id=${selectedDeptId}`;
    axios.get(url).then(({ data }) => {
      setDoctors(data);
    });
  }, [selectedDeptId, branchId]);

  const getDeptName = (deptId) => {
    const dept = depts.find((d) => d.id === deptId);
    return dept ? dept.name : null;
  };

  const departmentOptions = useMemo(
    () =>
      depts.map((dept) => ({
        label: dept.name,
        execute: () => setSelectedDeptId(dept.id),
      })),
    [depts]
  );

  const doctorData = useMemo(
    () =>
      doctors.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        degree: doctor.degree,
        experience: doctor.experience,
      })),
    [doctors]
  );

  const gotoDoctor = (selectedDoctorId) => {
    if (!selectedDeptId) return;
    navigate(`/branches/${branchId}/departments/${selectedDeptId}/doctors/${selectedDoctorId}`);
  };

  return (
    <Flex gap="32" style={{ maxHeight: '80vh', overflowY: 'auto', padding: '16px' }}>
      <Flex flexDirection="row" justifyContent="flex-end">
        <Menu options={departmentOptions}>
          <MenuTrigger>{getDeptName(selectedDeptId) || 'Select Department'}</MenuTrigger>
          <MenuContent />
        </Menu>
      </Flex>
      {selectedDeptId && (
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {doctorData.map((doctor) => (
            <Card
              maxW="xs"
              onClick={() => gotoDoctor(doctor.id)}
              key={doctor.id}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { backgroundColor: '#f0f0f0' },
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
                    src="https://plus.unsplash.com/premium_photo-1673953886016-6f0f3d33dddd?w=224"
                    alt={doctor.name}
                  />
                </CardImage>
              </CardPreview>
              <CardHeader>
                <Flex flexDirection="column" gap="8">
                  <Badge intent="information" w="fit">
                    {doctor.experience}
                  </Badge>
                  <Text fontSize="2xl" fontWeight="700">
                    Dr. {doctor.name}
                  </Text>
                  <Text color="fg.tertiary">{doctor.degree}</Text>
                </Flex>
              </CardHeader>
            </Card>
          ))}
        </Box>
      )}
    </Flex>
  );
};

export default Branch;
