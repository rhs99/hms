#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:5000"

# Common headers for all requests
HEADERS=(-H "accept: application/json" -H "Content-Type: application/json")

# Function to make API calls
call_api() {
    local endpoint=$1
    local data=$2
    curl -s -X POST "${BASE_URL}/${endpoint}" "${HEADERS[@]}" -d "${data}"
    echo # Add a newline after each curl response
}

echo "Creating Hospitals..."
# Create multiple hospitals - IDs will be auto-incremented (1, 2, 3...)
hospital_names=("Ibn Sina" "Square Hospital" "Labaid Hospital" "United Hospital" "Apollo Hospital")
hospital_count=1
for name in "${hospital_names[@]}"; do
    call_api "hospitals" "{\"name\": \"$name\"}"
    echo "Created hospital: $name with ID: $hospital_count"
    ((hospital_count++))
done

echo "Creating Branches..."
# Create branches for each hospital
branch_count=1
locations=("Zigatola" "Dhanmondi" "Gulshan" "Uttara" "Mirpur")
for ((hospital_id=1; hospital_id<hospital_count; hospital_id++)); do
    # Create 1-2 branches per hospital
    branch_limit=$((1 + RANDOM % 2))
    for ((i=0; i<branch_limit && i<${#locations[@]}; i++)); do
        location=${locations[$i]}
        phone="1623$hospital_id$i"
        email="hospital${hospital_id}.${location}@gmail.com"
        
        call_api "branches" "{\"hospital_id\": $hospital_id, \"address\": \"$location\", \"phone\": \"$phone\", \"email\": \"$email\"}"
        echo "Created branch at $location for hospital ID: $hospital_id with ID: $branch_count"
        ((branch_count++))
    done
done

echo "Creating Users..."
# Create users - doctors and patients
user_count=1
genders=(1 2)
blood_groups=(1 2 3 4 5 6 7 8)
first_names=("Ahmed" "Sara" "Mohammed" "Fatima" "Ali")
last_names=("Khan" "Rahman" "Ahmed" "Hassan" "Ali")

for ((i=1; i<=10; i++)); do
    first_name=${first_names[$((RANDOM % ${#first_names[@]}))]}
    last_name=${last_names[$((RANDOM % ${#last_names[@]}))]}
    full_name="$first_name $last_name"
    user_name="tu-$i"
    password="123"
    email="user${i}@gmail.com"
    phone="0161149641$i"
    dob="2013-03-02"
    gender=${genders[$((RANDOM % ${#genders[@]}))]}
    blood_group=${blood_groups[$((RANDOM % ${#blood_groups[@]}))]}
    
    call_api "users/sign-up" "{\"user_name\": \"$user_name\", \"password\": \"$password\", \"full_name\": \"$full_name\", \"email\": \"$email\", \"phone\": \"$phone\", \"dob\": \"$dob\", \"gender\": $gender, \"blood_group\": $blood_group}"
    echo "Created user: $full_name with ID: $user_count"
    ((user_count++))
done

echo "Creating Departments..."
# Create departments
dept_count=1
departments=("Medicine" "Cardiology" "Neurology" "Orthopedics" "Pediatrics")
for dept in "${departments[@]}"; do
    call_api "departments" "{\"name\": \"$dept\"}"
    echo "Created department: $dept with ID: $dept_count"
    ((dept_count++))
done

echo "Creating Doctors..."
# Create doctors using some of the created users
doctor_count=1
degrees=("MBBS, FCPS, MD" "MBBS, MD" "MBBS, MS, FCPS" "MBBS, MD, MRCP")
experiences=("Head of the Dept of Medicine" "Senior Consultant" "Specialist" "Associate Professor")

# Use first 5 users as doctors
for ((user_id=1; user_id<=5; user_id++)); do
    dept_id=$((1 + RANDOM % (dept_count-1)))
    registration_no=$((1000 + user_id))
    degree=${degrees[$((RANDOM % ${#degrees[@]}))]}
    experience=${experiences[$((RANDOM % ${#experiences[@]}))]}
    
    call_api "doctors" "{\"user_id\": $user_id, \"dept_id\": $dept_id, \"registration_no\": $registration_no, \"degree\": \"$degree\", \"experience\": \"$experience\"}"
    echo "Created doctor with user ID: $user_id, department ID: $dept_id, doctor ID: $doctor_count"
    ((doctor_count++))
done

echo "Creating Branch-Department Relationships..."
# Create branch-department relationships
for ((branch_id=1; branch_id<branch_count; branch_id++)); do
    # Each branch offers 1-3 departments
    dept_limit=$((1 + RANDOM % 3))
    for ((dept_id=1; dept_id<=dept_limit && dept_id<dept_count; dept_id++)); do
        call_api "branch-depts" "{\"branch_id\": $branch_id, \"dept_id\": $dept_id}"
        echo "Added department ID: $dept_id to branch ID: $branch_id"
    done
done

echo "Creating Work Places for Doctors..."
# Create work places
workplace_count=1
for ((doctor_id=1; doctor_id<doctor_count; doctor_id++)); do
    # Each doctor works in 1-2 branches
    workplace_limit=$((1 + RANDOM % 2))
    for ((branch_id=1; branch_id<=workplace_limit && branch_id<branch_count; branch_id++)); {
        start_date="2022-01-01"
        
        call_api "work-places" "{\"branch_id\": $branch_id, \"employee_id\": $doctor_id, \"start_date\": \"$start_date\"}"
        echo "Created workplace for doctor ID: $doctor_id at branch ID: $branch_id with ID: $workplace_count"
        ((workplace_count++))
    }
done

echo "Creating Slots..."
# Create time slots using the original format
slot_count=1
time_slots=(
    "8 AM|12 PM" 
    "1 PM|4 PM" 
    "5 PM|10 PM" 
    "9 AM|1 PM" 
    "2 PM|6 PM"
)

for slot in "${time_slots[@]}"; do
    start_time=$(echo $slot | cut -d'|' -f1)
    end_time=$(echo $slot | cut -d'|' -f2)
    
    call_api "slots" "{\"start_at\": \"$start_time\", \"end_at\": \"$end_time\"}"
    echo "Created time slot: $start_time to $end_time with ID: $slot_count"
    ((slot_count++))
done

echo "Creating Schedules..."
# Create schedules for each workplace
for ((workplace_id=1; workplace_id<workplace_count; workplace_id++)); do
    # Randomly select a slot for this workplace
    slot_id=$((1 + RANDOM % (slot_count-1)))
    
    # Create schedules for various days (1=Monday, 7=Sunday)
    days_per_doctor=$((2 + RANDOM % 4)) # 2-5 days per week
    for ((day=1; day<=7; day++)); do
        # Only schedule for randomly selected days to avoid all doctors working all days
        if ((RANDOM % 2 == 0)) && ((days_per_doctor > 0)); then
            call_api "slot-schedules" "{\"slot_id\": $slot_id, \"work_place_id\": $workplace_id, \"day\": $day}"
            echo "Created schedule for workplace ID: $workplace_id, slot ID: $slot_id, day: $day"
            ((days_per_doctor--))
        fi
    done
done

echo "Data generation complete!"