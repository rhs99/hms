import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  DateInput,
  Field,
  Flex,
  Menu,
  MenuContent,
  MenuTrigger,
  Text,
} from '@optiaxiom/react';
import { FaPlus, FaUserMd, FaMapMarkedAlt, FaCalendarPlus, FaCheckCircle } from 'react-icons/fa';

import Config from '../../../config';
import { AlertBanner, Card, CardBody, CardHeader, SectionLabel, useAlertState } from '../_components';

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
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [workPlaceId, setWorkPlaceId] = useState(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [existingSchedules, setExistingSchedules] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [branches, setBranches] = useState([]);
  const [slots, setSlots] = useState([]);

  const [isAssigning, setIsAssigning] = useState(false);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const { alert, show, dismiss } = useAlertState();

  const fetchDoctors = useCallback(async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/doctors`);
      setDoctors(data);
    } catch (error) {
      show('danger', 'Failed to load doctors.');
    }
  }, [show]);

  const fetchHospitals = useCallback(async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/hospitals`);
      setHospitals(data);
    } catch (error) {
      show('danger', 'Failed to load hospitals.');
    }
  }, [show]);

  const fetchBranches = useCallback(
    async (hospitalId) => {
      try {
        const { data } = await axios.get(`${Config.SERVER_URL}/branches?hospital_id=${hospitalId}`);
        setBranches(data);
      } catch (error) {
        show('danger', 'Failed to load branches.');
      }
    },
    [show]
  );

  const fetchSlots = useCallback(async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/slots`);
      setSlots(data);
    } catch (error) {
      show('danger', 'Failed to load time slots.');
    }
  }, [show]);

  const checkAssignment = useCallback(async () => {
    if (!selectedDoctor || !selectedBranch) return;

    try {
      const workPlaceResponse = await axios.get(
        `${Config.SERVER_URL}/work-places?branch_id=${selectedBranch.id}&employee_id=${selectedDoctor.user_id}`
      );

      if (workPlaceResponse.data) {
        setIsAssigned(true);
        setWorkPlaceId(workPlaceResponse.data.id);

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
  }, [selectedDoctor, selectedBranch]);

  useEffect(() => {
    fetchDoctors();
    fetchHospitals();
    fetchSlots();
  }, [fetchDoctors, fetchHospitals, fetchSlots]);

  useEffect(() => {
    if (selectedHospital) {
      fetchBranches(selectedHospital.id);
    } else {
      setBranches([]);
      setSelectedBranch(null);
    }
  }, [selectedHospital, fetchBranches]);

  useEffect(() => {
    if (selectedDoctor && selectedBranch) {
      checkAssignment();
    } else {
      setIsAssigned(false);
      setWorkPlaceId(null);
      setExistingSchedules([]);
    }
  }, [selectedDoctor, selectedBranch, checkAssignment]);

  const handleAssignBranch = async () => {
    if (!selectedDoctor || !selectedBranch || !startDate) {
      show('warning', 'Please select doctor, branch, and start date.');
      return;
    }

    setIsAssigning(true);
    dismiss();

    try {
      await axios.post(`${Config.SERVER_URL}/work-places`, {
        branch_id: selectedBranch.id,
        employee_id: selectedDoctor.user_id,
        start_date: startDate,
        end_date: endDate || null,
      });

      await checkAssignment();
      show('success', 'Doctor assigned to branch successfully!');
    } catch (error) {
      show('danger', 'Failed to assign doctor. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleAddSchedule = async () => {
    if (!selectedSlot) {
      show('warning', 'Please select a time slot.');
      return;
    }
    if (selectedDays.length === 0) {
      show('warning', 'Please select at least one day.');
      return;
    }

    setIsAddingSchedule(true);
    dismiss();

    try {
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

      const promises = selectedDays.map((day) =>
        axios.post(`${Config.SERVER_URL}/slot-schedules`, {
          slot_id: selectedSlot.id,
          work_place_id: wpId,
          day: day,
        })
      );

      await Promise.all(promises);

      setSelectedSlot(null);
      setSelectedDays([]);
      show('success', 'Schedule added successfully!');

      checkAssignment();
    } catch (error) {
      show('danger', 'Failed to add schedule. Please try again.');
    } finally {
      setIsAddingSchedule(false);
    }
  };

  return (
    <Flex flexDirection="column" gap="20">
      <AlertBanner alert={alert} onDismiss={dismiss} />
      <Card>
        <CardHeader
          icon={<FaUserMd />}
          title="Select Doctor and Branch"
          subtitle="Choose who you're scheduling and where"
        />
        <CardBody>
          <Flex flexDirection="column" gap="16">
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

            <Flex flexDirection="row" gap="16" style={{ flexWrap: 'wrap' }}>
              <Field label="Hospital" required style={{ flex: '1 1 240px' }}>
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

              <Field label="Branch" required style={{ flex: '1 1 240px' }}>
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
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      {selectedDoctor && selectedBranch && (
        <>
          {!isAssigned ? (
            <Card>
              <CardHeader
                icon={<FaMapMarkedAlt />}
                title="Assign Doctor to Branch"
                subtitle="This doctor is not yet assigned to this branch"
              />
              <CardBody>
                <Flex flexDirection="column" gap="16">
                  <Flex flexDirection="row" gap="16" style={{ flexWrap: 'wrap' }}>
                    <Field label="Start Date" required style={{ flex: '1 1 200px' }}>
                      <DateInput value={startDate} onValueChange={setStartDate} required />
                    </Field>
                    <Field label="End Date (Optional)" style={{ flex: '1 1 200px' }}>
                      <DateInput value={endDate} onValueChange={setEndDate} />
                    </Field>
                  </Flex>
                  <Box>
                    <Button onClick={handleAssignBranch} appearance="primary" disabled={isAssigning} icon={<FaPlus />}>
                      {isAssigning ? 'Assigning...' : 'Assign to Branch'}
                    </Button>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader
                icon={<FaMapMarkedAlt />}
                title="Doctor Assignment"
                subtitle="Active assignment and existing schedules"
                trailing={
                  <Flex alignItems="center" gap="8" color="fg.success">
                    <FaCheckCircle />
                    <Text fontSize="sm" fontWeight="600" color="fg.success">
                      Assigned
                    </Text>
                  </Flex>
                }
              />
              <CardBody>
                {existingSchedules.length > 0 ? (
                  <Flex flexDirection="column" gap="12">
                    <SectionLabel>Existing Schedules</SectionLabel>
                    <Flex flexDirection="row" gap="8" style={{ flexWrap: 'wrap' }}>
                      {existingSchedules.map((schedule, index) => (
                        <Badge key={index} intent="information">
                          {schedule.day}: {schedule.start_at} - {schedule.end_at}
                        </Badge>
                      ))}
                    </Flex>
                  </Flex>
                ) : (
                  <Text fontSize="sm" color="fg.tertiary">
                    No schedules yet — add one below.
                  </Text>
                )}
              </CardBody>
            </Card>
          )}

          {(isAssigned || workPlaceId) && (
            <Card>
              <CardHeader
                icon={<FaCalendarPlus />}
                title="Add New Schedule"
                subtitle="Pick a time slot and the days of the week"
              />
              <CardBody>
                <Flex flexDirection="column" gap="16">
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
                    <Flex flexDirection="row" gap="8" style={{ flexWrap: 'wrap' }}>
                      {WEEKDAYS.map((day) => {
                        const checked = selectedDays.includes(day.value);
                        return (
                          <Flex
                            key={day.value}
                            alignItems="center"
                            gap="8"
                            p="8"
                            rounded="md"
                            border="1"
                            borderColor={checked ? 'border.accent' : 'border.tertiary'}
                            bg={checked ? 'bg.accent.subtle' : 'bg.default'}
                            style={{ cursor: 'pointer', minWidth: '128px' }}
                            onClick={() => handleDayToggle(day.value)}
                          >
                            <Checkbox checked={checked} onClick={(e) => e.stopPropagation()} readOnly tabIndex={-1} />
                            <Text fontSize="sm" fontWeight="600" color="fg.default">
                              {day.label}
                            </Text>
                          </Flex>
                        );
                      })}
                    </Flex>
                  </Field>

                  <Box>
                    <Button onClick={handleAddSchedule} appearance="primary" disabled={isAddingSchedule} icon={<FaPlus />}>
                      {isAddingSchedule ? 'Adding...' : 'Add Schedule'}
                    </Button>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </Flex>
  );
};

export default ScheduleTab;
