import { Ser_UI, Cam_UI, Model_UI, Output_UI, Infer_UI } from './main.js';
import { dev_state, dev_state_transition, infer_state_target, infer_state_transition } from './state.js';
import { dict_clear } from './util.js';

const Ser =
{
    port: null,
    ser_send_end: null,
    encoder: null,
    writer: null,
    send_queue: []
};

async function con_ser()
{
    Ser.port = await navigator.serial.requestPort();
    await Ser.port.open({ baudRate: 9600 });

    Ser.encoder = new TextEncoderStream();
    Ser.ser_send_end = encoder.readable.pipeTo(Ser.port.writable);
    Ser.writer = encoder.writable.getWriter();
}

async function dis_ser()
{
    if (Ser.writer)
    {
        await Ser.writer.close();
        Ser.writer = null;
    }

    if (Ser.ser_send_end)
    {
        await Ser.ser_send_end.catch(() => { }); // pipeTo 에러 무시
        Ser.ser_send_end = null;
    }

    Ser.encoder = null;

    if (Ser.port)
    {
        await Ser.port.close();
        Ser.port = null;
    }
}

function push_ser(char)
{
    if (Ser.send_queue.length)
    {
        Ser.send_queue.push(char);
    }
    else if (Ser.send_queue.at(-1) != char)
    {
        Ser.send_queue.push(char);   
    }
}
async function send_ser()
{
    if (Ser.writer && Ser.send_queue.length)
    {
        send_char = Ser.send_queue.shift();
        await Ser.writer.write(send_char);
    }
}

const Cam =
{
    cam: null
};

async function con_cam()
{
    Cam.cam = new tmImage.Webcam(200, 200, true); // width, height, flip
    await Cam.cam.setup(); // request access to the webcam
    await Cam.cam.play();
}

async function dis_cam()
{
    Cam.cam.stop();
    Cam.cam = null;
}

const Model = 
{
    model: null,
    labels: null,
    labels_count: null
};

async function con_model()
{
    let url = Model_UI.url.value;
    const modelURL = url + "model.json";
    const metadataURL = url + "metadata.json";
    Model.model = await tmImage.load(modelURL, metadataURL);
    Model.labels = Model.model.getClassLabels();
    Model.labels_count = Model.model.getTotalClasses();
}

const Output =
{
    map: null
};

async function con_output()
{
    Output.map = new Map();
    for (let i = 0; i < Model.labels_count; i += 1)
    {
        const val = document.getElementById(`val_${i}`).value;
        Output.map.set(Model.labels[i], val);
    }
}

async function dev_transition(dev)
{
    switch (dev)
    {
        case "ser":
            await ser_cam_tran(dev, con_ser, dis_ser);
            break;
        case "cam":
            await ser_cam_tran(dev, con_cam, dis_cam);
            break;
        case "model":
            await model_output_tran(dev, con_model);
            break;
        case "output":
            await model_output_tran(dev, con_output);
            break;
        default:
            throw new Error("장치 오류");
    }
}

async function ser_cam_tran(dev, con, dis)
{
    switch (dev_state[dev])
    {
        case "DIS":
            try
            {
                await con();
                dev_state[dev] = "CON";
            }
            catch (E)
            {
                console.log(E.message);
                dict_clear(Ser);
                dev_state[dev] = "DIS";
            }
            break;
        case "CON":
            try
            {
                await dis();
            }
            catch (E)
            {
                console.log(E.message);
                dict_clear(Ser);
            }
            dev_state[dev] = "DIS";
            break;
    }
}

async function model_output_tran(dev, con)
{
    switch (dev_state[dev])
    {
        case "DIS":
        case "CON":
            try
            {
                await con();
                dev_state[dev] = "CON";
            }
            catch (E)
            {
                console.log(E.message);
                dict_clear(Model);
                dev_state[dev] = "DIS";
            }
            break;
    }
}

export { push_ser, send_ser, Cam, Model, Output, dev_transition };
