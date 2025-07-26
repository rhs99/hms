import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Grid, Text, Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';
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
    <Flex gap="32" style={{ display: 'flex' }}>
      <Flex flexDirection="row" justifyContent="flex-end">
        <Menu options={departmentOptions}>
          <MenuTrigger>{getDeptName(selectedDeptId) || 'Select Department'}</MenuTrigger>
          <MenuContent />
        </Menu>
      </Flex>
      {selectedDeptId && (
        <Grid gridTemplateColumns="4">
          {doctorData.map((doctor) => (
            <Card maxW="xs" onClick={() => gotoDoctor(doctor.id)} key={doctor.id} style={{ cursor: 'pointer' }}>
              <CardPreview>
                <CardImage size="224" style={{ padding: '8px' }} asChild>
                  <FaUserDoctor />
                </CardImage>
              </CardPreview>
              <CardHeader>
                <Text>{doctor.name}</Text>
                <Text>{doctor.degree}</Text>
                <Text>{doctor.experience}</Text>
              </CardHeader>
            </Card>
          ))}
        </Grid>
      )}
    </Flex>
  );
};

export default Branch;
