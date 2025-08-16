import { dev_state_transition, infer_state, infer_stop_transition } from './state.js';
import { dis_ser, dis_cam } from './device.js';
import { error_alert, infer_stop_ui_tran } from './ui.js';

const Ser_UI =
{
    txt: document.getElementById("ser_txt"),
    btn: document.getElementById("ser_btn")
}

const Cam_UI =
{
    cont: document.getElementById("cam_cont"),
    txt: document.getElementById("cam_txt"),
    btn: document.getElementById("cam_btn")
}

const Model_UI =
{
    // 모델 로드 관련
    url: document.getElementById("model_url"),
    btn: document.getElementById("model_btn"),
    txt: document.getElementById("model_txt"),
    //라벨-전송키 설정 부분
    map_cont: document.getElementById("map_cont"),
}

const Output_UI =
{
    map: document.getElementById("map"),
    btn: document.getElementById("map_btn"),
    txt: document.getElementById("map_txt"),
}

const Infer_UI =
{
    cont: document.getElementById("infer_cont"),
    btn: document.getElementById("infer_btn"),
    infer_result: document.getElementById("infer_result"),
    final_result: document.getElementById("final_result")
}

Ser_UI.btn.addEventListener('click', async() => {
    Ser_UI.btn.disabled = true;
    await dev_state_transition('Serial');
    Ser_UI.btn.disabled = false;
});

Cam_UI.btn.addEventListener('click', async () =>
{
    Cam_UI.btn.disabled = true;
    await dev_state_transition('WebCam');
    Cam_UI.btn.disabled = false;
});

Model_UI.btn.addEventListener('click', async () =>
{
    Model_UI.btn.disabled = true;
    await dev_state_transition('Model');
    Model_UI.btn.disabled = false;
});

Output_UI.btn.addEventListener('click', async () =>
{
    Output_UI.btn.disabled = true;
    await dev_state_transition('Output');
    Output_UI.btn.disabled = false;
});

Infer_UI.btn.addEventListener('click', () =>
{
    Infer_UI.btn.disabled = true;
    infer_stop_transition();
    Infer_UI.btn.disabled = false;
});

//갑자기 시리얼 끊겼을 때
navigator.serial.addEventListener("disconnect", async () =>
{
    //추론 전
    if (infer_state.stop)
    {
        await dev_state_transition("Serial");
        error_alert("Serial", "Serial connection lost");
    }
    //추론 중
    else
    {
        await dev_state_transition("Serial");
        infer_stop_ui_tran(true);
        error_alert("infer", "Serial connection lost");
    }
});

// 페이지 떠날 때 자원 정리
window.addEventListener("beforeunload", () =>
{
    dis_ser();
    dis_cam();
});

export { Ser_UI, Cam_UI, Model_UI, Output_UI, Infer_UI };