document.addEventListener('DOMContentLoaded', () => {
    // Ensure the schedule variable is passed from the server correctly
    const schedule = JSON.parse('<%= JSON.stringify(schedule) %>'); // Get schedule from server

    // Mapping of weekdays (adjust case to match your data)
    const days = {
        monday: 'Понеделник',
        tuesday: 'Вторник',
        wednesday: 'Сряда',
        thursday: 'Четвъртък',
        friday: 'Петък',
        saturday: 'Събота',
        sunday: 'Неделя'
    };

    // Loop through the schedule and populate the appropriate day sections
    schedule.forEach(entry => {
        // Normalize weekday names (ensure database returns them in the format you expect)
        const dayKey = Object.keys(days).find(key => days[key] === entry.weekday_name);

        if (dayKey) {
            // Find the corresponding section for the day
            const section = document.getElementById(`classes${dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}`);

            if (section) {
                // Create class info element
                const classInfo = document.createElement('div');
                classInfo.classList.add('class-info');
                classInfo.innerHTML = `
                    <strong>Subject:</strong> ${entry.subject_name}<br>
                    <strong>Time:</strong> ${entry.period_start_time} - ${entry.period_end_time}<br>
                    <strong>Room:</strong> ${entry.room_number}
                `;

                // Append class info to the section
                section.appendChild(classInfo);
            }
        }
    });
});
