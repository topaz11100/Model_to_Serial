const infer_btn = document.getElementById("infer_btn");
infer_btn.addEventListener('click', infer_btn_click);

const stop_btn = document.getElementById("stop_btn");
stop_btn.addEventListener('click', stop_btn_click);

const result = document.getElementById("result");

async function predict()
{
    let result_txt = "";
    const pred = await model.predict(cam.canvas);
    let max_prob = 0, max_prob_name = null;
    for (let i = 0; i < label_count; i += 1)
    {
        let label_name = pred[i].className, prob = pred[i].probability.toFixed(2);
        const temp_pred = label_name + ": " + prob + " ";
        result_txt += temp_pred;

        if (prob > max_prob)
        {
            max_prob = prob;
            max_prob_name = label_name;
        }
    }
    send_txt = max_prob_name.slice(0, 1);
    result.textContent = result_txt;
}