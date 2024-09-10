document.addEventListener("DOMContentLoaded", () => {
  const changeButton = document.querySelector(".changeButton");
  const deleteUser = document.querySelector(".deleteUser");
  const path = window.location.pathname;
  const segment = path.split("/");
  const uid = segment[4];

  deleteUser.addEventListener("click", async () => {
    const host = window.location.host;
    const confirmUpdate = await Swal.fire({
      title: "Elimninar Usuario",
      text: "¿Desea eliminar el usuario?",
      icon: "question",
      iconColor: "white",
      background: "black",
      showCancelButton: true,
      confirmButtonColor: "blue",
      cancelButtonColor: "red",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    });
    const userId = changeButton.getAttribute("data-id");
    if (confirmUpdate.isConfirmed) {
      try {
        const response = await fetch(`../${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (response.ok) {
          if (result.message === "Usuario eliminado") {
            const confirmate = await Swal.fire({
              background: "black",
              color: "white",
              text: result.message,
              icon: "success",
              iconColor: "blue",
              confirmButtonText: "OK",
              confirmButtonColor: "blue",
            });
            if (confirmate.isConfirmed) {
              window.location.href = `http://${host}/api/users`;
            }
          }
        }
      } catch (error) {}
    }
  });

  changeButton.addEventListener("click", async () => {
    const confirmUpdate = await Swal.fire({
      title: "¿Estas seguro?",
      text: "¿Deseas cambiar el rol del usuario?",
      icon: "question",
      iconColor: "white",
      color: "white",
      background: "black",
      showCancelButton: false,
      confirmButtonColor: "blue",
      confirmButtonText: "Si",
    });
    const userId = changeButton.getAttribute("data-id");
    if (confirmUpdate) {
      try {
        const response = await fetch(`./${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (response.ok) {
          if (result.message === "Falta cargar documentación") {
            await Swal.fire({
              title: "¡Acción denegada!",
              background: "black",
              color: "white",
              text: result.message,
              icon: "error",
              iconColor: "red",
              confirmButtonText: "OK",
              confirmButtonColor: "blue",
            });
          } else if (result.message === "Se ha cambiado el rol") {
            await Swal.fire({
              title: "¡Éxito!",
              background: "black",
              text: result.message,
              icon: "success",
              confirmButtonText: "OK",
            });
          }
          window.location.reload();
        } else {
          const errorData = await response.text();
          console.log("Error al cambiar rol", errorData);
          await Swal.fire({
            title: "Error",
            background: "black",
            text: "Hubo un problema al cambiar el rol.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.log("No se ha cambiado rol", error);
        await Swal.fire({
          title: "Error",
          background: "black",
          text: "No se pudo cambiar el rol debido a un error.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  });
});
