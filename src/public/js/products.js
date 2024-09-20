document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".deleteButton");
  const titleProduct = document.querySelector(".titleProduct").textContent;
  deleteButtons.forEach((button) => {
    const host = window.location.host;
    button.addEventListener("click", async () => {
      const productId = button.getAttribute("data-id");
      const confirmDelete = await Swal.fire({
        title: `Eliminar Producto: ${titleProduct}`,
        text: "¿Desea eliminar el producto?",
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
          const response = await fetch(`/productsManager/${productId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (response.ok) {
            await Swal.fire({
              text: "Producto eliminado",
              icon: "success",
              iconColor: "blue",
              background: "black",
              cancelButton: false,
              confirmButtonColor: "blue",
              confirmButtonText: "Ok",
            });
            window.location.href = `http://${host}/productsManager`;
          } else {
            const errorData = await response.text();
            console.log("Error al elminar el producto", errorData);
          }
        } catch (error) {
          alert("Error de red al intentar eliminar el producto");
        }
      }
    });
  });
});
