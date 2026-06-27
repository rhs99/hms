import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Box, Button, Field, Flex, Input, Menu, MenuContent, MenuTrigger, Text } from '@optiaxiom/react';
import { FaPlus, FaMapMarkedAlt, FaCity, FaMap } from 'react-icons/fa';

import Config from '../../../config';
import { AlertBanner, Card, CardBody, CardHeader } from '../_components';
import { useAlertState } from '../../../component/useAlertState';

const RegionTab = () => {
  const { alert, show, dismiss } = useAlertState();

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);

  const [divisionName, setDivisionName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [thanaName, setThanaName] = useState('');

  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [savingDivision, setSavingDivision] = useState(false);
  const [savingDistrict, setSavingDistrict] = useState(false);
  const [savingThana, setSavingThana] = useState(false);

  const fetchDivisions = useCallback(async () => {
    try {
      const { data } = await axios.get(`${Config.SERVER_URL}/divisions`);
      setDivisions(data);
    } catch {
      show('danger', 'Failed to load divisions.');
    }
  }, [show]);

  const fetchDistricts = useCallback(
    async (divisionId) => {
      if (!divisionId) {
        setDistricts([]);
        return;
      }
      try {
        const { data } = await axios.get(`${Config.SERVER_URL}/districts?division_id=${divisionId}`);
        setDistricts(data);
      } catch {
        show('danger', 'Failed to load districts.');
      }
    },
    [show]
  );

  const fetchThanas = useCallback(
    async (districtId) => {
      if (!districtId) {
        setThanas([]);
        return;
      }
      try {
        const { data } = await axios.get(`${Config.SERVER_URL}/thanas?district_id=${districtId}`);
        setThanas(data);
      } catch {
        show('danger', 'Failed to load thanas.');
      }
    },
    [show]
  );

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  useEffect(() => {
    fetchDistricts(selectedDivision?.id);
    setSelectedDistrict(null);
  }, [selectedDivision, fetchDistricts]);

  useEffect(() => {
    fetchThanas(selectedDistrict?.id);
  }, [selectedDistrict, fetchThanas]);

  const handleCreateDivision = async (e) => {
    e.preventDefault();
    if (!divisionName.trim()) return;
    setSavingDivision(true);
    dismiss();
    try {
      await axios.post(`${Config.SERVER_URL}/divisions`, { name: divisionName.trim() });
      setDivisionName('');
      show('success', 'Division created.');
      await fetchDivisions();
    } catch {
      show('danger', 'Failed to create division.');
    } finally {
      setSavingDivision(false);
    }
  };

  const handleCreateDistrict = async (e) => {
    e.preventDefault();
    if (!districtName.trim() || !selectedDivision) {
      show('warning', 'Pick a division and enter a district name.');
      return;
    }
    setSavingDistrict(true);
    dismiss();
    try {
      await axios.post(`${Config.SERVER_URL}/districts`, {
        name: districtName.trim(),
        division_id: selectedDivision.id,
      });
      setDistrictName('');
      show('success', 'District created.');
      await fetchDistricts(selectedDivision.id);
    } catch {
      show('danger', 'Failed to create district.');
    } finally {
      setSavingDistrict(false);
    }
  };

  const handleCreateThana = async (e) => {
    e.preventDefault();
    if (!thanaName.trim() || !selectedDistrict) {
      show('warning', 'Pick a district and enter a thana name.');
      return;
    }
    setSavingThana(true);
    dismiss();
    try {
      await axios.post(`${Config.SERVER_URL}/thanas`, {
        name: thanaName.trim(),
        district_id: selectedDistrict.id,
      });
      setThanaName('');
      show('success', 'Thana created.');
      await fetchThanas(selectedDistrict.id);
    } catch {
      show('danger', 'Failed to create thana.');
    } finally {
      setSavingThana(false);
    }
  };

  return (
    <Flex flexDirection="column" gap="20">
      <AlertBanner alert={alert} onDismiss={dismiss} />

      <Card>
        <CardHeader icon={<FaMapMarkedAlt />} title="Divisions" subtitle="Top-level region" />
        <CardBody>
          <form onSubmit={handleCreateDivision}>
            <Flex flexDirection="row" gap="12" style={{ flexWrap: 'wrap' }}>
              <Field label="Division name" style={{ flex: '1 1 240px' }}>
                <Input
                  placeholder="e.g., Dhaka"
                  value={divisionName}
                  onChange={(e) => setDivisionName(e.target.value)}
                />
              </Field>
              <Box style={{ alignSelf: 'flex-end' }}>
                <Button type="submit" appearance="primary" disabled={savingDivision} icon={<FaPlus />}>
                  {savingDivision ? 'Adding…' : 'Add division'}
                </Button>
              </Box>
            </Flex>
          </form>
          {divisions.length > 0 && (
            <Flex flexDirection="row" gap="8" style={{ flexWrap: 'wrap', marginTop: '12px' }}>
              {divisions.map((d) => (
                <Badge key={d.id} intent="neutral">
                  {d.name}
                </Badge>
              ))}
            </Flex>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={<FaCity />} title="Districts" subtitle="Pick a division, add districts within it" />
        <CardBody>
          <form onSubmit={handleCreateDistrict}>
            <Flex flexDirection="row" gap="12" style={{ flexWrap: 'wrap' }}>
              <Field label="Division" style={{ flex: '1 1 200px' }}>
                <Menu
                  options={divisions.map((d) => ({
                    label: d.name,
                    execute: () => setSelectedDivision(d),
                  }))}
                >
                  <MenuTrigger>{selectedDivision ? selectedDivision.name : 'Select division'}</MenuTrigger>
                  <MenuContent />
                </Menu>
              </Field>
              <Field label="District name" style={{ flex: '1 1 200px' }}>
                <Input
                  placeholder="e.g., Dhaka"
                  value={districtName}
                  onChange={(e) => setDistrictName(e.target.value)}
                  disabled={!selectedDivision}
                />
              </Field>
              <Box style={{ alignSelf: 'flex-end' }}>
                <Button
                  type="submit"
                  appearance="primary"
                  disabled={savingDistrict || !selectedDivision}
                  icon={<FaPlus />}
                >
                  {savingDistrict ? 'Adding…' : 'Add district'}
                </Button>
              </Box>
            </Flex>
          </form>
          {selectedDivision && districts.length > 0 && (
            <Box style={{ marginTop: '12px' }}>
              <Text fontSize="xs" color="fg.tertiary" style={{ marginBottom: '8px' }}>
                Districts in {selectedDivision.name}
              </Text>
              <Flex flexDirection="row" gap="8" style={{ flexWrap: 'wrap' }}>
                {districts.map((d) => (
                  <Badge key={d.id} intent="neutral">
                    {d.name}
                  </Badge>
                ))}
              </Flex>
            </Box>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={<FaMap />} title="Thanas" subtitle="Pick a district, add thanas within it" />
        <CardBody>
          <form onSubmit={handleCreateThana}>
            <Flex flexDirection="row" gap="12" style={{ flexWrap: 'wrap' }}>
              <Field label="District" style={{ flex: '1 1 200px' }}>
                <Menu
                  options={districts.map((d) => ({
                    label: d.name,
                    execute: () => setSelectedDistrict(d),
                  }))}
                >
                  <MenuTrigger disabled={!selectedDivision}>
                    {selectedDistrict ? selectedDistrict.name : 'Select district'}
                  </MenuTrigger>
                  <MenuContent />
                </Menu>
              </Field>
              <Field label="Thana name" style={{ flex: '1 1 200px' }}>
                <Input
                  placeholder="e.g., Mirpur"
                  value={thanaName}
                  onChange={(e) => setThanaName(e.target.value)}
                  disabled={!selectedDistrict}
                />
              </Field>
              <Box style={{ alignSelf: 'flex-end' }}>
                <Button
                  type="submit"
                  appearance="primary"
                  disabled={savingThana || !selectedDistrict}
                  icon={<FaPlus />}
                >
                  {savingThana ? 'Adding…' : 'Add thana'}
                </Button>
              </Box>
            </Flex>
          </form>
          {selectedDistrict && thanas.length > 0 && (
            <Box style={{ marginTop: '12px' }}>
              <Text fontSize="xs" color="fg.tertiary" style={{ marginBottom: '8px' }}>
                Thanas in {selectedDistrict.name}
              </Text>
              <Flex flexDirection="row" gap="8" style={{ flexWrap: 'wrap' }}>
                {thanas.map((t) => (
                  <Badge key={t.id} intent="information">
                    {t.name}
                  </Badge>
                ))}
              </Flex>
            </Box>
          )}
        </CardBody>
      </Card>
    </Flex>
  );
};

export default RegionTab;
