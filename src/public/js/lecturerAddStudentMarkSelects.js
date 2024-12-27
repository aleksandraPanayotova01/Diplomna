// document.addEventListener('DOMContentLoaded', async () => {
//     async function fetchSpecialties() {
//         try {
//             const response = await fetch(`/lecturer/get/specialties`);
//             const specialties = await response.json();
//             populateSpecialtiesSelect('selectSpecialties', specialties);
//         } catch (error) {
//             console.error('Error fetching specialties:', error);
//         }
//     }
//     await fetchSpecialties();
//     async function fetchMarks() {
//         try {
//             const response = await fetch(`/lecturer/get/marks`);
//             const marks = await response.json();
//             populateMarksSelect('selectMarks', marks);
//         } catch (error) {
//             console.error('Error fetching marks:', error);
//         }
//     }
//     async function fetchSubjects() {
//         try {
//             const response = await fetch(`/lecturer/get/subjects`);
//             const subjects = await response.json();
//             populateSubjectSelect('selectSubject', subjects);
//         } catch (error) {
//             console.error('Error fetching subjects:', error);
//         }
//     }
//     // await fetchSubjects()

//     async function fetchGroups(subject_id) {
//         try {
//             const response = await fetch(`/lecturer/get/groups/${subject_id}`);
//             const groups = await response.json();
//             console.log("Groups:", groups);
//             populateGroupSelect('selectGroup', groups);
//         } catch (error) {
//             console.error('Error fetching groups:', error);
//         }
//     }



//     async function fetchFacultyNumbers(groupHalf) {
//         // const subjectId = document.getElementById('selectSubject').value;
//         // if (!subjectId) return;

//         try {
//             const response = await fetch(`/lecturer/get/groupfacNums/${groupHalf}`);
//             const facultyNumbers = await response.json();
//             populateFacultyNumsSelect('selectFacultyNumber', facultyNumbers);
//         } catch (error) {
//             console.error('Error fetching faculty numbers:', error);
//         }
//     }

//     function populateSpecialtiesSelect(selectId, items) {
//         const select = document.getElementById(selectId);
//         console.log(select);
//         select.innerHTML = '<option value="">Изберете специалност</option>';

//         items.forEach(item => {
//             const option = document.createElement('option');
//             option.value = item.specialty_id; // Adjust according to your data structure
//             option.textContent = item.specialty_name; // Adjust according to your data structure
//             select.appendChild(option);
//         });

//     }
//     function populateMarksSelect(selectId, items) {
//         const select = document.getElementById(selectId);
//         console.log(select);
//         select.innerHTML = '<option value="">Изберете оценка</option>';

//         items.forEach(item => {
//             const option = document.createElement('option');
//             option.value = item.specialty_id; // Adjust according to your data structure
//             option.textContent = item.specialty_name; // Adjust according to your data structure
//             select.appendChild(option);
//         });

//     }
//     function populateFacultyNumsSelect(selectId, items) {
//         const select = document.getElementById(selectId);
//         console.log(select);
//         select.innerHTML = '<option value="">Изберете ФН</option>';

//         items.forEach(item => {
//             const option = document.createElement('option');
//             option.value = item.student_fac_num; // Adjust according to your data structure
//             option.textContent = item.student_fac_num; // Adjust according to your data structure
//             select.appendChild(option);
//         });

//     }

//     function populateGroupSelect(selectId, items) {
//         const select = document.getElementById(selectId);
//         console.log(select);
//         select.innerHTML = '<option value="">Изберете група</option>';

//         items.forEach(item => {
//             const option = document.createElement('option');
//             option.value = item.group_half_id; // Adjust according to your data structure
//             option.textContent = item.group_number + item.group_half_letter; // Adjust according to your data structure
//             select.appendChild(option);
//         });
//         select.addEventListener("change", async function () {
//             // console.log(select.value);
//             await fetchFacultyNumbers(select.value);

//         })
//     }
//     async function populateSubjectSelect(selectId, items) {
//         const select = document.getElementById(selectId);
//         console.log(select);
//         select.innerHTML = '<option value="">Изберете предмет</option>';

