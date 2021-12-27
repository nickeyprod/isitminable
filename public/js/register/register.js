
window.onload = () => {
    const nickname = document.getElementById("nickname-inpt");
    const email = document.getElementById("email-inpt");
    const password = document.getElementById("password-inpt");
    const passwordRepeat = document.getElementById("repeat-pass-inpt");
    const registerBtn = document.getElementById("register-btn");


    registerBtn.onclick = async () => {
        if (!nickname.value || nickname.value == "") {
            window.alert("Чтобы продолжить, введите Никнейм.");
            return;
        } else if (!email.value || email.value == "") {
            window.alert("Чтобы продолжить, введите ваш Email.");
            return;
        } else if (!password.value || password.value == "") {
            window.alert("Чтобы продолжить, придумайте и введите пароль.");
            return;
        } else if (!passwordRepeat.value || passwordRepeat.value == "") {
            window.alert("Чтобы продолжить, введите свой пароль повторно.");
            return;
        } else if (password.value !== passwordRepeat.value) {
            window.alert("Введённые вами пароли не сопадают, проверьте правильность написания.");
            return;
        }
    
        const regData = {
            nickname: nickname.value,
            email: email.value,
            password: password.value,
            passwordRepeat: passwordRepeat.value
        };

        registerBtn.setAttribute("disabled", "true");    

        const resp = await fetchDataFrom("/register", "POST", regData);

        if (resp.result == "ERROR") {
            window.alert("Сервер вернул ошибку: " + resp.message);
            registerBtn.removeAttribute("disabled");
            return;
        } else if (resp.result == "OK") {
            window.alert("Регистрация успешна! Теперь вы можете войти в свой аккаунт.");
            window.location.href = "/";
            return;
        } else {
            window.alert("Неправильный ответ от сервера!");
            registerBtn.removeAttribute("disabled");
            return;
        }
    };
};