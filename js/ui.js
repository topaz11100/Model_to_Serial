import { Ser_UI, Cam_UI, Model_UI, Output_UI, Infer_UI } from './main.js';
import { push_ser, send_ser, Cam, Model, Output, dev_transition } from './device.js';
import { del_child } from './util.js';

function ui_transition(dev, state)
{
    switch (dev)
    {
        case "ser":
            ser_tran(state);
            break;
        case "cam":
            cam_tran(state);
            break;
        case "model":
            model_tran(state);
            break;
        case "output":
            output_tran(state);
            break;
        default:
            throw new Error("장치 오류");
    }
}

function ser_tran(state)
{
    switch (state)
    {
        case "REQUEST":
            Ser_UI.txt.textContent = `${Ser_UI.btn.textContent}ing...`;
            Ser_UI.btn.textContent = `${Ser_UI.txt.textContent}ing...`;
            Ser_UI.btn.className = "request_btn";
            break;
        case "DIS":
            Ser_UI.txt.textContent = `Serial Disconnected`;
            Ser_UI.btn.textContent = `Connect`;
            Ser_UI.btn.className = "dis_btn";
            break;
        case "CON":
            Ser_UI.txt.textContent = `Serial Connected`;
            Ser_UI.btn.textContent = `Disconnect`;
            Ser_UI.btn.className = "con_btn";
            break;
    }
}

function cam_tran(state)
{
    switch (state)
    {
        case "REQUEST":
            Cam_UI.txt.textContent = `${Cam_UI.btn.textContent}ing...`;
            Cam_UI.btn.textContent = `${Cam_UI.txt.textContent}ing...`;
            Cam_UI.btn.className = "request_btn";
            break;

        case "DIS":
            del_child(Cam_UI.cont);

            Cam_UI.txt.textContent = `WebCam Disconnected`;
            Cam_UI.btn.textContent = `Connect`;
            Cam_UI.btn.className = "dis_btn";
            break;

        case "CON":
            del_child(Cam_UI.cont);
            Cam_UI.cont.appendChild(Cam.cam.canvas);

            Cam_UI.txt.textContent = `WebCam Connected`;
            Cam_UI.btn.textContent = `Disconnect`;
            Cam_UI.btn.className = "con_btn";
            break;
    }
}

function model_tran(state)
{
    switch (state)
    {
        case "REQUEST":
            Model_UI.output_cont.style.display = "none";
            Model_UI.txt.textContent = `${Model_UI.btn.textContent}ing...`;
            Model_UI.btn.textContent = `${Model_UI.txt.textContent}ing...`;
            Model_UI.btn.className = "request_btn";
            break;

        case "DIS":
            Model_UI.output_cont.style.display = "none";
            Model_UI.txt.textContent = "Model Disconnected";
            Model_UI.btn.textContent = "Connect";
            Model_UI.btn.className = "dis_btn";
            break;

        case "CON":
            Model_UI.output_cont.style.display = "block";
            output_load();
            Model_UI.txt.textContent = "Model connected";
            Model_UI.btn.textContent = "Connect";
            Model_UI.btn.className = "dis_btn";
            break;
    }
}

function output_load()
{
    del_child(Output_UI.cont);
    for (let i = 0; i < Model.labels_count; i += 1)
    {
        let label_i = Model.labels[i], base_val = Model.labels[i].slice(0, 1);
        const child = `<div class="map_row"><strong>${label_i}</strong><input id="val_${i}" value="${base_val}" maxlength="1"></div>`;
        Output_UI.cont.insertAdjacentHTML("beforeend", child);
    }
}

function output_tran(state)
{
    switch (state)
    {
        case "REQUEST":
            Output_UI.txt.textContent = `${Model_UI.btn.textContent}ing...`;
            Output_UI.btn.textContent = `${Model_UI.txt.textContent}ing...`;
            Output_UI.btn.className = "request_btn";
            break;

        case "DIS":
            Output_UI.txt.textContent = "Output Disconnected";
            Output_UI.btn.textContent = "Connect";
            Output_UI.btn.className = "dis_btn";
            break;

        case "CON":
            Output_UI.txt.textContent = "Output Connected";
            Output_UI.btn.textContent = "Connect";
            Output_UI.btn.className = "dis_btn";
            break;
    }
}

export { ui_transition };