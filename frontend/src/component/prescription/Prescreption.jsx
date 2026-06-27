import axios from 'axios';
import { useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { FaUserMd, FaPrescriptionBottleAlt, FaFilePdf } from 'react-icons/fa';
import { Box, Button, Flex, Heading, Text, Textarea } from '@optiaxiom/react';

import PdfDocument from './PdfDocument';
import Config from '../../config';

const BLOOD_GROUP_LABELS = {
  A_POS: 'A+',
  A_NEG: 'A-',
  B_POS: 'B+',
  B_Neg: 'B-',
  O_POS: 'O+',
  O_NEG: 'O-',
  AB_POS: 'AB+',
  AB_NEG: 'AB-',
};

const formatBloodGroup = (bg) => BLOOD_GROUP_LABELS[bg] || 'N/A';

const calculateAge = (birthday) => {
  if (!birthday) return 'N/A';
  const ageDifMs = Date.now() - new Date(birthday);
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const FieldLabel = ({ children }) => (
  <Text fontSize="xs" fontWeight="600" color="fg.tertiary" textTransform="uppercase" style={{ letterSpacing: '0.5px' }}>
    {children}
  </Text>
);

const PatientField = ({ label, value }) => (
  <Flex
    flexDirection="column"
    gap="4"
    bg="bg.secondary"
    rounded="lg"
    border="1"
    borderColor="border.tertiary"
    p="12"
    style={{ flex: '1 1 140px', minWidth: '140px' }}
  >
    <FieldLabel>{label}</FieldLabel>
    <Text fontSize="md" fontWeight="600" color="fg.default">
      {value ?? 'N/A'}
    </Text>
  </Flex>
);

const Card = ({ children }) => (
  <Box bg="bg.default" rounded="xl" border="1" borderColor="border.secondary" shadow="sm" style={{ overflow: 'hidden' }}>
    {children}
  </Box>
);

const CardHeader = ({ icon, title, subtitle, trailing }) => (
  <Flex
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    bg="bg.secondary"
    p="16"
    borderColor="border.tertiary"
    style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid' }}
  >
    <Flex flexDirection="row" alignItems="center" gap="12">
      {icon && (
        <Flex alignItems="center" justifyContent="center" color="fg.accent" style={{ fontSize: '20px' }}>
          {icon}
        </Flex>
      )}
      <Flex flexDirection="column" gap="2">
        <Heading level="4" color="fg.default">
          {title}
        </Heading>
        {subtitle && (
          <Text fontSize="sm" color="fg.tertiary">
            {subtitle}
          </Text>
        )}
      </Flex>
    </Flex>
    {trailing}
  </Flex>
);

const Prescreption = ({ data, onUpdate, onCancel, viewOnly }) => {
  const { user_data, appointments } = data;
  const latestAppointment = appointments.slice(-1)[0];
  const [prescreption, setPrescreption] = useState(latestAppointment?.details || '');

  const updateAppointment = async (id) => {
    const URL = Config.SERVER_URL + `/appointments/${id}`;
    await axios.patch(URL, { details: prescreption });
    await onUpdate();
  };

  const buildPages = () => {
    const patientBase = {
      Name: user_data.name,
      Gender: user_data.gender,
      Age: calculateAge(user_data.dob),
      'Blood Group': formatBloodGroup(user_data.blood_group),
    };

    return appointments.map((appointment) => ({
      hospitalData: {
        Hospital: appointment.hospital,
        Branch: appointment.branch,
        Phone: appointment.phone,
        Email: appointment.email,
      },
      doctorData: {
        Department: appointment.dept,
        Doctor: appointment.doctor,
        Degree: appointment.degree,
      },
      patientData: { ...patientBase, Date: appointment.date },
      bodyData: { Prescription: appointment.details },
    }));
  };

  const renderHistoryPdf = () => {
    if (appointments.length <= 0) return null;
    if (!viewOnly && appointments.length <= 1) return null;

    const pages = buildPages();
    if (!viewOnly) pages.shift();

    return (
      <Card>
        <CardHeader
          icon={<FaFilePdf />}
          title={viewOnly ? 'Prescription' : 'Patient History'}
          subtitle={viewOnly ? 'Printable prescription document' : 'Previous appointments and prescriptions'}
        />
        <Box bg="bg.page">
          <PDFViewer style={{ width: '100%', height: '720px', border: 'none', display: 'block' }}>
            <PdfDocument pages={pages} />
          </PDFViewer>
        </Box>
      </Card>
    );
  };

  const renderEditableForm = (appointment) => {
    const disabled = prescreption.trim().length === 0;

    return (
      <Card>
        <CardHeader
          icon={<FaPrescriptionBottleAlt />}
          title="New Prescription"
          subtitle="Review patient details and prescribe treatment"
          trailing={
            <Flex alignItems="center" gap="8" color="fg.tertiary">
              <FaUserMd />
              <Text fontSize="sm" fontWeight="600">
                {appointment?.doctor ? `Dr. ${appointment.doctor}` : 'Attending Physician'}
              </Text>
            </Flex>
          }
        />

        <Box p="20">
          <Flex flexDirection="column" gap="20">
            <Flex flexDirection="column" gap="8">
              <FieldLabel>Patient Information</FieldLabel>
              <Flex flexDirection="row" gap="12" style={{ flexWrap: 'wrap' }}>
                <PatientField label="Patient" value={user_data.name} />
                <PatientField label="Gender" value={user_data.gender} />
                <PatientField label="Age" value={calculateAge(user_data.dob)} />
                <PatientField label="Blood Group" value={formatBloodGroup(user_data.blood_group)} />
              </Flex>
            </Flex>

            <Flex flexDirection="column" gap="8">
              <FieldLabel>Prescription</FieldLabel>
              <Textarea
                style={{ minHeight: '200px', width: '100%', fontSize: '14px', lineHeight: 1.6 }}
                placeholder="Enter diagnosis, medications, dosage, instructions, and follow-up notes..."
                value={prescreption}
                onChange={(e) => setPrescreption(e.target.value)}
              />
            </Flex>

            <Flex flexDirection="row" gap="12" justifyContent="flex-end">
              <Button appearance="danger-outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button appearance="primary" disabled={disabled} onClick={() => updateAppointment(appointment.id)}>
                Save Prescription
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Card>
    );
  };

  return (
    <Flex flexDirection="column" gap="20" className="prescription">
      {!viewOnly && latestAppointment && renderEditableForm(latestAppointment)}
      {renderHistoryPdf()}
    </Flex>
  );
};

export default Prescreption;
