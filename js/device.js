import { Model_UI } from './main.js';
import { dev_state } from './state.js';
import { loop } from './infer.js';
import { error_alert } from './ui.js';

function dict_clear(dict)
{
    for (let k in dict) dict[k] = null;
}

const Ser =
{
    port: null,
    ser_send_end: null,
    encoder: null,
    writer: null,
    last_char: null
};

async function con_ser()
{
    Ser.port = await navigator.serial.requestPort();
    await Ser.port.open({ baudRate: 9600 });

    Ser.encoder = new TextEncoderStream();
    Ser.ser_send_end = Ser.encoder.readable.pipeTo(Ser.port.writable);
    Ser.writer = Ser.encoder.writable.getWriter();

    Ser.last_char = null;
}

async function dis_ser()
{
    try { await Ser.writer.close(); }
    catch (E) {}
    finally { Ser.writer = null; }

    try { await Ser.ser_send_end.catch(() => { }); }
    catch (E) { }
    finally { Ser.ser_send_end = null; }

    try { await Ser.encoder.writable.close(); }
    catch (E) { }
    finally { Ser.encoder = null; }

    try { await Ser.port.close(); }
    catch (E) { }
    finally { Ser.port = null; }

    Ser.last_char = null;
}

async function send_ser(char)
{
    if (Ser.writer && char !== Ser.last_char)
    {
        Ser.last_char = char;
        await Ser.writer.write(char);
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

    window.requestAnimationFrame(loop);
}

async function dis_cam()
{
    try { await Cam.cam.stop(); }
    catch (E) { }
    finally { Cam.cam = null; }
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
        if (val.trim() === "")
            throw new Error("!! Empty Input !!");
        Output.map.set(Model.labels[i], val);
    }
}

async function dev_tran(dev)
{
    switch (dev)
    {
        case "Serial":
            await ser_cam_tran(dev, con_ser, dis_ser);
            break;
        case "WebCam":
            await ser_cam_tran(dev, con_cam, dis_cam);
            break;
        case "Model":
            await model_output_tran(dev, con_model);
            break;
        case "Output":
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
                dict_clear(dev == 'Serial' ? Ser : Cam);
                dev_state[dev] = "DIS";
                error_alert(dev, E.message);
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
                dict_clear(dev == 'Serial' ? Ser : Cam);
                error_alert(dev, E.message);
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
                dict_clear(dev == 'Model' ? Model : Output);
                dev_state[dev] = "DIS";
                error_alert(dev, E.message);
            }
            break;
    }
}

export { send_ser, Cam, Model, Output, dev_tran, ser_cam_tran, dis_ser, dis_cam };
