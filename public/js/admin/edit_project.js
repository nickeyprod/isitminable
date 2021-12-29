window.onload = () => {
    const saveProjBtn = document.getElementById("save-proj-btn");
    const projectName = document.getElementById("proj-name-inpt");
    const projectTicker = document.getElementById("proj-ticker-inpt");
    const projectLink = document.getElementById("proj-link-inpt");
    const projectId = document.getElementById("proj-id-inpt");

    // mining type inputs
    const vcard = document.getElementById("vcard-inpt");
    const cpu = document.getElementById("cpu-inpt");
    const ssd = document.getElementById("ssd-inpt");
    const mob = document.getElementById("mob-inpt");


    for (let i = 0; i < miningTypes.length; i++) {
        if (miningTypes[i] == "vcard") {
            vcard.checked = true;
        } 
        else if (miningTypes[i] == "cpu") {
            cpu.checked = true;
        }
        else if (miningTypes[i] == "ssd") {
            ssd.checked = true;
        }
        else if (miningTypes[i] == "mob") {
            mob.checked = true;
        }
    }

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

    saveProjBtn.onclick = async () => {
        saveProjBtn.setAttribute("disabled", "true");

        if (!projectId.value || projectId.value == "" ) {
            addProjBtn.removeAttribute("disabled");
            window.alert("Отсутствует ID проекта!");
            return;
        } else if (!projectName.value || projectName.value == "") {
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
            _id: projectId.value,
            name: projectName.value,
            ticker: projectTicker.value,
            link: projectLink.value,
            minable_via: getMiningTypes()
        };

        const resp = await fetchDataFrom("/panel/edit-project", "POST", newProjectData);

        if (resp.result == "ERROR") {
            window.alert("Сервер вернул ошибку: " + resp.message);
            saveProjBtn.removeAttribute("disabled");
            return;
        } else if (resp.result == "OK") {
            window.alert("Проект был успешно обновлен и сохранён!");
            saveProjBtn.removeAttribute("disabled");
            return;
        } else {
            window.alert("Неправильный ответ от сервера!");
            saveProjBtn.removeAttribute("disabled");
            return;
        }
    };
}