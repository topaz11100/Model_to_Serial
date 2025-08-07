import { UI, loop } from './main.js';
import { infer_cond } from './infer_cond.js';

let cam;

async function cam_btn_click()
{
    UI.cam_btn.disabled = true;
    if (infer_cond.get_cam())
    {
        off();
        updateshape(false);
    }
    else
    {
        on();
        updateshape(true);
    }
    UI.cam_btn.disabled = false;

    async function on()
    {
        if (infer_cond.get_cam())
            return;

        infer_cond.set_cam(false);
        UI.cam_status_text.textContent = "Connecting ...";

        try
        {
            cam = new tmImage.Webcam(200, 200, true); // width, height, flip
            await cam.setup(); // request access to the webcam
            await cam.play();
            UI.cam_cont.appendChild(cam.canvas);

            UI.cam_status_text.textContent = "WebCam Connected";
            infer_cond.set_cam(true);
            window.requestAnimationFrame(loop);
        }
        catch (err)
        {
            UI.cam_status_text.textContent = err.message;
            updateshape(false);
        }
    }

    async function off()
    {
        if (!infer_cond.get_cam())
            return;

        infer_cond.set_cam(false);
        UI.cam_status_text.textContent = "Disconnected";

        cam.stop();
        while (UI.cam_cont.firstChild)
            UI.cam_cont.removeChild(UI.cam_cont.firstChild);
    }

    function updateshape(is_on)
    {
        UI.cam_btn.textContent = is_on ? "Disconnect" : "Connect WebCam";
        UI.cam_btn.classList.toggle("off_btn", is_on);
        UI.cam_btn.classList.toggle("on_btn", !is_on);
    }
}

export { cam, cam_btn_click };
