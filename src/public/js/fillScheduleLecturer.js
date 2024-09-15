document.addEventListener('DOMContentLoaded', () => {
    fetch('/lecturer/get/periods')
        .then(response => response.json())
        .then(data => fillLecturerSchedule(data))
        .catch(error => console.error('Error fetching lecturer schedule:', error));

    // Fetch lecturer info
    fetch('/lecturer/get/lecturerInfo')
        .then(response => response.json())
        .then(data => {
            console.log('Lecturer Info Data:', data);
            displayLecturerInfo(data);
        })
        .catch(error => console.error('Error fetching lecturer info:', error));
});

function displayLecturerInfo(data) {
    if (data.length > 0) {
        const { title_name, name, surname, department_name } = data;
        const lecturerInfo = `Седмично разписание за преподавател ${title_name} ${name}
         ${surname} от катедра ${department_name}`;
        document.getElementById('lecturerInfo').textContent = lecturerInfo;
    } else {
        document.getElementById('studentGroupInfo').textContent = "Седмично разписание";
    }
}

function fillLecturerSchedule(periods) {
    periods.forEach(period => {
        const {
            weekday_name, period_start_time, period_end_time, building_abbreviation,
            room_number, period_type_name, subject_name, course_number,
            specialty_abbreviation, group_number, group_half_letter
        } = period;

        // Get the corresponding HTML element ID for the day
        const dayElement = document.querySelector(`#${getDayId(weekday_name)} #classes${getDayInitial(weekday_name)}`);

        if (dayElement) {
            const periodElement = document.createElement('div');
            periodElement.classList.add('period');
            periodElement.innerHTML = `
                <div class="period">
                    ${formatTime(period_start_time)} - ${formatTime(period_end_time)}<br>
                    ${subject_name} (${period_type_name})
                    ${room_number}${building_abbreviation}
                    <br>
                     ${specialty_abbreviation} Курс: ${course_number}
                    Група ${group_number} ${group_half_letter}
                </div>
            `;
            dayElement.appendChild(periodElement);
        }
    });
}

// Map weekday names to corresponding HTML element IDs
function getDayId(weekday_name) {
    const days = {
        'Понеделник': 'monday',
        'Вторник': 'tuesday',
        'Сряда': 'wednesday',
        'Четвъртък': 'thursday',
        'Петък': 'friday',
        'Събота': 'saturday',
        'Неделя': 'sunday'
    };
    return days[weekday_name];
}

function getDayInitial(weekday_name) {
    const dayMap = {
        'Понеделник': 'M',  // Monday
        'Вторник': 'T',     // Tuesday
        'Сряда': 'W',       // Wednesday
        'Четвъртък': 'Th',  // Thursday
        'Петък': 'F',       // Friday
        'Събота': 'S',      // Saturday
        'Неделя': 'Su'      // Sunday
    };
    return dayMap[weekday_name];
}

// Format time from 'HH:MM:SS' to 'HH:MM'
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}
