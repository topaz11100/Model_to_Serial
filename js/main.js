import { dev_state, dev_state_transition, infer_state_target, infer_state_transition } from './state.js';

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
    output_cont: document.getElementById("output_cont"),
}

const Output_UI =
{
    cont: document.getElementById("map_cont"),
    btn: document.getElementById("map_btn"),
    txt: document.getElementById("map_txt"),
}

const Infer_UI =
{
    cont: document.getElementById("infer_cont"),
    btn: document.getElementById("infer_btn"),
    result_cont: document.getElementById("result_cont")
}

Ser_UI.btn.addEventListener('click', async() => {
    Ser_UI.btn.disabled = true;
    await dev_state_transition('ser');
    Ser_UI.btn.disabled = false;
});

Cam_UI.btn.addEventListener('click', async () =>
{
    Cam_UI.btn.disabled = true;
    await dev_state_transition('cam');
    Cam_UI.btn.disabled = false;
});

Model_UI.btn.addEventListener('click', async () =>
{
    Model_UI.btn.disabled = true;
    await dev_state_transition('model');
    Model_UI.btn.disabled = false;
});

Output_UI.btn.addEventListener('click', async () =>
{
    Output_UI.btn.disabled = true;
    await dev_state_transition('output');
    Output_UI.btn.disabled = false;
});

export { Ser_UI, Cam_UI, Model_UI, Output_UI, Infer_UI };