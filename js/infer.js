import { UI } from './main.js';
import { cam } from './cam.js';
import { infer_cond } from './infer_cond.js';
import { model, label_count, label_send_map } from './model_load.js';

async function predict()
{
    const pred = await model.predict(cam.canvas);

    let result_txt = "", result_label = null, result_prob = 0;
    for (let i = 0; i < label_count; i += 1)
    {
        let label_i = pred[i].className, prob_i = pred[i].probability.toFixed(2);
        result_txt += `${label_i}:${prob_i} `;
        
        if (prob_i > result_prob)
        {
            result_prob = prob_i;
            result_label = label_i;
        }
    }
    UI.result.textContent = result_txt;

    return label_send_map.get(result_label);
}

function infer_btn_click()
{
    infer_cond.set_stop(false);
}

function stop_btn_click()
{
    infer_cond.set_stop(true);
}

export { predict, infer_btn_click, stop_btn_click };