//         items.forEach(item => {
//             const option = document.createElement('option');
//             option.value = item.subject_id; // Adjust according to your data structure
//             option.textContent = item.subject_name; // Adjust according to your data structure
//             select.appendChild(option);
//         });
//         select.addEventListener("change", async function () {
//             // console.log(select.value);
//             await fetchGroups(select.value);

//         })
//     }

// })
document.addEventListener("DOMContentLoaded", async function () {
    const getDepartments = async () => {
        try {
            const response = await fetch(`/lecturer/get/departments`, {
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
            const response = await fetch(`/lecturer/get/specialties`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    };
    const getGroupHalfs = async (specialty, course) => {
        try {
            const response = await fetch(`/lecturer/get/groupHalfs`, {
                method: "POST",
                body: JSON.stringify({ specialty, course }),
                headers: { 'Content-Type': 'application/json' }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching group halves:', error);
        }
    };
    async function fetchMarksAndCreateSelect() {
        try {
            const response = await fetch(`/lecturer/get/marks`);
            const marks = await response.json();
            await createMarksSelect(marks);
        } catch (error) {
            console.error('Error fetching marks:', error);
        }
    }

    async function fetchAndCreateSubjectSelect(groupHalfId) {
        try {
            const response = await fetch(`/lecturer/get/subjectsHalf`, {
                method: "POST",
                body: JSON.stringify({ groupHalfId }),
                headers: { 'Content-Type': 'application/json' }
            });

            const subjectsHalf = await response.json();
            createSubjectSelect(subjectsHalf);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }

    async function fetchAndCreateFacNums(groupHalfId) {
        try {
            const response = await fetch(`/lecturer/get/facultyNumbers`, {
                method: "POST",
                body: JSON.stringify({ groupHalfId }),
                headers: { 'Content-Type': 'application/json' }
            });

            const facultyNumbers = await response.json();
            createFacNumsSelect(facultyNumbers);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    }
    const facultyChosen = document.querySelector('#selectFaculty');
    const departmentsInFaculty = document.querySelector('#selectDepartment');
    const departments = await getDepartments();
    const specialties = await getSpecialties();
    console.log(specialties);
    const departmentChosen = document.querySelector('#selectDepartment');
    const specialtiesInDepartment = document.querySelector('#selectSpecialty');
    const coursesSelect = document.querySelector("#selectCourse");
    // const titleChosen = document.querySelector('#selectTitle');//for lecturer
    // const titles = await getLecturerTitles();//for lecturer
    // console.log(departments);//shows all departments in the db in the console
    const facultyFirstOption = facultyChosen.options[0];
    // console.log(firstOption.value);// to get abbreviation of fita- the first option of the faculty select
    createDepartmentOptions(facultyFirstOption.value);
    // console.log(specialties);
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


    // async function fetchAndCreateMarksSelect() {
    //     try {
    //         const response = await fetch(`/admin/get/marks`);
    //         const marks = await response.json();
    //         createMarksSelect(marks);
    //     } catch (error) {
    //         console.error('Error fetching marks:', error);
    //     }
    // };


    const specialtySelect = document.querySelector("#selectSpecialty");
    const courseSelect = document.querySelector("#selectCourse");
    let specialty;

    specialtySelect.addEventListener("change", async function () {
        specialty = specialtySelect.value;
    });

    courseSelect.addEventListener("change", async function () {
        const groupHalfs = await getGroupHalfs(specialty, courseSelect.value);
        await createGroupHalfInputs(groupHalfs);

        const subjectSelect = document.querySelector(".subject");
        const periodDiv = document.querySelector(".period");

        if (subjectSelect != null) {
            subjectSelect.remove();
        }

        if (periodDiv != null) {
            periodDiv.remove();
        }

        console.log(groupHalfs);
    });

    async function createGroupHalfInputs(groupHalfs) {
        const form = document.querySelector("#addMarkForm");

        // Remove existing elements
        const existingGroupNumberDiv = form.querySelector('.formInput.groupNumber');
        if (existingGroupNumberDiv) existingGroupNumberDiv.remove();

        const existingGroupHalfDiv = form.querySelector('.formInput.groupHalf');
        if (existingGroupHalfDiv) existingGroupHalfDiv.remove();

        // Create and append the group number select
        const groupNumberDiv = document.createElement("div");
        groupNumberDiv.classList.add("formInput", "groupNumber");

        const labelGroupNumberSelect = document.createElement('label');
        labelGroupNumberSelect.textContent = "Група";
        groupNumberDiv.appendChild(labelGroupNumberSelect);

        const groupNumberSelect = document.createElement('select');
        groupNumberSelect.name = "selectGroup";
        groupNumberSelect.classList.add("selectGroup");
        groupNumberDiv.appendChild(groupNumberSelect);

        const defaultOption = document.createElement('option');
        defaultOption.textContent = "Изберете група";
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        groupNumberSelect.appendChild(defaultOption);

        const uniqueGroupNumbers = [...new Set(groupHalfs.map(gh => gh.group_number))];
        for (const groupNumber of uniqueGroupNumbers) {
            const groupNumberOption = document.createElement('option');
            groupNumberOption.textContent = groupNumber;
            groupNumberOption.value = groupNumber;
            groupNumberSelect.appendChild(groupNumberOption);
        }

        form.appendChild(groupNumberDiv);

        groupNumberSelect.addEventListener("change", async function () {
            const selectedGroupNumber = groupNumberSelect.value;
            await createGroupHalfInput(groupHalfs, selectedGroupNumber);
        });
    }

    async function createGroupHalfInput(groupHalfs, selectedGroupNumber) {
        const form = document.querySelector("#addMarkForm");

        const existingGroupHalfDiv = form.querySelector('.formInput.groupHalf');
        if (existingGroupHalfDiv) existingGroupHalfDiv.remove();

        const filteredGroupHalfs = groupHalfs.filter(gh => gh.group_number === Number(selectedGroupNumber));

        if (filteredGroupHalfs.length > 0) {
            const groupHalfDiv = document.createElement("div");
            groupHalfDiv.classList.add("formInput", "groupHalf");

            const labelGroupHalfSelect = document.createElement('label');
            labelGroupHalfSelect.textContent = "Половинка";
            groupHalfDiv.appendChild(labelGroupHalfSelect);

            const groupHalfSelect = document.createElement('select');
            groupHalfSelect.name = "selectGroupHalf";
            groupHalfSelect.classList.add("selectGroupHalf");
            groupHalfDiv.appendChild(groupHalfSelect);

            const defaultOption = document.createElement('option');
            defaultOption.textContent = "Изберете половинка";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            groupHalfSelect.appendChild(defaultOption);

            for (const groupHalf of filteredGroupHalfs) {
                const groupHalfOption = document.createElement('option');
                groupHalfOption.textContent = groupHalf.group_half_letter;
                groupHalfOption.value = groupHalf.group_half_id;
                groupHalfSelect.appendChild(groupHalfOption);
            }

            form.appendChild(groupHalfDiv);

            groupHalfSelect.addEventListener("change", async function () {
                const selectedGroupHalfId = groupHalfSelect.value;
                await fetchAndCreateSubjectSelect(selectedGroupHalfId);
                await fetchAndCreateFacNums(selectedGroupHalfId);
            });
        }
    }

    function createSubjectSelect(subjectsHalf) {
        const form = document.querySelector("#addMarkForm");

        const existingSubjectDiv = form.querySelector('.formInput.subject');
        if (existingSubjectDiv) existingSubjectDiv.remove();

        const subjectDiv = document.createElement("div");
        subjectDiv.classList.add("formInput", "subject");

        const labelSubjectSelect = document.createElement('label');
        labelSubjectSelect.textContent = "Предмет";
        subjectDiv.appendChild(labelSubjectSelect);

        const subjectSelect = document.createElement('select');
        subjectSelect.name = "selectSubject";
        subjectSelect.id = "selectSubject"; // Ensure unique IDs
        subjectSelect.classList.add("selectSubject");
        subjectDiv.appendChild(subjectSelect);

        const defaultSubjectOption = document.createElement('option');
        defaultSubjectOption.textContent = "Изберете предмет";
        defaultSubjectOption.value = "";
        defaultSubjectOption.disabled = true;
        defaultSubjectOption.selected = true;
        subjectSelect.appendChild(defaultSubjectOption);

        subjectsHalf.forEach(subjectHalf => {
            const subjectOption = document.createElement('option');
            subjectOption.textContent = subjectHalf.subject_name;
            subjectOption.value = subjectHalf.subject_id;
            subjectSelect.appendChild(subjectOption);
        });

        form.appendChild(subjectDiv);
        subjectSelect.addEventListener('change', handleSubjectChange);
    }

    async function handleSubjectChange(event) {
        const selectedSubjectId = event.target.value;
        if (selectedSubjectId) {
            // await createPeriodTypeSelect();
        } else {
            // Remove existing period inputs if subject is deselected
            const existingPeriodDiv = document.querySelector('.formInput.period');
            if (existingPeriodDiv) existingPeriodDiv.remove();
        }
    }

    async function createFacNumsSelect(facultyNumbers) {
        const form = document.querySelector("#addMarkForm");
        const existingFacultyNumbersDiv = form.querySelector('.formInput.faculty_numbers');
        if (existingFacultyNumbersDiv) existingFacultyNumbersDiv.remove();

        const facultyNumbersDiv = document.createElement("div");
        facultyNumbersDiv.classList.add("formInput", "faculty_numbers");

        const labelFacultyNumbersSelect = document.createElement('label');
        labelFacultyNumbersSelect.textContent = "Факултетни номера";
        facultyNumbersDiv.appendChild(labelFacultyNumbersSelect);

        const facultyNumbersSelect = document.createElement('select');
        facultyNumbersSelect.name = "facultyNumbersSelect";
        facultyNumbersSelect.id = "facultyNumbersSelect";
        facultyNumbersSelect.classList.add("facultyNumbersSelect");
        facultyNumbersDiv.appendChild(facultyNumbersSelect);

        const defaultFacultyNumbersOption = document.createElement('option');
        defaultFacultyNumbersOption.textContent = "Изберете факултетен номер";
        defaultFacultyNumbersOption.value = "";
        defaultFacultyNumbersOption.disabled = true;
        defaultFacultyNumbersOption.selected = true;
        facultyNumbersSelect.appendChild(defaultFacultyNumbersOption);

        facultyNumbers.forEach(facultyNumber => {
            const facultyNumberOption = document.createElement('option');
            facultyNumberOption.textContent = facultyNumber.student_fac_num;
            facultyNumberOption.value = facultyNumber.student_fac_num;
            facultyNumbersSelect.appendChild(facultyNumberOption);
        });
        form.appendChild(facultyNumbersDiv);
        await fetchMarksAndCreateSelect();

    }

    async function createMarksSelect(marks) {
        try {
            const form = document.querySelector("#addMarkForm");

            // Create the marks select div
            const marksDiv = document.createElement("div");
            marksDiv.classList.add("formInput", "marks");
            // const facultyNumbersDiv = document.createElement("div");
            // facultyNumbersDiv.classList.add("formInput", "faculty_numbers");

            const labelMarksSelect = document.createElement('label');
            labelMarksSelect.textContent = "Оценка";
            marksDiv.appendChild(labelMarksSelect);

            const marksSelect = document.createElement('select');
            marksSelect.name = "selectMarks";
            marksSelect.classList.add("selectMarks");
            marksDiv.appendChild(marksSelect);

            const defaultOption = document.createElement('option');
            defaultOption.textContent = "Изберете оценка";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            marksSelect.appendChild(defaultOption);

            // Append each mark to the select element
            marks.forEach(mark => {
                const option = document.createElement('option');
                option.textContent = mark.mark_value;
                option.value = mark.mark_id;
                marksSelect.appendChild(option);
            });

            // Append the marksDiv to the form
            form.appendChild(marksDiv);
            marksDiv.appendChild(document.createElement("br"));

            // Create and append the submit button to the marksDiv
            createSubmitButton(marksDiv);

        } catch (error) {
            console.error('Error creating marks select:', error);
        }
    }

    function createSubmitButton(parentDiv) {
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Добавяне на оценка';
        submitButton.classList.add('submit');
        parentDiv.appendChild(submitButton);

        return submitButton;
    }



});