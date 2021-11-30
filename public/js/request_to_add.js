window.onload = () => {
    const nameInpt = document.getElementById("p-name");
    const tickerInpt = document.getElementById("p-ticker");
    const linkInpt = document.getElementById("p-link");
    const sendBtn = document.getElementById("send-button");

    const clearFields = () => {
        nameInpt.value = "";
        tickerInpt.value = "";
        linkInpt.value = "";
    };

    sendBtn.onclick = async () => {
        if (!nameInpt.value || nameInpt.value == "") {
            window.alert("Необходимо указать название проекта!");
            return;
        } else if (!tickerInpt.value || tickerInpt.vale == "") {
            window.alert("Необходимо указать тикер проекта!");
            return;
        } else if (!linkInpt.value || linkInpt.value == "") {
            window.alert("Необходимо указать сайт проекта!");
            return;
        }
        sendBtn.setAttribute("disabled", "true");
    
        const newProjData = {
            name: nameInpt.value,
            ticker: tickerInpt.value,
            link: linkInpt.value
        };
    
        const resp = await fetchDataFrom("/request-to-add", "POST", newProjData);
    
        if (resp.result == "ERROR") {
            window.alert("Сервер вернул ошибку: " + resp.message);
            sendBtn.removeAttribute("disabled");
            return;
        } else if (resp.result == "OK") {
            window.alert("Ваш запрос был успешно отправлен, он будет обработан в ближайшее время!");
            sendBtn.removeAttribute("disabled");
            clearFields();
            return;
        } else {
            window.alert("Неправильный ответ от сервера!");
            sendBtn.removeAttribute("disabled");
            return;
        }


    };
};