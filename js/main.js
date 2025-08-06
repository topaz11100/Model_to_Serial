import { cam, frame_id } from './cam.js';
import { ser_send, closePort } from './serial.js'
import { infer_cond } from './infer_cond.js';
import { predict } from './infer.js';

export const UI =
{
    // 시리얼 관련
    ser_on_btn: document.getElementById("ser_on_btn"),
    ser_off_btn: document.getElementById("ser_off_btn"),
    ser_status_text: document.getElementById("ser_status_text"),

    // 웹캠 관련
    cam_on_btn: document.getElementById("cam_on_btn"),
    cam_off_btn: document.getElementById("cam_off_btn"),
    cam_status_text: document.getElementById("cam_status_text"),
    cam_cont: document.getElementById("cam_cont"),

    // 모델 로드 관련
    model_url: document.getElementById("model_url"),
    model_load_btn: document.getElementById("model_load_btn"),
    model_status_text: document.getElementById("model_status_text"),
    label_map_cont: document.getElementById("label_map_cont"),
    label_send_map_cont: document.getElementById("label_send_map"),
    label_send_map_set_btn: document.getElementById("label_send_map_set_btn"),
    
    // 추론 및 결과
    infer_btn: document.getElementById("infer_btn"),
    stop_btn: document.getElementById("stop_btn"),
    result: document.getElementById("result"),
    infer: document.getElementById("infer")
};

async function loop()
{
    if (infer_cond.get_cam())
        cam.update();

    if (!infer_cond.is_stop())
    {
        let send_txt = await predict();
        await ser_send(send_txt);
    }

    frame_id = window.requestAnimationFrame(loop);
}

// 페이지 떠날 때 자원 정리
window.addEventListener("beforeunload", async () => {
    await closePort();
});

export { loop };