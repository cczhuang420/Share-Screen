const videoElement = document.getElementById("video");
const toggleBtn = document.getElementById("toggle-button");
const selectMediaBtn = document.getElementById("select-button");

// pass select and toggle for each button with boolean value
const disableSelectAndToggle = (select, toggle) => {
  selectMediaBtn.disabled = select;
  toggleBtn.disabled = toggle;
};

const setInitialBtns = () => {
  toggleBtn.textContent = "STOP";
  disableSelectAndToggle(false, true);
};

async function checkIfSelected() {
  if (videoElement.srcObject) {
    disableSelectAndToggle(true, false);
    await videoElement.requestPictureInPicture();
  }
}

const handleStopSharingEvent = () => {
  videoElement.srcObject
    .getVideoTracks()[0]
    .addEventListener("ended", async () => {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
      setInitialBtns();
    });
};

const stopCapture = () => {
  let tracks = videoElement.srcObject.getTracks();
  if (tracks) {
    tracks.forEach((element) => element.stop());
    videoElement.srcObject = null;
  }
};

async function selectMediaStream() {
  try {
    videoElement.srcObject = await navigator.mediaDevices.getDisplayMedia();
    videoElement.onloadedmetadata = () => {
      videoElement.play();
      checkIfSelected();
    };
    handleStopSharingEvent();
  } catch (err) {
    console.log(err);
  }
}

// event handling
selectMediaBtn.addEventListener("click", selectMediaStream);

videoElement.addEventListener("leavepictureinpicture", () => {
  setInitialBtns();
  toggleBtn.textContent = "PICTURE IN PICTURE";
  toggleBtn.disabled = false;
});

toggleBtn.addEventListener("click", async () => {
  try {
    if (toggleBtn.textContent === "STOP") {
      await document.exitPictureInPicture();
      stopCapture();
      setInitialBtns();
    } else if (toggleBtn.textContent === "PICTURE IN PICTURE") {
      await videoElement.requestPictureInPicture();
      toggleBtn.textContent = "STOP";
    }
  } catch (err) {
    alert(err);
  }
});
