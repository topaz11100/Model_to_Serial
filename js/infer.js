import { UI } from './main.js';
import { cam } from './cam.js';
import { infer_cond } from './infer_cond.js';
import { model, label_count, label_send_map, results } from './model_load.js';

async function predict()
{
    const pred = await model.predict(cam.canvas);

    let result_list = [], result_label = null, result_prob = 0;
    for (let i = 0; i < label_count; i += 1)
    {
        let label_i = pred[i].className, prob_i = Math.round(pred[i].probability * 100);
        result_list.push(prob_i);

        if (prob_i > result_prob)
        {
            result_prob = prob_i;
            result_label = label_i;
        }
    }

    print_result(result_list);

    return label_send_map.get(result_label);
}

async function print_result(result_list)
{
    for (let i = 0; i < label_count; i += 1)
    {
        results[i].textContent = result_list[i];
    }
}

function infer_btn_click()
{
    UI.infer_btn.disabled = true;
    if (infer_cond.is_stop())
    {
        infer_cond.set_stop(false);
        updateshape(false);
    }
    else
    {
        infer_cond.set_stop(true);
        updateshape(true);
    }
    UI.infer_btn.disabled = false;
}

function updateshape(is_stop)
{
    UI.infer_btn.textContent = is_stop ? "Inference & Send" : "Pause";
    UI.infer_btn.classList.toggle("off_btn", !is_stop);
    UI.infer_btn.classList.toggle("on_btn", is_stop);
}

export { predict, infer_btn_click, updateshape };