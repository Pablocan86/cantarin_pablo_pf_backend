document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".deleteButton");
  const titleProduct = document.querySelector(".titleProduct").textContent;
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.getAttribute("data-id");
      const confirmDelete = confirm(
        `¿Estás seguro de que deseas eliminar ${titleProduct} ?`
      );

      if (confirmDelete) {
        try {
          const response = await fetch(`/productsManager/${productId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (response.ok) {
            alert(result.message);
            window.location.reload();
          } else {
            const errorData = await response.text();
            console.log("Error al cambiar rol", errorData);
          }
        } catch (error) {
          alert("Error de red al intentar eliminar el producto");
        }
      }
    });
  });
});
