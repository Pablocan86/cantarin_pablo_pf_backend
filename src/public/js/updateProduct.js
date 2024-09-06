document.addEventListener("DOMContentLoaded", () => {
  const updateButton = document.querySelector(".updateButton");
  const titleProduct = document.querySelector(".titleProduct");
  const idProduct = document.querySelector(".idProduct");
  const form = document.querySelector(".UpdateProductForm");

  updateButton.addEventListener("click", async () => {
    const confirmUpdate = confirm(`Actualizara ${titleProduct.textContent}`);
    if (confirmUpdate) {
      try {
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());

        const response = await fetch(`/${idProduct.textContent}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataObj),
        });

        if (response.ok) {
          alert("Producto actualizado correctamente");
        } else {
          const errorData = await response.text();
          console.log("Error al actualizar", errorData);
        }

        window.location.reload();
      } catch (error) {
        console.log("No se ha actualizado", error);
      }
    }
  });
});
