const correo = document.querySelector(".correo").textContent;
const host = window.location.host;
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
      const error = await Swal.fire({
        title: "Las contraseñas no coinciden",
        color: "white",
        icon: "warning",
        iconColor: "yeloww",
        background: "black",
        confirmButtonColor: "blue",
        confirmButtonText: "Ok",
      });
      return;
    }

    const response = await fetch(`/api/sessions/change_password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: passwordOne,
        correo: correo,
      }),
    });
    const result = await response.json();
    if (response.ok) {
      if (result.message === "No se puede utilizar la misma contraseña") {
        const warning = await Swal.fire({
          title: "No puede utilizar la contraseña actual",
          color: "white",
          icon: "warning",
          iconColor: "yeloww",
          background: "black",
          confirmButtonColor: "blue",
          confirmButtonText: "Ok",
        });
        return;
      }
      if (result.message === "Contraseña actualizada correctamente") {
        const warning = await Swal.fire({
          title: result.message,
          color: "white",
          icon: "success",
          iconColor: "green",
          background: "black",
          confirmButtonColor: "blue",
          confirmButtonText: "Ok",
        });
        window.location.href = `http://${host}/login`;
      }
    }
  });
