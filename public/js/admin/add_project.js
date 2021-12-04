window.onload = () => {
    const addProjBtn = document.getElementById("add-proj-btn");
    const projectName = document.getElementById("proj-name-inpt");
    const projectTicker = document.getElementById("proj-ticker-inpt");
    const projectLink = document.getElementById("proj-link-inpt");

    // mining type inputs
    const vcard = document.getElementById("vcard-inpt");
    const cpu = document.getElementById("cpu-inpt");
    const ssd = document.getElementById("ssd-inpt");

    const getMiningTypes = () => {
        const miningTypeInpts = [ vcard, cpu, ssd ];
        const miningTypes = [];
        for (let i = 0; i < miningTypeInpts.length; i++) {
            if (miningTypeInpts[i].checked) {
                miningTypes.push(miningTypeInpts[i].value);
            }
        }
        return miningTypes;
    };

    addProjBtn.onclick = async () => {
        addProjBtn.setAttribute("disabled", "true");

        if (!projectName.value || projectName.value == "") {
            addProjBtn.removeAttribute("disabled");
            window.alert("Поле 'Название' не может быть пустым");
            return;
        } else if (!projectTicker.value || projectTicker.value == "") {
            addProjBtn.removeAttribute("disabled");
            window.alert("Поле 'Тикер' не может быть пустым");
            return;
        } else if (getMiningTypes().length == 0) {
            addProjBtn.removeAttribute("disabled");
            window.alert("Не выбран 'Тип майнинга'");
            return;
        }

        const newProjectData = {
            name: projectName.value,
            ticker: projectTicker.value,
            link: projectLink.value,
            minable_via: getMiningTypes()
        };

        const resp = await fetchDataFrom("/panel/add-project", "POST", newProjectData);

        if (resp.result == "ERROR") {
            window.alert("Сервер вернул ошибку: " + resp.message);
            addProjBtn.removeAttribute("disabled");
            return;
        } else if (resp.result == "OK") {
            window.alert("Проект был успешно добавлен!");
            addProjBtn.removeAttribute("disabled");
            clearFields();
            return;
        } else {
            window.alert("Неправильный ответ от сервера!");
            addProjBtn.removeAttribute("disabled");
            return;
        }
    };

    const clearFields = () => {
        projectName.value = "";
        projectTicker.value = "";
        projectLink.value = "";
    };
}