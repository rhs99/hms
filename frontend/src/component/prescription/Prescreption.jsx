import axios from 'axios';
import { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { FaUserMd, FaPrescriptionBottleAlt, FaFilePdf, FaDownload } from 'react-icons/fa';
import { Box, Button, Flex, Heading, Text, Textarea } from '@optiaxiom/react';

import PdfDocument from './PdfDocument';
import Config from '../../config';
import { useMediaQuery } from '../useMediaQuery';

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
  <Box
    bg="bg.default"
    rounded="xl"
    border="1"
    borderColor="border.secondary"
    shadow="sm"
    style={{ overflow: 'hidden' }}
  >
    {children}
  </Box>
);

const MobilePrescriptionPage = ({ page }) => {
  const { hospitalData, doctorData, patientData, bodyData } = page;
  return (
    <Box bg="bg.default" rounded="lg" border="1" borderColor="border.tertiary" p="16">
      <Flex flexDirection="column" gap="12">
        <Flex
          flexDirection="column"
          gap="2"
          pb="12"
          borderColor="border.tertiary"
          style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid' }}
        >
          <Heading level="4" color="fg.accent.strong">
            {hospitalData.Hospital || 'Hospital'}
          </Heading>
          {hospitalData.Branch && (
            <Text fontSize="xs" color="fg.tertiary">
              {hospitalData.Branch}
            </Text>
          )}
          {(hospitalData.Phone || hospitalData.Email) && (
            <Text fontSize="xs" color="fg.tertiary">
              {[hospitalData.Phone, hospitalData.Email].filter(Boolean).join(' · ')}
            </Text>
          )}
        </Flex>

        <Flex flexDirection="column" gap="2">
          <Text fontSize="sm" fontWeight="600" color="fg.default">
            Dr. {doctorData.Doctor || 'N/A'}
          </Text>
          <Text fontSize="xs" color="fg.tertiary">
            {[doctorData.Degree, doctorData.Department].filter(Boolean).join(' · ')}
          </Text>
        </Flex>

        <Box bg="bg.secondary" rounded="md" p="12">
          <Flex flexDirection="row" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <PatientField label="Patient" value={patientData.Name} />
            <PatientField label="Gender" value={patientData.Gender} />
            <PatientField label="Age" value={patientData.Age} />
            <PatientField label="Blood" value={patientData['Blood Group']} />
            <PatientField label="Date" value={patientData.Date} />
          </Flex>
        </Box>

        <Flex flexDirection="column" gap="6">
          <Text
            fontSize="xs"
            fontWeight="600"
            color="fg.tertiary"
            textTransform="uppercase"
            style={{ letterSpacing: '0.5px' }}
          >
            ℞ Prescription
          </Text>
          <Box bg="bg.accent.subtle" rounded="md" p="12">
            <Text fontSize="sm" color="fg.default" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {bodyData.Prescription || 'No prescription details provided.'}
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

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
        <Flex alignItems="center" justifyContent="center" color="fg.accent.strong" style={{ fontSize: '20px' }}>
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
  const isMobile = useMediaQuery('(max-width: 600px)');

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
          subtitle={
            isMobile
              ? 'Tap download for the printable PDF'
              : viewOnly
                ? 'Printable prescription document'
                : 'Previous appointments and prescriptions'
          }
          trailing={
            <PDFDownloadLink
              document={<PdfDocument pages={pages} />}
              fileName="prescription.pdf"
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <Button appearance="subtle" size="sm" icon={<FaDownload />} disabled={loading}>
                  {loading ? 'Preparing…' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          }
        />
        {isMobile ? (
          <Box p="16" bg="bg.page">
            <Flex flexDirection="column" gap="12">
              {pages.map((page, idx) => (
                <MobilePrescriptionPage key={idx} page={page} />
              ))}
            </Flex>
          </Box>
        ) : (
          <Box bg="bg.page">
            <PDFViewer style={{ width: '100%', height: '720px', border: 'none', display: 'block' }}>
              <PdfDocument pages={pages} />
            </PDFViewer>
          </Box>
        )}
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
