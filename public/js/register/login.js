window.onload = () => {
    const emailOrNick = document.getElementById("nick-email-inpt");
    const password = document.getElementById("password-inpt");
    const loginBtn = document.getElementById("login-btn");
    const showPass = document.getElementById("show-pass");
    const remember = document.getElementById("remember");

    window.onkeyup = (e) => {
        if (e.keyCode == 13) {
            loginBtn.click();
        }
    }

    showPass.onclick = () => {
        if (showPass.checked === true) {
            password.setAttribute("type", "text");
        } else {
            password.setAttribute("type", "password");
        }
    };

    loginBtn.onclick = async () => {
        if (!emailOrNick.value || emailOrNick.value == "") {
            window.alert("Вы не ввели Email/Никнейм");
            return;
        } else if (!password.value || password.value == "") {
            window.alert("Вы не ввели пароль");
            return;
        }


        const loginData = {
            emailOrNick: emailOrNick.value,
            password: password.value,
            remember: remember.checked
        };

        loginBtn.setAttribute("disabled", "true");    

        const resp = await fetchDataFrom("/login", "POST", loginData);

        if (resp.result == "ERROR") {
            window.alert("Сервер вернул ошибку: " + resp.message);
            loginBtn.removeAttribute("disabled");
            return;
        } else if (resp.result == "Authorised") {
            if (remember.checked === true) {
                window.alert("Успешный вход. Сессия будет действительна 30 дней.");
            } else {
                window.alert("Успешный вход. Сессия будет действительна 24 часа.");
            }
            window.location.href = "/";
            return;
        } else if (resp.result == "Wrong credentials") {
            window.alert("Неверный логин или пароль. Проверьте правильность написания.");
            loginBtn.removeAttribute("disabled");    
            return;
        }
        else {
            window.alert("Неправильный ответ от сервера!");
            loginBtn.removeAttribute("disabled");
            return;
        }
    };
};