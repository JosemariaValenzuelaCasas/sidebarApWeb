document.getElementById("image").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.src = e.target.result;
    imagePreview.style.display = "block";
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});
