import { UI, loop } from './main.js';
import { infer_cond } from './infer_cond.js';

UI.cam_on_btn.addEventListener('click', cam_on_btn_click);
UI.cam_off_btn.addEventListener('click', cam_off_btn_click);

let cam, frame_id = null;

async function cam_on_btn_click()
{
    if (infer_cond.get_cam())
        return;

    UI.cam_status_text.textContent = "웹캠 연결 중";
    infer_cond.set_cam(false);
    try
    {
        cam = new tmImage.Webcam(200, 200, true); // width, height, flip
        await cam.setup(); // request access to the webcam
        await cam.play();
        UI.cam_cont.appendChild(cam.canvas);

        UI.cam_status_text.textContent = "웹캠 연결 완료";
        infer_cond.set_cam(true);
        frame_id = window.requestAnimationFrame(loop);
    }
    catch(err)
    {
        UI.cam_status_text.textContent = err.message;
    }
}

async function cam_off_btn_click()
{
    if (!infer_cond.get_cam())
        return;

    UI.cam_status_text.textContent = "웹캠 연결 해제";
    infer_cond.set_cam(false);
    cancelAnimationFrame(frame_id);

    cam.stop();
    while (UI.cam_cont.firstChild)
        UI.cam_cont.removeChild(UI.cam_cont.firstChild);
}

export { cam, frame_id };
