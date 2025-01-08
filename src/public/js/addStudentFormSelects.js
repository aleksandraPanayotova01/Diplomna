document.addEventListener("DOMContentLoaded", async function () {
    const getDepartments = async () => {
        try {
            const response = await fetch(`/admin/get/departments`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };
    const getSpecialties = async () => {
        try {
            const response = await fetch(`/admin/get/specialties`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };

    const facultyChosen = document.querySelector('#selectFaculty');
    const departmentsInFaculty = document.querySelector('#selectDepartment');
    const departments = await getDepartments();
    const specialties = await getSpecialties();
    console.log(specialties);
    const departmentChosen = document.querySelector('#selectDepartment');
    const specialtiesInDepartment = document.querySelector('#selectSpecialty');
    const coursesSelect = document.querySelector("#selectCourse");
    const facultyFirstOption = facultyChosen.options[0];
    createDepartmentOptions(facultyFirstOption.value);
    facultyChosen.addEventListener("change", async function () {
        departmentsInFaculty.innerHTML = '';
        createDepartmentOptions(facultyChosen.value);

    });
    departmentChosen.addEventListener("change", async function () {
        specialtiesInDepartment.innerHTML = '';
        createSpecialtyOptions(departmentChosen.value);
    });

    specialtiesInDepartment.addEventListener("change", function () {
        console.log(specialtiesInDepartment.value);
        createCoursesOptions(specialtiesInDepartment.value);
    });

    function createDepartmentOptions(faculty) {
        const defaultOption = document.createElement('option');
        defaultOption.value = 'none';
        defaultOption.selected = true;
        defaultOption.hidden = true;
        defaultOption.disabled = true;
        defaultOption.textContent = 'Изберете катедра';
        departmentsInFaculty.appendChild(defaultOption);
        for (const department of departments) {
            if (department.faculty_abbreviation === faculty) {
                const departmentOption = document.createElement('option');// add options to the select
                departmentOption.textContent = `${department.department_name}`;//(${department.department_abbreviation})
                departmentOption.value = department.department_abbreviation;
                departmentsInFaculty.appendChild(departmentOption);
            }
        }
    };
    function createSpecialtyOptions(department) {
        const defaultOption1 = document.createElement('option');
        defaultOption1.value = 'none';
        defaultOption1.selected = true;
        defaultOption1.hidden = true;
        defaultOption1.disabled = true;
        defaultOption1.textContent = 'Изберете специалност';
        specialtiesInDepartment.appendChild(defaultOption1);
        for (const specialty of specialties) {
            if (specialty.department_abbreviation === department) {
                const specialtyOption = document.createElement('option');
                specialtyOption.textContent = `${specialty.specialty_name}`;// (${specialty.specialty_abbreviation})
                specialtyOption.value = specialty.specialty_id;
                specialtiesInDepartment.appendChild(specialtyOption);

            }
        }
    };

    function createCoursesOptions(specialtyId) {
        const result = specialties.find(s => s.specialty_id == specialtyId);
        if (!result) {
            console.error('Specialty not found');
            return;
        }

        const duration = parseInt(result.specialty_semesters, 10);

        coursesSelect.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = 'none';
        defaultOption.selected = true;
        defaultOption.hidden = true;
        defaultOption.disabled = true;
        defaultOption.textContent = 'Изберете семестър';
        coursesSelect.appendChild(defaultOption);

        if (!isNaN(duration)) {
            for (let i = 1; i <= duration; i++) {
                const courseOption = document.createElement('option');
                courseOption.value = i;
                courseOption.textContent = i;
                coursesSelect.appendChild(courseOption);
            }
        } else {
            console.error('Invalid duration data');
        }
    }




   

});