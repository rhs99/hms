curl -X 'POST' \
  'http://localhost:8000/hospitals' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Ibn Sina"
}'

curl -X 'POST' \
  'http://localhost:8000/branches' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "hospital_id": 1,
  "address": "Zigatola",
  "phone": "16231",
  "email": "is.zigatola@gmail.com"
}'


curl -X 'POST' \
  'http://localhost:8000/users/sign-up' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "user_name": "tu-1",
  "password": "123",
  "full_name": "Test User 1",
  "email": "tu@gmail.com",
  "phone": "01611496418",
  "dob": "2013-03-02",
  "gender": 1,
  "blood_group": 5
}'

curl -X 'POST' \
  'http://localhost:8000/users/sign-up' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "user_name": "tu-2",
  "password": "123",
  "full_name": "Test User 2",
  "email": "tu@gmail.com",
  "phone": "01611496418",
  "dob": "2013-03-02",
  "gender": 2,
  "blood_group": 3
}'

curl -X 'POST' \
  'http://localhost:8000/departments' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Medicine"
}'


curl -X 'POST' \
  'http://localhost:8000/doctors' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "user_id": 1,
  "dept_id": 1,
  "registration_no": 123,
  "degree": "MBBS, FCPS, MD",
  "experience": "Head of the Dept of Medicine"
}'



curl -X 'POST' \
  'http://localhost:8000/branch-depts' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "branch_id": 1,
  "dept_id": 1
}'


curl -X 'POST' \
  'http://localhost:8000/work-places' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "branch_id": 1,
  "employee_id": 1,
  "start_date": "2022-01-01"
}'


curl -X 'POST' \
  'http://localhost:8000/slots' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "start_at": "5 PM",
  "end_at": "10 PM"
}'


curl -X 'POST' \
  'http://localhost:8000/slot-schedules' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "slot_id": 1,
  "work_place_id": 1,
  "day": 1
}'