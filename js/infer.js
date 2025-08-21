import { dev_state, infer_state, dev_state_transition } from './state.js';
import { send_ser, Cam, Model, Output } from './device.js';
import { print_result, error_alert, infer_stop_ui_tran } from './ui.js';

const Infer =
{
    result: null,
    output_label: null,
    output_char: null
};

async function predict()
{
    const pred = await Model.model.predict(Cam.cam.canvas);
    Infer.result = [];

    let max_label = null, max_prob = 0;
    for (let i = 0; i < Model.labels_count; i += 1)
    {
        let label_i = pred[i].className, prob_i = (pred[i].probability * 100).toFixed(1);
        Infer.result.push(prob_i);

        if (prob_i > max_prob)
        {
            max_prob = prob_i;
            max_label = label_i;
        }
    }

    Infer.output_label = max_label;
    Infer.output_char = Output.map.get(max_label);
}

async function loop()
{
    try
    {
        if (dev_state.WebCam === 'CON')
            await Cam.cam.update();
        else
            return;

        window.requestAnimationFrame(loop);
    }
    catch (E)
    {
        console.log(E.message);
        await dev_state_transition("WebCam");
        error_alert("WebCam", E.message);
    }

    if (infer_state.ready && !infer_state.stop)
    {
        try
        {
            await predict();
            print_result();
            await send_ser(Infer.output_char);
        }
        catch (E)
        {
            console.log(E.message);
            await dev_state_transition("Serial");
            await dev_state_transition("WebCam");
            infer_stop_ui_tran(true);
            error_alert("infer", E.message);
        }
    }
}

export { loop, Infer, predict };