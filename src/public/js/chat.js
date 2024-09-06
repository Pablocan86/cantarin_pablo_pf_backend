document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".deleteButton");

  deleteButtons.forEach((span) => {
    span.addEventListener("click", async () => {
      const messageId = span.getAttribute("data-id");
      const confirmDelete = confirm(
        "¿Estás seguro de que deseas eliminar este mensaje?"
      );

      if (confirmDelete) {
        try {
          const response = await fetch(`/messages/${messageId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            alert("Mensaje eliminado exitosamente");

            span.parentElement.remove();
          } else {
            alert("Error al eliminar el mensaje");
          }
        } catch (error) {
          alert("Error de red al intentar eliminar el mensaje");
        }
      }
    });
  });
});
