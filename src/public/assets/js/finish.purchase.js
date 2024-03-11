document.addEventListener("DOMContentLoaded", function () {
  const finishPurchaseButton = document.getElementById("finishPurchaseButton");

  if (finishPurchaseButton) {
    finishPurchaseButton.addEventListener("click", async function () {
      try {
        const existingCartResponse = await fetch(`/api/carts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const existingCartsData = await existingCartResponse.json();

        let cartId;
        const cartIds = existingCartsData.cartIds;

        if (cartIds.length > 0) {
          cartId = cartIds[0];
        } else {
            console.warn("non existent cart")
        }

        const finishPurchaseResponse = await fetch(
          `/api/carts/${cartId}/purchase`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        const finishPurchaseResult = await finishPurchaseResponse.json();
        console.log("Finish Purchase Result:", finishPurchaseResult);

      } catch (error) {
        console.error("Error finishing purchase:", error);
      }
    });
  }
});
