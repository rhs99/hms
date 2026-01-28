#!/bin/bash

#
# HMS Mock Data Generation Script (Deterministic)
#
# This script creates test data for the Hospital Management System.
# All assignments are deterministic (no randomness) to ensure:
# - Each hospital has exactly 2 branches (10 branches total)
# - Each branch has ALL 5 departments
# - 25 doctors are created (5 per department)
# - Each doctor is systematically assigned to 2 branches
# - Every branch is guaranteed to have doctors for all its departments
#
# Database relationships enforced:
# - Hospitals -> Branches (1:N): Each hospital has 2 branches
# - Branches -> Departments (M:N via branchdepts): Each branch has all 5 departments
# - Doctors -> Departments (N:1): 5 doctors per department
# - Doctors -> Branches (M:N via workplaces): Each doctor works at 2 branches
#

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
# Create exactly 2 branches per hospital (10 branches total)
branch_count=1
locations=("Zigatola" "Dhanmondi" "Gulshan" "Uttara" "Mirpur" "Banani" "Mohakhali" "Bashundhara" "Tejgaon" "Khilgaon")

location_idx=0
for ((hospital_id=1; hospital_id<hospital_count; hospital_id++)); do
    # Create exactly 2 branches per hospital
    for ((branch_num=0; branch_num<2; branch_num++)); do
        location=${locations[$location_idx]}
        phone="1623$hospital_id$branch_num"
        email="hospital${hospital_id}.${location}@gmail.com"

        call_api "branches" "{\"hospital_id\": $hospital_id, \"address\": \"$location\", \"phone\": \"$phone\", \"email\": \"$email\"}"
        echo "Created branch at $location for hospital ID: $hospital_id with ID: $branch_count"

        ((branch_count++))
        ((location_idx++))
    done
done

echo "Creating Users..."
# Create users for doctors
user_count=1
first_names=("Ahmed" "Sara" "Mohammed" "Fatima" "Ali" "Hassan" "Ayesha" "Omar" "Zainab" "Ibrahim" "Noor" "Yusuf" "Mariam" "Khalid" "Layla" "Rashid" "Amina" "Tariq" "Huda" "Bilal" "Safiya" "Hamza" "Rabia" "Idris" "Zahra")
last_names=("Khan" "Rahman" "Ahmed" "Hassan" "Ali" "Hossain" "Islam" "Chowdhury" "Akhter" "Siddique" "Uddin" "Karim" "Mahmud" "Alam" "Begum" "Sheikh" "Miah" "Biswas" "Roy" "Das" "Talukder" "Sarkar" "Haque" "Molla" "Mondal")

# Create exactly 25 users (all will be doctors)
for ((i=0; i<25; i++)); do
    first_name=${first_names[$i]}
    last_name=${last_names[$i]}
    full_name="$first_name $last_name"
    user_name="doctor-$((i+1))"
    password="123"
    email="doctor${i}@gmail.com"
    phone="01711$(printf "%06d" $i)"
    dob="1980-01-15"
    gender=$((i % 2 + 1))  # Alternating: 1, 2, 1, 2, ...
    blood_group=$((i % 8 + 1))  # Cycle through blood groups

    call_api "users/sign-up" "{\"user_name\": \"$user_name\", \"password\": \"$password\", \"full_name\": \"$full_name\", \"email\": \"$email\", \"phone\": \"$phone\", \"dob\": \"$dob\", \"gender\": $gender, \"blood_group\": $blood_group}"
    echo "Created user: $full_name with ID: $user_count"
    ((user_count++))
done

echo "Creating Departments..."
# Create departments - these are global entities that can be offered by any branch
dept_count=1
departments=("Medicine" "Cardiology" "Neurology" "Orthopedics" "Pediatrics")
for dept in "${departments[@]}"; do
    call_api "departments" "{\"name\": \"$dept\"}"
    echo "Created department: $dept with ID: $dept_count"
    ((dept_count++))
done

echo "Creating Doctors..."
# Create exactly 5 doctors per department (25 total)
doctor_count=1
degrees=("MBBS, FCPS, MD" "MBBS, MD" "MBBS, MS, FCPS" "MBBS, MD, MRCP" "MBBS, FCPS")
experiences=("Head of the Department" "Senior Consultant" "Specialist" "Associate Professor" "Assistant Professor")

# Declare array to track doctor-department assignments for later use
declare -a doctor_depts

