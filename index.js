// @ts-nocheck

// =====================================================
// ELEMENTS
// =====================================================

const uploadedImageDiv = document.getElementById("uploadedImage");
const fileUpload = document.getElementById("fileUpload");
const cropButton = document.getElementById("cropButton");
const croppedImage = document.getElementById("croppedImage");

let cropper = null;
let myGreatImage = null;


// =====================================================
// FILE UPLOAD
// =====================================================

fileUpload.addEventListener("change", getImage, false);

function getImage() {

    console.log("Image selected:", this.files[0]);

    const imageToProcess = this.files[0];

    // Check if file exists
    if (!imageToProcess) {
        return;
    }

    // Remove previous image
    uploadedImageDiv.innerHTML = "";

    // Create new image
    const newImg = new Image();

    newImg.src = URL.createObjectURL(imageToProcess);

    newImg.id = "myGreatImage";

    // Container size
    uploadedImageDiv.style.width = "250px";
    uploadedImageDiv.style.height = "250px";

    // Add image
    uploadedImageDiv.appendChild(newImg);

    myGreatImage = newImg;

    // Wait until image is loaded
    newImg.onload = function () {
        processImage();
    };
}


// =====================================================
// CROPPER
// =====================================================

function processImage() {

    cropButton.style.display = "block";

    // Destroy previous cropper if it exists
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    cropper = new Cropper(myGreatImage, {

        aspectRatio: 452 / 430,

        autoCropArea: 1,

        background: true,

        movable: false,

        resizable: false,

        checkOrientation: true,

        strict: false,

        guides: true,

        highlight: true,

        dragCrop: false,

        cropBoxResizable: true,

        viewMode: 2,

        data: {
            width: 1080,
            height: 1386
        },

        crop(event) {

            console.log(
                "Crop width:",
                Math.round(event.detail.width),
                "Crop height:",
                Math.round(event.detail.height)
            );

            const canvas = this.cropper.getCroppedCanvas();

            if (canvas) {
                croppedImage.src = canvas.toDataURL("image/png");
            }
        }
    });
}


// =====================================================
// CROP BUTTON
// =====================================================

cropButton.addEventListener("click", cropImage);

function cropImage() {

    if (!cropper) {
        console.log("Cropper is not ready.");
        return;
    }

    const croppedCanvas = cropper.getCroppedCanvas();

    if (!croppedCanvas) {
        console.log("Unable to create cropped canvas.");
        return;
    }

    // Create cropped image
    const imgurl = croppedCanvas.toDataURL("image/png");

    const img = document.createElement("img");

    img.src = imgurl;

    // Add result image
    const cropResult = document.getElementById("cropResult");

    if (cropResult) {
        cropResult.innerHTML = "";
        cropResult.appendChild(img);
    }

    // Update canvas/poster
    draw();
}


// =====================================================
// DRAW FINAL POSTER
// =====================================================

