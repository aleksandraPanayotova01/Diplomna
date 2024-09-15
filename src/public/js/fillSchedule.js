document.addEventListener('DOMContentLoaded', () => {
    fetch('/student/get/periods')
        .then(response => response.json())
        .then(data => fillSchedule(data))
        .catch(error => console.error('Error fetching schedule:', error));

    fetch('/student/get/studentGroup')
        .then(response => response.json())
        .then(data => {
            console.log('Student Group Data:', data);
            displayStudentGroup(data)
        })
        .catch(error => console.error('Error fetching student group and half:', error));
});

function displayStudentGroup(data) {
    if (data.length > 0) {
        const { group_number, group_half_letter } = data[0];
        const groupInfo = `Седмично разписание за група ${group_number} ${group_half_letter}`;
        document.getElementById('studentGroupInfo').textContent = groupInfo;
    } else {
        document.getElementById('studentGroupInfo').textContent = "Седмично разписание";
    }
}
function fillSchedule(periods) {
    periods.forEach(period => {
        const {
            weekday_name, period_start_time, period_end_time, building_abbreviation,
            room_number, period_type_name, subject_name, title_name, surname
        } = period;

        // Get the corresponding HTML element ID for the day
        const dayElement = document.querySelector(`#${getDayId(weekday_name)}
         #classes${getDayInitial(weekday_name)}`);

        if (dayElement) {
            const periodElement = document.createElement('div');
            periodElement.classList.add('period');
            periodElement.innerHTML = `
                <div class="period">
                    ${formatTime(period_start_time)} - ${formatTime(period_end_time)}<br>
                    ${subject_name} (${period_type_name})
                    ${room_number}${building_abbreviation} 
                    ${title_name} ${surname}
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
