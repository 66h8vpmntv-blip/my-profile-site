function showMessage() {
    document.getElementById("message").textContent =
        "プロフィールを見てくれてありがとう！";
}

let colorNumber = 0;

function changeColor() {
    if (colorNumber === 0) {
        document.body.style.backgroundColor = "lightpink";
        colorNumber = 1;
    } else if (colorNumber === 1) {
        document.body.style.backgroundColor = "lightgreen";
        colorNumber = 2;
    } else {
        document.body.style.backgroundColor = "lightblue";
        colorNumber = 0;
    }
}

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");

imageInput.addEventListener("change", function() {
    const file = imageInput.files[0];

    if (file) {
        const imageURL = URL.createObjectURL(file);
        previewImage.src = imageURL;
    }
});
