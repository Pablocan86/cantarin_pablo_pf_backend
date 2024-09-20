document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".deleteButton");

  deleteButtons.forEach((span) => {
    span.addEventListener("click", async () => {
      const messageId = span.getAttribute("data-id");
      const confirmDelete = await Swal.fire({
        text: "¿Desea eliminar el mensaje?",
        color: "white",
        icon: "question",
        iconColor: "white",
        background: "black",
        showCancelButton: true,
        confirmButtonColor: "blue",
        cancelButtonColor: "red",
        confirmButtonText: "Si",
        cancelButtonText: "No",
      });

      if (confirmDelete.isConfirmed) {
        try {
          const response = await fetch(`/messages/${messageId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (response.ok) {
            if (result.message === `Mensaje borrado`) {
              span.parentElement.remove();
            }
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
