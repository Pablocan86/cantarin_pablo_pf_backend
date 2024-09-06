const correo = document.querySelector(".correo").textContent;

document
  .getElementById("changePasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const passwordOne = document.querySelector(
      'input[name="passwordOne"]'
    ).value;
    const passwordRepeat = document.querySelector(
      'input[name="passwordRepeat"]'
    ).value;

    if (passwordOne !== passwordRepeat) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const response = await fetch("/api/sessions/change_password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: passwordOne,
        correo: correo,
      }),
    });

    if (response.ok) {
      alert("Contraseña cambiada con éxito.");
      window.location.href = `/login`;
    } else {
      alert("Esta intentando usar la misma contraseña que ya tiene");
    }
  });
