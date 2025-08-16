import { dev_tran } from './device.js';
import { ui_tran, infer_ready_ui_tran, infer_stop_ui_tran } from './ui.js';

// dev_state_set = "DIS", "REQUEST", "CON"
const dev_state = 
{
    Serial: "DIS",
    WebCam: "DIS",
    Model: "DIS",
    Output: "DIS"
}

async function dev_state_transition(dev)
{
    ui_tran(dev, "REQUEST");
    await dev_tran(dev);
    ui_tran(dev, dev_state[dev]);
    set_ready(dev_state.Serial === "CON" && dev_state.WebCam === "CON" &&
              dev_state.Model === "CON" && dev_state.Output === "CON"); 
}

// infer_state_set = boolean
const infer_state =
{
    ready: false,
    stop: true,
}

function set_ready(boolean)
{
    if (!boolean)
        infer_state.stop = true;

    infer_state.ready = boolean;
    infer_ready_ui_tran(boolean);
}

function infer_stop_transition()
{
    infer_state.stop = !infer_state.stop;
    infer_stop_ui_tran(infer_state.stop);
}

export { dev_state, dev_state_transition, infer_state, infer_stop_transition };