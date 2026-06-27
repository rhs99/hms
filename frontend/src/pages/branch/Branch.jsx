import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Box, Button, Card, CardHeader, CardImage, CardPreview, Flex, Heading, Text } from '@optiaxiom/react';
import { FaHospitalAlt, FaUserMd, FaPlus, FaStethoscope } from 'react-icons/fa';
import { MdLocalHospital } from 'react-icons/md';

import Config from '../../config';
import AuthContext from '../../store/auth';
import { AlertBanner } from '../../component/alerts';
import { useAlertState } from '../../component/useAlertState';
import DepartmentAssociationModal from './DepartmentAssociationModal';
import DoctorAssociationModal from './DoctorAssociationModal';

const Branch = () => {
  const { isAdmin } = useContext(AuthContext);
  const [depts, setDepts] = useState([]);
  const [departmentDoctors, setDepartmentDoctors] = useState({});
  const [showAssociateDepartmentModal, setShowAssociateDepartmentModal] = useState(false);
  const [showAssociateDoctorModal, setShowAssociateDoctorModal] = useState(false);
  const [selectedDeptForDoctor, setSelectedDeptForDoctor] = useState(null);
  const { alert, show, dismiss } = useAlertState();

  const { branchId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const url = Config.SERVER_URL + `/branches/${branchId}/departments`;
    axios
      .get(url)
      .then(({ data }) => setDepts(data))
      .catch(() => show('danger', 'Failed to load departments for this branch.'));
  }, [branchId, show]);

  useEffect(() => {
    if (depts.length === 0) return;

    const fetchDoctorsForAllDepartments = async () => {
      const doctorsData = {};
      let hadError = false;

      for (const dept of depts) {
        try {
          const url = Config.SERVER_URL + `/branches/${branchId}/departments/${dept.id}/doctors`;
          const { data } = await axios.get(url);
          doctorsData[dept.id] = data;
        } catch {
          hadError = true;
          doctorsData[dept.id] = [];
        }
      }

      setDepartmentDoctors(doctorsData);
      if (hadError) show('danger', 'Failed to load doctors for some departments.');
    };

    fetchDoctorsForAllDepartments();
  }, [depts, branchId, show]);

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

    const url = Config.SERVER_URL + `/branches/${branchId}/departments`;
    axios
      .get(url)
      .then(({ data }) => setDepts(data))
      .catch(() => show('danger', 'Failed to refresh departments.'));
  };

  return (
    <Box bg="bg.page" p="16" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
      {alert && (
        <Box style={{ marginBottom: '16px' }}>
          <AlertBanner alert={alert} onDismiss={dismiss} />
        </Box>
      )}

      <Flex
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        gap="12"
        p="16"
        bg="bg.default"
        rounded="xl"
        border="1"
        borderColor="border.secondary"
        shadow="sm"
        style={{ marginBottom: '20px' }}
      >
        <Flex flexDirection="row" alignItems="center" gap="12">
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="bg.accent.subtle"
            color="fg.accent.strong"
            rounded="lg"
            style={{ width: '48px', height: '48px', fontSize: '24px' }}
          >
            <FaHospitalAlt />
          </Flex>
          <Heading level="2" color="fg.default">
            Departments & Doctors
          </Heading>
        </Flex>
        {isAdmin && (
          <Button appearance="primary" onClick={() => setShowAssociateDepartmentModal(true)} icon={<FaPlus />}>
            Add Department
          </Button>
        )}
      </Flex>

      {depts.length === 0 ? (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="16"
          p="48"
          bg="bg.default"
          rounded="xl"
          border="1"
          borderColor="border.secondary"
          style={{ borderStyle: 'dashed' }}
        >
          <Box color="fg.tertiary" style={{ fontSize: '48px', display: 'flex' }}>
            <MdLocalHospital />
          </Box>
          <Heading level="3" color="fg.secondary">
            No Departments Yet
          </Heading>
          <Text color="fg.tertiary">
            {isAdmin
              ? 'Get started by adding departments to this branch'
              : 'No departments have been added to this branch yet.'}
          </Text>
          {isAdmin && (
            <Button appearance="primary" onClick={() => setShowAssociateDepartmentModal(true)} icon={<FaPlus />}>
              Add Your First Department
            </Button>
          )}
        </Flex>
      ) : (
        <Flex flexDirection="column" gap="20">
          {depts.map((dept) => (
            <Box
              key={dept.id}
              bg="bg.default"
              rounded="xl"
              border="1"
              borderColor="border.secondary"
              shadow="sm"
              p="20"
            >
              <Flex
                flexDirection="row"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="space-between"
                gap="12"
                pb="12"
                borderColor="border.tertiary"
                style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', marginBottom: '16px' }}
              >
                <Flex flexDirection="row" flexWrap="wrap" alignItems="center" gap="12">
                  <Box color="fg.accent.strong" style={{ fontSize: '20px', display: 'flex' }}>
                    <FaStethoscope />
                  </Box>
                  <Heading level="4" color="fg.default">
                    {dept.name}
                  </Heading>
                  <Badge intent="information">{departmentDoctors[dept.id]?.length || 0} Doctors</Badge>
                </Flex>
                {isAdmin && (
                  <Button appearance="primary" size="sm" onClick={() => handleAddDoctor(dept.id)} icon={<FaPlus />}>
                    Add Doctor
                  </Button>
                )}
              </Flex>

              {departmentDoctors[dept.id]?.length > 0 ? (
                <Box
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {departmentDoctors[dept.id].map((doctor) => (
                    <Card key={doctor.id} onClick={() => gotoDoctor(dept.id, doctor.id)} style={{ cursor: 'pointer' }}>
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
                          <Flex flexDirection="row" alignItems="center" gap="8">
                            <Box color="fg.accent.strong" style={{ display: 'flex' }}>
                              <FaUserMd />
                            </Box>
                            <Text fontSize="lg" fontWeight="700" color="fg.default">
                              Dr. {doctor.name}
                            </Text>
                          </Flex>
                          <Text color="fg.tertiary" fontSize="sm">
                            {doctor.degree}
                          </Text>
                        </Flex>
                      </CardHeader>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Flex flexDirection="column" alignItems="center" gap="12" p="24">
                  <Text color="fg.tertiary">No doctors available in this department yet.</Text>
                  {isAdmin && (
                    <Button appearance="primary" onClick={() => handleAddDoctor(dept.id)} icon={<FaPlus />}>
                      Add Doctor
                    </Button>
                  )}
                </Flex>
              )}
            </Box>
          ))}
        </Flex>
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
