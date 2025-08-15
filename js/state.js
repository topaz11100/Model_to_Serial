import { dev_transition } from './device.js';
import { ui_transition } from './ui.js';

// dev_state_set = "DIS", "REQUEST", "CON"
const dev_state = 
{
    ser: "DIS",
    cam: "DIS",
    model: "DIS",
    output: "DIS"
}

async function dev_state_transition(dev)
{
    ui_transition(dev, "REQUEST");
    await dev_transition(dev);
    ui_transition(dev, dev_state[dev]);
}

// infer_state_set = boolean
const infer_state_target = 
{
    ready: false,
    stop: true,
    error: false,
}

async function infer_state_transition(dev)
{
    await infer_transition(dev);
    ui_transition(dev);
}

export { dev_state, dev_state_transition, infer_state_target, infer_state_transition };