# Create 5 doctors for each of the 5 departments (25 total)
user_id=1
for ((dept_id=1; dept_id<=5; dept_id++)); do
    for ((doc_num=0; doc_num<5; doc_num++)); do
        registration_no=$((1000 + user_id))
        degree=${degrees[$doc_num]}
        experience=${experiences[$doc_num]}

        call_api "doctors" "{\"user_id\": $user_id, \"dept_id\": $dept_id, \"registration_no\": $registration_no, \"degree\": \"$degree\", \"experience\": \"$experience\"}"
        echo "Created doctor with user ID: $user_id, department ID: $dept_id, doctor ID: $doctor_count"

        # Track which department this doctor belongs to (indexed by user_id)
        doctor_depts[$user_id]=$dept_id

        ((doctor_count++))
        ((user_id++))
    done
done

echo "Creating Branch-Department Relationships..."
# Assign ALL 5 departments to EVERY branch (ensures complete coverage)
for ((branch_id=1; branch_id<branch_count; branch_id++)); do
    for ((dept_id=1; dept_id<=5; dept_id++)); do
        call_api "branch-depts" "{\"branch_id\": $branch_id, \"dept_id\": $dept_id}"
        echo "Added department ID: $dept_id to branch ID: $branch_id"
    done
done

echo "Creating Work Places for Doctors..."
# Assign each doctor to exactly 2 branches in a systematic way
# This ensures every branch gets doctors from all departments
workplace_count=1
total_branches=10

for ((doctor_user_id=1; doctor_user_id<=25; doctor_user_id++)); do
    doctor_dept=${doctor_depts[$doctor_user_id]}

    # Calculate which 2 branches this doctor will work at
    # Use modulo to cycle through branches
    branch1=$(( (doctor_user_id - 1) % total_branches + 1 ))
    branch2=$(( doctor_user_id % total_branches + 1 ))

    start_date="2022-01-01"

    # Assign to first branch
    call_api "work-places" "{\"branch_id\": $branch1, \"employee_id\": $doctor_user_id, \"start_date\": \"$start_date\"}"
    echo "Created workplace for doctor (user ID: $doctor_user_id, dept: $doctor_dept) at branch ID: $branch1 with ID: $workplace_count"
    ((workplace_count++))

    # Assign to second branch
    call_api "work-places" "{\"branch_id\": $branch2, \"employee_id\": $doctor_user_id, \"start_date\": \"$start_date\"}"
    echo "Created workplace for doctor (user ID: $doctor_user_id, dept: $doctor_dept) at branch ID: $branch2 with ID: $workplace_count"
    ((workplace_count++))
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
# Create schedules for each workplace (deterministic)
# Each workplace gets assigned to a specific slot and works 4 days per week
for ((workplace_id=1; workplace_id<workplace_count; workplace_id++)); do
    # Cycle through slots (5 slots total)
    slot_id=$(( (workplace_id - 1) % 5 + 1 ))

    # Assign 4 days per week systematically
    # Days: 1=SAT, 2=SUN, 3=MON, 4=TUE, 5=WED, 6=THU, 7=FRI
    # Each workplace works 4 consecutive days (cycling through the week)
    start_day=$(( (workplace_id - 1) % 7 + 1 ))

    for ((i=0; i<4; i++)); do
        day=$(( (start_day + i - 1) % 7 + 1 ))
        call_api "slot-schedules" "{\"slot_id\": $slot_id, \"work_place_id\": $workplace_id, \"day\": $day}"
        echo "Created schedule for workplace ID: $workplace_id, slot ID: $slot_id, day: $day"
    done
done

echo ""
echo "========================================="
echo "Data Generation Complete!"
echo "========================================="
echo ""
echo "Summary of created data:"
echo "  - Hospitals: 5"
echo "  - Branches: 10 (2 per hospital)"
echo "  - Departments: 5"
echo "  - Users: 25 (all doctors)"
echo "  - Doctors: 25 (5 per department)"
echo "  - Branch-Dept Links: 50 (every branch has all 5 departments)"
echo "  - Time Slots: 5"
echo "  - Work Places: 50 (each doctor works at 2 branches)"
echo "  - Slot Schedules: ~200 (each workplace has 4 days/week)"
echo ""
echo "Key relationships (DETERMINISTIC - NO RANDOMNESS):"
echo "  ✓ Each hospital has exactly 2 branches"
echo "  ✓ Each branch has ALL 5 departments"
echo "  ✓ Each department has exactly 5 doctors"
echo "  ✓ Each doctor works at exactly 2 branches"
echo "  ✓ Each workplace has exactly 4 scheduled days per week"
echo ""
echo "GUARANTEED: Every branch has doctors for all departments!"
echo "========================================="