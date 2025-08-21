import { Ser_UI, Cam_UI, Model_UI, Output_UI, Infer_UI } from './main.js';
import { Cam, Model } from './device.js';
import { Infer } from './infer.js';

function del_child(ui)
{
    while (ui.firstChild)
        ui.removeChild(ui.firstChild);
}

function error_alert(dev, err_m)
{
    if (dev === "infer")
        alert(`ERROR : ${err_m}\n Please Reconnect before Inference`);
    else
        alert(`ERROR : ${err_m}\n Please Reconnect ${dev}`);
}

function ui_tran(dev, state)
{
    switch (dev)
    {
        case "Serial":
            ser_tran(state);
            break;
        case "WebCam":
            cam_tran(state);
            break;
        case "Model":
            model_tran(state);
            break;
        case "Output":
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
            Ser_UI.btn.textContent = `${Ser_UI.txt.textContent}`;
            Ser_UI.btn.className = "request_btn";
            break;
        case "DIS":
            Ser_UI.txt.textContent = `Serial Not Connected`;
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
            Cam_UI.btn.textContent = `${Cam_UI.txt.textContent}`;
            Cam_UI.btn.className = "request_btn";
            break;

        case "DIS":
            del_child(Cam_UI.cont);

            Cam_UI.txt.textContent = `WebCam Not Connected`;
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
            Model_UI.map_cont.style.display = "none";
            Model_UI.txt.textContent = `${Model_UI.btn.textContent}ing...`;
            Model_UI.btn.textContent = `${Model_UI.txt.textContent}`;
            Model_UI.btn.className = "request_btn";
            break;

        case "DIS":
            Model_UI.map_cont.style.display = "none";
            Model_UI.txt.textContent = "Model Not Loaded";
            Model_UI.btn.textContent = "Load";
            Model_UI.btn.className = "dis_btn";
            break;

        case "CON":
            Model_UI.map_cont.style.display = "";
            output_load();
            result_load();
            Model_UI.txt.textContent = "Model Loaded";
            Model_UI.btn.textContent = "Load";
            Model_UI.btn.className = "dis_btn";
            break;
    }
}

function output_load()
{
    del_child(Output_UI.map);
    for (let i = 0; i < Model.labels_count; i += 1)
    {
        let label_i = Model.labels[i], base_val = Model.labels[i].slice(0, 1);
        const child = `<tr><td>${label_i}</td><td><input id="val_${i}" value="${base_val}" maxlength="1"></td></tr>`;
        Output_UI.map.insertAdjacentHTML("beforeend", child);
    }
}

function output_tran(state)
{
    switch (state)
    {
        case "REQUEST":
            Output_UI.txt.textContent = `${Output_UI.btn.textContent}ing...`;
            Output_UI.btn.textContent = `${Output_UI.txt.textContent}`;
            Output_UI.btn.className = "request_btn";
            break;

        case "DIS":
            Output_UI.txt.textContent = "Output Not Set";
            Output_UI.btn.textContent = "Set";
            Output_UI.btn.className = "dis_btn";
            break;

        case "CON":
            Output_UI.txt.textContent = "";
            setTimeout(() => { Output_UI.txt.textContent = "Output Set"; }, 500);
            Output_UI.btn.textContent = "Set";
            Output_UI.btn.className = "dis_btn";
            break;
    }
}

function infer_ready_ui_tran(state)
{
    switch (state)
    {
        case true:
            Infer_UI.cont.style.display = "";
            break;
        case false:
            Infer_UI.cont.style.display = "none";
            break;
    }
}

function infer_stop_ui_tran(state)
{
    switch (state)
    {
        //추론 진행
        case false:
            Ser_UI.btn.disabled = true;
            Cam_UI.btn.disabled = true;
            Model_UI.btn.disabled = true;
            Output_UI.btn.disabled = true;

            Infer_UI.btn.textContent = "Pause";
            break;
        //추론 중지
        case true:
            Ser_UI.btn.disabled = false;
            Cam_UI.btn.disabled = false;
            Model_UI.btn.disabled = false;
            Output_UI.btn.disabled = false;

            Infer_UI.btn.textContent = "Inference & Send";
            break;
    }
}

function result_load()
{
    del_child(Infer_UI.infer_result);
    for (let i = 0; i < Model.labels_count; i += 1)
    {
        let label_i = Model.labels[i];
        const child = `<tr><td>${label_i}</td><td>0</td></tr>`;
        Infer_UI.infer_result.insertAdjacentHTML("beforeend", child);
    }

    Infer_UI.final_result.rows[0].cells[0].textContent = "";
    Infer_UI.final_result.rows[0].cells[1].textContent = "";
}

function print_result()
{
    for (let i = 0; i < Model.labels_count; i += 1)
        Infer_UI.infer_result.rows[i].cells[1].textContent = Infer.result[i];

    Infer_UI.final_result.rows[0].cells[0].textContent = Infer.output_label;
    Infer_UI.final_result.rows[0].cells[1].textContent = Infer.output_char;
}

export { ui_tran, infer_ready_ui_tran, infer_stop_ui_tran, print_result, error_alert };