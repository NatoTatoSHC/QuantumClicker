const client = supabase.createClient("https://ywsbaxwlytkjkzhyfzqr.supabase.co", "sb_publishable_C6rZSBHWegX7bzcsv7OGFg_PgJkqTC0");
(async function () {
  const video = document.getElementById("video");
  const barcodeResult = document.getElementById("barcodeResult");

  // Check for BarcodeDetector support
  if (!("BarcodeDetector" in window)) {
    alert("Barcode Detection API is not supported in this browser.");
    return;
  }

  // Initialize the Barcode Detector with supported formats
  const barcodeDetector = new BarcodeDetector({ formats: ["qr_code", "ean_13", "code_128"] });

  try {
    // Access the camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream; // Assign stream to video element
    video.play();

    // Barcode detection loop
    video.addEventListener("play", async () => {
      while (true) {
        try {
          const barcodes = await barcodeDetector.detect(video); // Detect barcodes
          if (barcodes.length > 0) {
            let {data, error} = await client.from("quantum-accounts").upsert([{"id":barcodes[0].rawValue, "data":JSON.parse(localStorage.getItem("quantum_clicker_v1"))}]);
            alert("Saved");
          }
        } catch (err) {
          console.error("Error detecting barcode:", err);
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Add delay for performance
      }
    });
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Unable to access the camera. Please check permissions or run the code on a secure server.");
  }
})();