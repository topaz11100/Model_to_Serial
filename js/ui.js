import { Ser_UI, Cam_UI, Model_UI, Output_UI, Infer_UI } from './main.js';
import { Cam, Model } from './device.js';
import { Infer } from './infer.js';

/* 공통 유틸 함수 ============================================================ */
function del_child(ui)
{
    while (ui.firstChild)
        ui.removeChild(ui.firstChild);
}

function btn_txt_change(UI, txt, txt_class, btn_txt, btn_class)
{
    UI.txt.textContent = txt;
    UI.txt.className = txt_class;
    UI.btn.textContent = btn_txt;
    UI.btn.className = btn_class;
}


/* 예외 처리 ============================================================ */
function error_alert(dev, err_m)
{
    if (dev === "infer")
        alert(`!!!!  ERROR  !!!!\n\n${err_m}\n\nPlease Reconnect before Inference`);
    else
        alert(`!!!!  ERROR  !!!!\n\n${err_m}\n\nPlease Reconnect ${dev}`);
}


/* 이하 ui상태전이 대응 함수들 ============================================================ */
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
            btn_txt_change(Ser_UI, `${Ser_UI.btn.textContent}ing...`, "request_txt", `${Ser_UI.btn.textContent}ing...`, "request_btn");
            break;
        case "DIS":
            btn_txt_change(Ser_UI, "Serial Not Connected", "dis_txt", "Serial Connect", "dis_btn");
            break;
        case "CON":
            btn_txt_change(Ser_UI, "Serial Connected", "con_txt", "Serial Disconnect", "con_btn");
            break;
    }
}

function cam_tran(state)
{
    switch (state)
    {
        case "REQUEST":
            btn_txt_change(Cam_UI, `${Cam_UI.btn.textContent}ing...`, "request_txt", `${Cam_UI.btn.textContent}ing...`, "request_btn");
            break;

        case "DIS":
            del_child(Cam_UI.cont);

            btn_txt_change(Cam_UI, "WebCam Not Connected", "dis_txt", "WebCam Connect", "dis_btn");
            break;

        case "CON":
            del_child(Cam_UI.cont);
            Cam_UI.cont.appendChild(Cam.cam.canvas);

            btn_txt_change(Cam_UI, "WebCam Connected", "con_txt", "WebCam Disconnect", "con_btn");
            break;
    }
}

function model_tran(state)
{
    switch (state)
    {
        case "REQUEST":
            Model_UI.map_cont.style.display = "none";

            btn_txt_change(Model_UI, "Model Loading ...", "request_txt", "Model Loading", "request_btn");
            break;

        case "DIS":
            Model_UI.map_cont.style.display = "none";

            btn_txt_change(Model_UI, "Model Not Loaded", "dis_txt", "Model Load", "dis_btn");
            break;

        case "CON":
            Model_UI.map_cont.style.display = "";

            output_load();
            result_load();

            btn_txt_change(Model_UI, "Model Loaded", "con_txt", "Model Load", "dis_btn");
            break;
    }
}

function output_load()
{
    del_child(Output_UI.map);
    for (let i = 0; i < Model.labels_count; i += 1)
    {
        let label_i = Model.labels[i], base_val = Model.labels[i].slice(0, 1);
        const child = `<tr>
                           <td>${label_i}</td><td><input id="val_${i}" value="${base_val}" maxlength="1"></td>
                       </tr>`;
        Output_UI.map.insertAdjacentHTML("beforeend", child);
    }
}

function output_tran(state)
{
    switch (state)
    {
        case "REQUEST":
            btn_txt_change(Output_UI, "Output Setting ...", "request_txt", "Output Setting", "request_btn");
            break;

        case "DIS":
            btn_txt_change(Output_UI, "Output Not Set", "dis_txt", "Output Set", "dis_btn");
            break;

        case "CON":
            btn_txt_change(Output_UI, "Output Set Complete", "con_txt", "Output Set", "dis_btn");
            setTimeout(() => { Output_UI.txt.textContent = "Output Set"; }, 300);
            break;
    }
}

function infer_ready_ui_tran(state)
{
    switch (state)
    {
        case true:
            Infer_UI.btn.disabled = false;
            break;
        case false:
            Infer_UI.btn.disabled = true;
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
            Infer_UI.btn.className = "con_btn";
            break;
        //추론 중지
        case true:
            Ser_UI.btn.disabled = false;
            Cam_UI.btn.disabled = false;
            Model_UI.btn.disabled = false;
            Output_UI.btn.disabled = false;

            Infer_UI.btn.textContent = "Inference & Send";
            Infer_UI.btn.className = "dis_btn";
            break;       
    }
}

function result_load()
{
    del_child(Infer_UI.infer_result);
    
    let child = "";
    for (let i = 0; i < Model.labels_count; i += 1)
    {
        child += `<div class="bar_cont">
                    <strong class="bar_label">${Model.labels[i]}</strong>
                    <div id="bar_${i}" class="bar"></div>
                    <strong id="bar_value_${i}" class="bar_value">0%</strong>
                  </div>`;
    }
    Infer_UI.infer_result.insertAdjacentHTML("beforeend", child);

    Infer_UI.final_result.rows[0].cells[1].textContent = "";
    Infer_UI.final_result.rows[1].cells[1].textContent = "";
}

function print_result()
{
    for (let i = 0; i < Model.labels_count; i += 1)
    {
        const bar = document.getElementById(`bar_${i}`);
        bar.style.width = `${Infer.result[i]}%`

        const bar_value = document.getElementById(`bar_value_${i}`);
        bar_value.textContent = `${Infer.result[i]}%`;
    }

    Infer_UI.final_result.rows[0].cells[1].textContent = Infer.output_label;
    Infer_UI.final_result.rows[1].cells[1].textContent = Infer.output_char;
}

export { ui_tran, infer_ready_ui_tran, infer_stop_ui_tran, print_result, error_alert };