function draw() {

    const canvas = document.getElementById("canvas");

    if (!canvas) {
        console.log("Canvas element not found.");
        return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.log("Canvas context not found.");
        return;
    }


    // -------------------------------------------------
    // CLEAR CANVAS
    // -------------------------------------------------

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // -------------------------------------------------
    // TEXT SETTINGS
    // -------------------------------------------------

    ctx.font = "40px Roboto";

    ctx.textAlign = "center", 345/690;

    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";


    // -------------------------------------------------
    // DRAW CROPPED IMAGE
    // -------------------------------------------------

    const croppedImg = document.getElementById("croppedImage");

    if (croppedImg && croppedImg.src) {

        ctx.drawImage(
            croppedImg,
            90,
            194,
            452,
            430
        );
    }


    // -------------------------------------------------
    // DRAW FRAME
    // -------------------------------------------------

    const frame = document.getElementById("frame");

    if (frame) {

        ctx.drawImage(
            frame,
            0,
            0
        );
    }


    // -------------------------------------------------
    // USERNAME
    // -------------------------------------------------

    const usernameElement =
        document.getElementById("username");

    if (!usernameElement) {
        return;
    }

    const username =
        usernameElement.value.trim();


    if (!username) {
        return;
    }


    // =================================================
    // USERNAME LINE LOGIC
    // =================================================

    /*
        1 - 9 characters
        ----------------
        One line

        10 - 15 characters
        ------------------
        Split at nearest space

        16+ characters
        ---------------
        Split at nearest space

        If there is no space:
        Keep one line.
    */


    if (username.length < 10) {

        // ---------------------------------------------
        // ONE LINE
        // ---------------------------------------------

        ctx.fillText(
            username,
            345,
            690
        );

    } else {

        // ---------------------------------------------
        // FIND SPACE NEAR MIDDLE
        // ---------------------------------------------

        const middle =
            Math.floor(username.length / 2);

        const leftSpace =
            username.lastIndexOf(" ", middle);

        const rightSpace =
            username.indexOf(" ", middle);

        let splitPosition = -1;


        // Space only on right
        if (
            leftSpace === -1 &&
            rightSpace !== -1
        ) {

            splitPosition = rightSpace;
        }


        // Space only on left
        else if (
            rightSpace === -1 &&
            leftSpace !== -1
        ) {

            splitPosition = leftSpace;
        }


        // Spaces on both sides
        else if (
            leftSpace !== -1 &&
            rightSpace !== -1
        ) {

            const leftDistance =
                middle - leftSpace;

            const rightDistance =
                rightSpace - middle;


            if (leftDistance <= rightDistance) {

                splitPosition = leftSpace;

            } else {

                splitPosition = rightSpace;
            }
        }


        // ---------------------------------------------
        // TWO LINE TEXT
        // ---------------------------------------------

        if (splitPosition > 0) {

            const firstLine =
                username
                    .substring(0, splitPosition)
                    .trim();

            const secondLine =
                username
                    .substring(splitPosition)
                    .trim();


            // First line
            ctx.fillText(
                firstLine,
                360,
                665
            );


            // Second line
            ctx.fillText(
                secondLine,
                345,
                710
            );

        }


        // ---------------------------------------------
        // NO SPACE FOUND
        // ---------------------------------------------

        else {

            ctx.fillText(
                username,
                345,
                690
            );
        }
    }
}


// =====================================================
// DOWNLOAD
// =====================================================

let downloadCount =
    Number(
        localStorage.getItem("downloadCount")
    ) || 0;


function download() {

    const downloadButton =
        document.getElementById("download");

    const canvas =
        document.getElementById("canvas");


    if (!canvas || !downloadButton) {
        return;
    }


    const image =
        canvas
            .toDataURL("image/png")
            .replace(
                "image/png",
                "image/octet-stream"
            );


    downloadCount++;

    localStorage.setItem(
        "downloadCount",
        downloadCount
    );


    downloadButton.href = image;

    downloadButton.download =
        `Inspiro_Creates_${downloadCount}.png`;
}


// =====================================================
// SHOW DOWNLOAD BUTTON
// =====================================================

$(function () {

    $("#cropButton").on("click", function () {

        $("#download").show();

    });

});


// =====================================================
// POSTER SHOW / HIDE
// =====================================================

const toggleBtn =
    document.querySelector("#cropButton");

const divList =
    document.querySelector("#poster");


if (toggleBtn && divList) {

    toggleBtn.addEventListener(
        "click",
        function () {

            if (
                divList.style.display === "none"
            ) {

                divList.style.display = "block";

                toggleBtn.innerHTML =
                    "Hide List";

            } else {

                divList.style.display = "none";

                toggleBtn.innerHTML =
                    "Show List";
            }
        }
    );
}


// =====================================================
// HIDE USERNAME / POSTER1
// =====================================================

$(document).ready(function () {

    $("#cropButton").click(function () {

        $("#poster1").hide();

    });

});


// =====================================================
// CLOSE BUTTON - X
// =====================================================

$("#x").click(function () {

    location.reload();

});


// =====================================================
// CLOSE BUTTON
// =====================================================

$("#close").click(function () {

    location.reload();

});


// =====================================================
// DOWNLOAD BUTTON
// =====================================================

$("#download").click(function () {

    location.reload();

});