const wcam = document.getElementById("cam");

const cam_on_btn = document.getElementById("cam_on_btn");
cam_on_btn.addEventListener('click', cam_on_btn_click);

const cam_off_btn = document.getElementById("cam_off_btn");
cam_off_btn.addEventListener('click', cam_off_btn_click);

const cam_status_text = document.getElementById("cam_status_text");

let cam;

async function cam_on_btn_click()
{
    cam_status_text.textContent = "웹캠 연결 중";
    infer_cond.set_cam(false);
    try
    {
        cam = new tmImage.Webcam(200, 200, true); // width, height, flip
        await cam.setup(); // request access to the webcam
        await cam.play();
        wcam.appendChild(cam.canvas);

        cam_status_text.textContent = "웹캠 연결 완료";
        infer_cond.set_cam(true);
    }
    catch(err)
    {
        cam_status_text.textContent = err.message;
    }
}

async function cam_off_btn_click()
{
    cam_status_text.textContent = "웹캠 연결 해제";
    infer_cond.set_cam(false);
    cam.stop();
    while (wcam.firstChild)
        wcam.removeChild(wcam.firstChild);
}
