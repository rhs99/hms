import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Field, Heading, Text, Flex, Checkbox, DateInput } from '@optiaxiom/react';
import { Menu, MenuContent, MenuTrigger } from '@optiaxiom/react';
import { FaPlus, FaCheckCircle } from 'react-icons/fa';

import Config from '../../../config';

const WEEKDAYS = [
  { value: 'SAT', label: 'Saturday' },
  { value: 'SUN', label: 'Sunday' },
  { value: 'MON', label: 'Monday' },
  { value: 'TUE', label: 'Tuesday' },
  { value: 'WED', label: 'Wednesday' },
  { value: 'THU', label: 'Thursday' },
  { value: 'FRI', label: 'Friday' },
];

const ScheduleTab = () => {
  // Step 1: Select doctor and branch
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Step 2: Assignment data
  const [workPlaceId, setWorkPlaceId] = useState(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Step 3: Schedule data
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [existingSchedules, setExistingSchedules] = useState([]);

  // Data lists
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [branches, setBranches] = useState([]);
  const [slots, setSlots] = useState([]);

  // UI state
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchHospitals();
    fetchSlots();
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      fetchBranches(selectedHospital.id);
    } else {
      setBranches([]);
      setSelectedBranch(null);
    }
  }, [selectedHospital]);

  useEffect(() => {
    if (selectedDoctor && selectedBranch) {
      checkAssignment();
    } else {
      setIsAssigned(false);
      setWorkPlaceId(null);
      setExistingSchedules([]);
    }
  }, [selectedDoctor, selectedBranch]);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/doctors`);
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/hospitals`);
      setHospitals(data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  const fetchBranches = async (hospitalId) => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/branches?hospital_id=${hospitalId}`);
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/slots`);
      setSlots(data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const checkAssignment = async () => {
    if (!selectedDoctor || !selectedBranch) return;

    try {
      // Check if work place exists
      const workPlaceResponse = await axios.get(
        `${Config.SERVER_URL}/work-places?branch_id=${selectedBranch.id}&employee_id=${selectedDoctor.user_id}`
      );

      if (workPlaceResponse.data) {
        setIsAssigned(true);
        setWorkPlaceId(workPlaceResponse.data.id);

        // Fetch existing slot schedules
        const schedulesResponse = await axios.get(
          `${Config.SERVER_URL}/slot-schedules?branch_id=${selectedBranch.id}&employee_id=${selectedDoctor.user_id}`
        );
        setExistingSchedules(schedulesResponse.data || []);
      } else {
        setIsAssigned(false);
        setWorkPlaceId(null);
        setExistingSchedules([]);
      }
    } catch (error) {
      setIsAssigned(false);
      setWorkPlaceId(null);
      setExistingSchedules([]);
    }
  };

  const handleAssignBranch = async () => {
    if (!selectedDoctor || !selectedBranch || !startDate) {
      alert('Please select doctor, branch, and start date');
      return;
    }

    setIsAssigning(true);
    setSuccessMessage('');

    try {
      await axios.post(`${Config.SERVER_URL}/work-places`, {
        branch_id: selectedBranch.id,
        employee_id: selectedDoctor.user_id,
        start_date: startDate,
        end_date: endDate || null,
      });

      // Refresh assignment status
      await checkAssignment();
      setSuccessMessage('Doctor assigned to branch successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error assigning doctor to branch:', error);
      alert('Error assigning doctor. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleAddSchedule = async () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }
    if (selectedDays.length === 0) {
      alert('Please select at least one day');
      return;
    }

    setIsAddingSchedule(true);
    setSuccessMessage('');

    try {
      // Ensure we have a work place ID
      let wpId = workPlaceId;
      if (!wpId) {
        const response = await axios.post(`${Config.SERVER_URL}/work-places`, {
          branch_id: selectedBranch.id,
          employee_id: selectedDoctor.user_id,
          start_date: startDate || new Date().toISOString().split('T')[0],
          end_date: endDate || null,
        });
        wpId = response.data.id;
        setWorkPlaceId(wpId);
        setIsAssigned(true);
      }

      // Create slot schedules for each selected day
      const promises = selectedDays.map((day) =>
        axios.post(`${Config.SERVER_URL}/slot-schedules`, {
          slot_id: selectedSlot.id,
          work_place_id: wpId,
          day: day,
        })
      );

      await Promise.all(promises);

      // Reset schedule form
      setSelectedSlot(null);
      setSelectedDays([]);
      setSuccessMessage('Schedule added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh existing schedules
      checkAssignment();
    } catch (error) {
      console.error('Error adding schedule:', error);
      alert('Error adding schedule. Please try again.');
    } finally {
      setIsAddingSchedule(false);
    }
  };

  return (
    <Box className="settings-tab">
      {/* Step 1: Select Doctor and Branch */}
      <Box className="settings-tab-form" style={{ marginBottom: '24px' }}>
        <Heading level="3">Select Doctor and Branch</Heading>

        <Field label="Doctor" required>
          <Menu
            options={doctors.map((doctor) => ({
              label: `${doctor.full_name} (Reg: ${doctor.registration_no})`,
              execute: () => setSelectedDoctor(doctor),
            }))}
          >
            <MenuTrigger>
              {selectedDoctor
                ? `${selectedDoctor.full_name} (Reg: ${selectedDoctor.registration_no})`
                : 'Select doctor'}
            </MenuTrigger>
            <MenuContent />
          </Menu>
        </Field>

        <Field label="Hospital" required>
          <Menu
            options={hospitals.map((hospital) => ({
              label: hospital.name,
              execute: () => setSelectedHospital(hospital),
            }))}
          >
            <MenuTrigger>{selectedHospital ? selectedHospital.name : 'Select hospital'}</MenuTrigger>
            <MenuContent />
          </Menu>
        </Field>

        <Field label="Branch" required>
          <Menu
            options={branches.map((branch) => ({
              label: branch.address,
              execute: () => setSelectedBranch(branch),
            }))}
          >
            <MenuTrigger>{selectedBranch ? selectedBranch.address : 'Select branch'}</MenuTrigger>
            <MenuContent />
          </Menu>
        </Field>
      </Box>

      {/* Step 2: Assignment Status and Action */}
      {selectedDoctor && selectedBranch && (
        <>
          {!isAssigned ? (
            <Box className="settings-tab-form" style={{ marginBottom: '24px' }}>
              <Heading level="4">Assign Doctor to Branch</Heading>
              <Text style={{ marginBottom: '16px', color: 'var(--color-fg-secondary)' }}>
                This doctor is not yet assigned to this branch. Please assign them first.
              </Text>

              <Field label="Start Date" required>
                <DateInput value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </Field>

              <Field label="End Date (Optional)">
                <DateInput value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </Field>

              <Button
                onClick={handleAssignBranch}
                appearance="primary"
                disabled={isAssigning}
                icon={<FaPlus />}
                style={{ marginTop: '16px' }}
              >
                {isAssigning ? 'Assigning...' : 'Assign to Branch'}
              </Button>
            </Box>
          ) : (
            <Box className="settings-tab-form" style={{ marginBottom: '24px' }}>
              <Heading level="4">Doctor Assignment</Heading>
              <Text style={{ color: 'var(--color-success)', marginBottom: '16px' }}>
                ✓ This doctor is assigned to this branch
              </Text>

              {existingSchedules.length > 0 && (
                <Box style={{ marginBottom: '16px' }}>
                  <Text fontWeight="600" style={{ marginBottom: '8px' }}>
                    Existing Schedules:
                  </Text>
                  <Box style={{ display: 'grid', gap: '8px' }}>
                    {existingSchedules.map((schedule, index) => (
                      <Text key={index} style={{ color: 'var(--color-fg-secondary)' }}>
                        • {schedule.day}: {schedule.start_at} - {schedule.end_at}
                      </Text>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Step 3: Manage Schedules */}
          {(isAssigned || workPlaceId) && (
            <Box className="settings-tab-form">
              <Heading level="4">Add New Schedule</Heading>

              <Field label="Time Slot" required>
                <Menu
                  options={slots.map((slot) => ({
                    label: `${slot.start_at} - ${slot.end_at}`,
                    execute: () => setSelectedSlot(slot),
                  }))}
                >
                  <MenuTrigger>
                    {selectedSlot ? `${selectedSlot.start_at} - ${selectedSlot.end_at}` : 'Select time slot'}
                  </MenuTrigger>
                  <MenuContent />
                </Menu>
              </Field>

              <Field label="Days of Week" required>
                <Flex flexDirection="column" gap="8">
                  {WEEKDAYS.map((day) => (
                    <Flex flexDirection="row" key={day.value} alignItems="center" gap="8">
                      <Checkbox
                        checked={selectedDays.includes(day.value)}
                        onChange={() => handleDayToggle(day.value)}
                      />
                      <Text>{day.label}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Field>

              <Flex gap="12" alignItems="center" style={{ marginTop: '16px' }}>
                <Button onClick={handleAddSchedule} appearance="primary" disabled={isAddingSchedule} icon={<FaPlus />}>
                  {isAddingSchedule ? 'Adding...' : 'Add Schedule'}
                </Button>
                {successMessage && (
                  <Flex alignItems="center" gap="8" style={{ color: 'var(--color-success)' }}>
                    <FaCheckCircle />
                    <Text>{successMessage}</Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ScheduleTab;
