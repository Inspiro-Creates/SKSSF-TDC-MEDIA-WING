// =====================================================
// ELEMENTS
// =====================================================

const uploadedImageDiv =
    document.getElementById("uploadedImage");

const fileUpload =
    document.getElementById("fileUpload");

const cropButton =
    document.getElementById("cropButton");

const croppedImage =
    document.getElementById("croppedImage");

let cropper = null;
let myGreatImage = null;
let imageObjectURL = null;


// =====================================================
// FILE UPLOAD
// =====================================================

if (fileUpload) {

    fileUpload.addEventListener(
        "change",
        getImage,
        false
    );
}


function getImage(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    // No image selected
    if (!file) {
        return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {

        console.log("Please select an image file.");

        fileUpload.value = "";

        return;
    }

    console.log(
        "Image selected:",
        file.name
    );


    // -------------------------------------------------
    // DESTROY PREVIOUS CROPPER
    // -------------------------------------------------

    if (cropper) {

        cropper.destroy();

        cropper = null;
    }


    // -------------------------------------------------
    // REMOVE PREVIOUS IMAGE
    // -------------------------------------------------

    if (uploadedImageDiv) {

        uploadedImageDiv.innerHTML = "";

        uploadedImageDiv.style.width =
            "250px";

        uploadedImageDiv.style.height =
            "250px";
    }


    // -------------------------------------------------
    // REMOVE PREVIOUS OBJECT URL
    // -------------------------------------------------

    if (imageObjectURL) {

        URL.revokeObjectURL(
            imageObjectURL
        );
    }


    // -------------------------------------------------
    // CREATE IMAGE URL
    // -------------------------------------------------

    imageObjectURL =
        URL.createObjectURL(file);


    // -------------------------------------------------
    // CREATE IMAGE
    // -------------------------------------------------

    const newImg =
        new Image();

    newImg.id =
        "myGreatImage";

    newImg.src =
        imageObjectURL;

    newImg.style.maxWidth =
        "100%";

    newImg.style.display =
        "block";


    // -------------------------------------------------
    // ADD IMAGE TO UPLOAD AREA
    // -------------------------------------------------

    if (uploadedImageDiv) {

        uploadedImageDiv.appendChild(
            newImg
        );
    }


    myGreatImage =
        newImg;


    // -------------------------------------------------
    // WAIT FOR IMAGE TO LOAD
    // -------------------------------------------------

    newImg.onload =
        function () {

            console.log(
                "Image loaded successfully."
            );

            processImage();
        };


    newImg.onerror =
        function () {

            console.log(
                "Unable to load image."
            );

        };
}