import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Box, Text, Heading, Badge, Button } from '@optiaxiom/react';
import { Card, CardHeader, CardImage, CardPreview } from '@optiaxiom/react';
import { FaHospitalAlt, FaUserMd, FaPlus, FaStethoscope } from 'react-icons/fa';
import { MdLocalHospital } from 'react-icons/md';

import Config from '../../config';
import DepartmentAssociationModal from './DepartmentAssociationModal';
import DoctorAssociationModal from './DoctorAssociationModal';

import './_index.scss';

const Branch = () => {
  const [depts, setDepts] = useState([]);
  const [departmentDoctors, setDepartmentDoctors] = useState({});
  const [showAssociateDepartmentModal, setShowAssociateDepartmentModal] = useState(false);
  const [showAssociateDoctorModal, setShowAssociateDoctorModal] = useState(false);
  const [selectedDeptForDoctor, setSelectedDeptForDoctor] = useState(null);

  const { branchId } = useParams();
  const navigate = useNavigate();

  // Fetch all departments for this branch
  useEffect(() => {
    const url = Config.SERVER_URL + `/branches/${branchId}/departments`;
    axios.get(url).then(({ data }) => {
      setDepts(data);
    });
  }, [branchId]);

  // Fetch doctors for each department
  useEffect(() => {
    if (depts.length === 0) return;

    const fetchDoctorsForAllDepartments = async () => {
      const doctorsData = {};

      for (const dept of depts) {
        try {
          const url = Config.SERVER_URL + `/branches/${branchId}/departments/${dept.id}/doctors`;
          const { data } = await axios.get(url);
          doctorsData[dept.id] = data;
        } catch (error) {
          console.error(`Error fetching doctors for department ${dept.id}:`, error);
          doctorsData[dept.id] = [];
        }
      }

      setDepartmentDoctors(doctorsData);
    };

    fetchDoctorsForAllDepartments();
  }, [depts, branchId]);

  const gotoDoctor = (deptId, doctorId) => {
    navigate(`/branches/${branchId}/departments/${deptId}/doctors/${doctorId}`);
  };

  const handleAddDoctor = (deptId) => {
    setSelectedDeptForDoctor(deptId);
    setShowAssociateDoctorModal(true);
  };

  const handleModalClose = () => {
    setShowAssociateDepartmentModal(false);
    setShowAssociateDoctorModal(false);
    setSelectedDeptForDoctor(null);

    // Refresh data
    const url = Config.SERVER_URL + `/branches/${branchId}/departments`;
    axios.get(url).then(({ data }) => {
      setDepts(data);
    });
  };

  return (
    <Box className="branch">
      <Box className="branch-header">
        <Flex flexDirection="row" alignItems="center" gap="12">
          <FaHospitalAlt size={32} style={{ color: 'var(--color-primary)' }} />
          <Heading level="2" className="branch-title">
            Departments & Doctors
          </Heading>
        </Flex>
        <Box className="branch-actions">
          <Button
            appearance="primary"
            onClick={() => setShowAssociateDepartmentModal(true)}
            className="branch-add-button"
            icon={<FaPlus />}
          >
            Add Department
          </Button>
        </Box>
      </Box>

      {depts.length === 0 ? (
        <Box className="branch-empty-state">
          <Box className="branch-empty-icon">
            <MdLocalHospital size={64} />
          </Box>
          <Heading level="3" className="branch-empty-title">
            No Departments Yet
          </Heading>
          <Text className="branch-empty-description">Get started by adding departments to this branch</Text>
          <Button appearance="primary" onClick={() => setShowAssociateDepartmentModal(true)} icon={<FaPlus />}>
            Add Your First Department
          </Button>
        </Box>
      ) : (
        <Box className="branch-departments">
          {depts.map((dept) => (
            <Box key={dept.id} className="branch-department-section">
              <Box className="branch-department-header">
                <Flex flexDirection="row" alignItems="center" gap="12">
                  <FaStethoscope size={24} />
                  <Heading level="3" className="branch-department-name">
                    {dept.name}
                  </Heading>
                  <Badge className="branch-doctor-count">{departmentDoctors[dept.id]?.length || 0} Doctors</Badge>
                </Flex>
                <Button appearance="primary" size="sm" onClick={() => handleAddDoctor(dept.id)} icon={<FaPlus />}>
                  Add Doctor
                </Button>
              </Box>

              {departmentDoctors[dept.id]?.length > 0 ? (
                <Box className="branch-doctors-grid">
                  {departmentDoctors[dept.id].map((doctor) => (
                    <Card key={doctor.id} className="branch-doctor-card" onClick={() => gotoDoctor(dept.id, doctor.id)}>
                      <CardPreview>
                        <CardImage asChild>
                          <img
                            src="https://plus.unsplash.com/premium_photo-1673953886016-6f0f3d33dddd?w=280"
                            alt={`Dr. ${doctor.name}`}
                          />
                        </CardImage>
                      </CardPreview>
                      <CardHeader>
                        <Flex flexDirection="column" gap="8">
                          <Badge intent="information" w="fit">
                            {doctor.experience}
                          </Badge>
                          <Text fontSize="lg" fontWeight="700">
                            <FaUserMd style={{ display: 'inline', marginRight: '8px' }} />
                            Dr. {doctor.name}
                          </Text>
                          <Text color="fg.tertiary" fontSize="sm">
                            {doctor.degree}
                          </Text>
                        </Flex>
                      </CardHeader>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box className="branch-no-doctors">
                  <Text>No doctors available in this department yet.</Text>
                  <Button
                    appearance="primary"
                    onClick={() => handleAddDoctor(dept.id)}
                    style={{ marginTop: 'var(--spacing-md)' }}
                    icon={<FaPlus />}
                  >
                    Add Doctor
                  </Button>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      {showAssociateDepartmentModal && (
        <DepartmentAssociationModal
          open={showAssociateDepartmentModal}
          onClose={handleModalClose}
          branchId={branchId}
          branchDepartments={depts}
        />
      )}

      {showAssociateDoctorModal && (
        <DoctorAssociationModal
          open={showAssociateDoctorModal}
          onClose={handleModalClose}
          branchId={branchId}
          deptId={selectedDeptForDoctor}
        />
      )}
    </Box>
  );
};

export default Branch;
