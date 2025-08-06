import { model_load_btn_click, label_send_map_set_btn_click } from './model_load.js'
import { cam, cam_btn_click } from './cam.js';
import { ser_send, closePort, ser_btn_click} from './serial.js'
import { infer_cond } from './infer_cond.js';
import { predict, infer_btn_click} from './infer.js';

export const UI =
{
    // 시리얼 관련
    ser_btn: document.getElementById("ser_btn"),
    ser_status_text: document.getElementById("ser_status_text"),

    // 웹캠 관련
    cam_btn: document.getElementById("cam_btn"),
    cam_status_text: document.getElementById("cam_status_text"),
    cam_cont: document.getElementById("cam_cont"),

    // 모델 로드 관련
    model_url: document.getElementById("model_url"),
    model_load_btn: document.getElementById("model_load_btn"),
    model_status_text: document.getElementById("model_status_text"),
    label_map_cont: document.getElementById("label_map_cont"),
    label_send_map_cont: document.getElementById("label_send_map"),
    label_send_map_set_btn: document.getElementById("label_send_map_set_btn"),
    label_send_map_status_text: document.getElementById("label_send_map_status_text"),
    
    // 추론 및 결과
    infer_btn: document.getElementById("infer_btn"),
    result: document.getElementById("result"),
    infer: document.getElementById("infer")
};

UI.ser_btn.addEventListener('click', ser_btn_click);
UI.cam_btn.addEventListener('click', cam_btn_click);
UI.model_load_btn.addEventListener('click', model_load_btn_click);
UI.label_send_map_set_btn.addEventListener('click', label_send_map_set_btn_click);
UI.infer_btn.addEventListener('click', infer_btn_click);

async function loop()
{
    if (infer_cond.get_cam())
        cam.update();
    else
        return;

    if (infer_cond.get_infer() && !infer_cond.is_stop())
    {
        let send_txt = await predict();
        await ser_send(send_txt);
    }

    window.requestAnimationFrame(loop);
}

// 페이지 떠날 때 자원 정리
window.addEventListener("beforeunload", async () => {
    cam.stop();
    await closePort();
});

export { loop };