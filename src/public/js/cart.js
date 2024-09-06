document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".deleteButton");
  const divData = document.querySelector(".productInCart");
  const addQuantity = document.querySelectorAll(".sumar");

  addQuantity.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.getAttribute("data-id");
      const cartId = divData.getAttribute("data-id");

      try {
        const response = await fetch(`/carts/${cartId}/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          window.location.reload();
          return;
        } else {
          alert("No se puede agrear la unidad");
        }
      } catch (error) {
        console.error("No se puede cargar", error);
      }
    });
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.getAttribute("data-id");
      const cartId = divData.getAttribute("data-id");

      try {
        const response = await fetch(`/carts/${cartId}/products/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          window.location.reload();
          return;
          //remover el elemento del DOM
          // button.parentElement.remove();
        } else {
          alert("Error al eliminar el producto");
        }
      } catch (error) {
        console.error("Error", error);
      }
    });
  });
});
