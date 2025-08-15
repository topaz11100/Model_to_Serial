import { model_load_btn_click, label_send_map_set_btn_click } from './model_load.js'
import { cam, cam_btn_click } from './cam.js';
import { ser_send, closePort, ser_btn_click } from './serial.js'
import { infer_cond } from './infer_cond.js';
import { predict, infer_btn_click } from './infer.js';

const UI =
{
    // 시리얼 관련
    ser_txt: document.getElementById("ser_txt"),
    ser_btn: document.getElementById("ser_btn"),
    
    // 웹캠 관련
    cam_cont: document.getElementById("cam_cont"),
    cam_txt: document.getElementById("cam_txt"),
    cam_btn: document.getElementById("cam_btn"),

    // 모델 로드 관련
    model_url: document.getElementById("model_url"),
    model_btn: document.getElementById("model_btn"),
    model_txt: document.getElementById("model_txt"),
    //라벨-전송키 설정 부분
    label_cont: document.getElementById("label_cont"),
    label_map_cont: document.getElementById("label_map_cont"),
    label_map_btn: document.getElementById("label_map_btn"),
    label_map_txt: document.getElementById("label_map_txt"),

    // 추론 및 결과
    infer_cont: document.getElementById("infer_cont"),
    infer_btn: document.getElementById("infer_btn"),
    result_cont: document.getElementById("result_cont")
};

UI.ser_btn.addEventListener('click', ser_btn_click);
UI.cam_btn.addEventListener('click', cam_btn_click);
UI.model_btn.addEventListener('click', model_btn_click);
UI.label_map_btn.addEventListener('click', label_map_btn_click);
UI.infer_btn.addEventListener('click', infer_btn_click);

async function loop()
{
    try
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
    catch (err)
    {
        ser_btn_click();
        cam_btn_click();
    }
}

// 페이지 떠날 때 자원 정리
window.addEventListener("beforeunload", async () =>
{
    cam.stop();
    await closePort();
});

export { UI, loop };