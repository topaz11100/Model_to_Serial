import { UI } from './main.js';
import { infer_cond } from './infer_cond.js'

let label_send_map = new Map();
let model, labels, label_count;

let results = [];

async function model_load(url)
{
    const modelURL = url + "model.json";
    const metadataURL = url + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    label_count = model.getTotalClasses();
    labels = model.getClassLabels();
}

async function model_load_btn_click()
{
    infer_cond.set_model(false);
    UI.model_status_text.textContent = "Loading ...";
    UI.label_map_cont.style.display = 'none';

    try
    {
        await model_load(UI.model_url.value);
        UI.model_status_text.textContent = "Load Success";
        UI.label_map_cont.style.display = 'block';
        label_send_map_load();
        result_cont_load();
        infer_cond.set_model(true);
    }
    catch (err)
    {
        UI.model_status_text.textContent = err.message;
    }
}

async function label_send_map_load()
{
    while (UI.label_send_map_cont.firstChild)
        UI.label_send_map_cont.removeChild(UI.label_send_map_cont.firstChild);
    label_send_map.clear();

    UI.label_send_map_cont.insertAdjacentHTML("beforeend", "<strong>Serial Output Char (1 letter)</strong>");
    for (let i = 0; i < label_count; i += 1)
    {
        let label_i = labels[i], base_val = labels[i].slice(0, 1);
        label_send_map.set(label_i, base_val);
        const child = `<div class="grid_key_cell"><strong>${label_i}</strong><input type="text" id="val_${i}" placeholder="${base_val}" maxlength="1"></input></div>`;
        UI.label_send_map_cont.insertAdjacentHTML("beforeend", child);
    }
}

async function result_cont_load()
{
    while (UI.result_cont.firstChild)
        UI.result_cont.removeChild(UI.result_cont.firstChild);
    results.length = 0;

    for (let i = 0; i < label_count; i += 1)
    {
        const child = `<div class="grid_key_cell"><strong>${labels[i]}</strong><strong id="result_${i}"></strong></div>`;
        UI.result_cont.insertAdjacentHTML("beforeend", child);
        results.push(document.getElementById(`result_${i}`));
    }
}

async function label_send_map_set_btn_click()
{
    if (!infer_cond.is_stop())
        return;

    label_send_map.clear();
    for (let i = 0; i < label_count; i += 1)
    {
        const val = document.getElementById(`val_${i}`).value;
        label_send_map.set(labels[i], val);
    }

    UI.label_send_map_status_text.textContent = "Set Complete";
    setTimeout(() => { UI.label_send_map_status_text.textContent = ""; }, 500);
}

export { model, labels, label_count, label_send_map, model_load_btn_click, label_send_map_set_btn_click, results };