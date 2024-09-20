document.addEventListener("DOMContentLoaded", () => {
  const updateButton = document.querySelector(".updateButton");
  const titleProduct = document.querySelector(".titleProduct");
  const idProduct = document.querySelector(".idProduct");
  const form = document.querySelector(".UpdateProductForm");

  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const host = window.location.host;
    const confirmUpdate = await Swal.fire({
      title: `Actualizar Producto: ${titleProduct.textContent}`,
      text: "¿Desea actualizar el producto?",
      icon: "question",
      iconColor: "white",
      background: "black",
      showCancelButton: true,
      confirmButtonColor: "blue",
      cancelButtonColor: "red",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    });

    if (confirmUpdate.isConfirmed) {
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
          await Swal.fire({
            text: `Producto actualizado `,
            icon: "success",
            iconColor: "blue",
            background: "black",
            cancelButton: false,
            confirmButtonColor: "blue",
            confirmButtonText: "Ok",
          });

          window.location.href = `http://${host}/updateproducts/${idProduct.textContent}`;
        } else {
          const errorData = await response.text();
          await Swal.fire({
            text: `Producto ${titleProduct.textContent} no se puede actualizar`,
            icon: "warnign",
            iconColor: "red",
            background: "black",
            cancelButton: false,
            confirmButtonColor: "blue",
            confirmButtonText: "Ok",
          });
        }
      } catch (error) {
        console.log("No se ha actualizado", error);
      }
    }
  });
});
