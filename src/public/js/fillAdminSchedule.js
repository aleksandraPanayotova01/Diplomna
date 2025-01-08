document.addEventListener('DOMContentLoaded', () => {
    const schedule = JSON.parse('<%= JSON.stringify(schedule) %>'); // Get schedule from server

    const days = {
        monday: 'Понеделник',
        tuesday: 'Вторник',
        wednesday: 'Сряда',
        thursday: 'Четвъртък',
        friday: 'Петък',
        saturday: 'Събота',
        sunday: 'Неделя'
    };

    schedule.forEach(entry => {
        const dayKey = Object.keys(days).find(key => days[key] === entry.weekday_name);

        if (dayKey) {
            const section = document.getElementById(`classes${dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}`);

            if (section) {
                const classInfo = document.createElement('div');
                classInfo.classList.add('class-info');
                classInfo.innerHTML = `
                    <strong>Subject:</strong> ${entry.subject_name}<br>
                    <strong>Time:</strong> ${entry.period_start_time} - ${entry.period_end_time}<br>
                    <strong>Room:</strong> ${entry.room_number}
                `;

                section.appendChild(classInfo);
            }
        }
    });
});
