import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Table from '../../design-library/table/Table';
import AuthContext from '../../store/auth';
import Config from '../../config';

const Workplace = () => {
    const [workplaces, setWorkplaces] = useState(null);
    const [appointments, setAppointments] = useState(null);

    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authCtx.isLoggedIn) {
            return;
        }

        const URL = Config.SERVER_URL + `/work-places/employees/${authCtx.getStoredValue().userId}`;
        axios.get(URL).then(({ data }) => {
            setWorkplaces(data);
        });
    }, []);

    const getAllAppointments = (slot_schedule_id) => {
        const URL = Config.SERVER_URL + `/appointments/slot-schedules/${slot_schedule_id}`;
        axios.get(URL).then(({ data }) => {
            setAppointments(data);
        });
    }

    if (!authCtx.isLoggedIn) {
        return navigate('/');
    }

    const renderAllWorkplaces = () => {
        if (!workplaces || workplaces.length === 0) {
            return <p>No workplace found!</p>;
        }
        return (
            <Table
                title="My Workplaces"
                headers={['Hospital', 'Branch', 'Day', 'Starting At', 'Ending At']}
                rows={workplaces.map((workplace) => {
                    return {
                        key: workplace.slot_schedule_id,
                        value: [workplace.hospital, workplace.branch, workplace.day, workplace.start_at, workplace.end_at],
                    };
                })}
                onRowClick={getAllAppointments}
                highlightSelection={true}
            />
        );
    };

    const renderAllAppointments = () => {
        if (!appointments || appointments.length === 0) {
            return <p>No appointment found!</p>;
        }
        return (
            <Table
                title="My Appointments"
                headers={['Id', 'Parent', 'Patient', 'Gender']}
                rows={appointments.map((appointment) => {
                    return {
                        key: appointment.id,
                        value: [
                            appointment.id,
                            appointment.parent || 'N/A',
                            appointment.full_name,
                            appointment.gender,
                        ],
                    };
                })}
            />
        );
    };

    return <div>
        {renderAllWorkplaces()}
        {renderAllAppointments()}
    </div>;
};

export default Workplace;
