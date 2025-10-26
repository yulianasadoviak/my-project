function initImageRotation() {
    const rotateBtn = document.querySelector(".rotate-btn");
    const aboutUsImage = document.getElementById("aboutUsImage");

    if (rotateBtn && aboutUsImage) {
        rotateBtn.addEventListener("click", function () {
            aboutUsImage.classList.toggle("rotated");
        });
    }
}

document.body.addEventListener("htmx:afterOnLoad", function (event) {
    const target = event.detail?.target;
    if (
        target &&
        target.getAttribute("data-hx-get") === "index.about-us.partial.html"
    ) {
        initImageRotation();
    }
});