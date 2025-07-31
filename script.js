const ser_btn = document.getElementById("serbtn");
ser_btn.addEventListener('click', ser_btn_click);
const ser_txt = document.getElementById("serial_process_text");

const model_btn = document.getElementById("mdlbtn");
model_btn.addEventListener('click', model_btn_click);
const model_url = document.getElementById("model_url");
const model_txt = document.getElementById("model_process_text");

const infer_btn = document.getElementById("inferbtn");
infer_btn.addEventListener('click', infer_btn_click);

const stop_btn = document.getElementById("stopbtn");
stop_btn.addEventListener('click', stop_btn_click);

const webcam = document.getElementById("webcam");

const result = document.getElementById("result");

let cam;
let model, labels, label_count;

let port, writer, ser_send_end, send_txt = "";

let is_model_loaded = false;
let is_serial_connected = false;

let infer_mode = false;

async function ser_btn_click()
{
    is_serial_connected = false;
    ser_txt.textContent = "";

    try
    {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        const info = port.getInfo();
        ser_txt.textContent = `포트 정보: USB Vendor ID ${info.usbVendorId}, Product ID ${info.usbProductId}\n Send : ${send_txt}`;

        const encoder = new TextEncoderStream();
        ser_send_end = encoder.readable.pipeTo(port.writable);
        writer = encoder.writable.getWriter();

        is_serial_connected = true;
    }
    catch (err)
    {
        ser_txt.textContent = err.message;
    }

    check_infer_btn();
}

async function ser_send(txt)
{
    await writer.write(txt);
}

async function model_btn_click()
{
    is_model_loaded = false;
    model_txt.textContent = "";
    
    try
    {
        await model_load(model_url.value);
        model_txt.textContent = "Load Success\nLabel : " + labels.join(" ");
        is_model_loaded = true;
    }
    catch (err)
    {
        model_txt.textContent = err.message;
    }

    check_infer_btn();
}

async function model_load(url)
{
    const modelURL = url + "model.json";
    const metadataURL = url + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    label_count = model.getTotalClasses();
    labels = model.getClassLabels();
}

function check_infer_btn()
{
    infer_mode = false;

    if (is_model_loaded && is_serial_connected)
    {
        infer_btn.style.display = 'block';
        stop_btn.style.display = 'block';
    }
    else
    {
        infer_btn.style.display = 'none';
        stop_btn.style.display = 'none';
    }
}

async function infer_btn_click()
{
    infer_mode = true;
}

async function stop_btn_click()
{
    infer_mode = false;
}

async function page_init()
{
    cam = new tmImage.Webcam(200, 200, true); // width, height, flip
    await cam.setup(); // request access to the webcam
    await cam.play();
    webcam.appendChild(cam.canvas);

    window.requestAnimationFrame(no_infer_cam_loop);
}

async function loop()
{
    webcam.update();

    if (infer_mode)
    {
        await predict();
        await ser_send(send_txt);
        window.requestAnimationFrame(loop);    
    }
    else
    {
        result.textContent = "";
        window.requestAnimationFrame(no_infer_cam_loop);
    }    
}

async function predict()
{
    let result_txt = "";
    const pred = await model.predict(webcam.canvas, true);
    let max_prob = 0, max_prob_name = null;
    for (let i = 0; i < label_count; i++)
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

page_init();

window.addEventListener("beforeunload", () => {
    if (writer) {
        writer.close();
    }
    if (port) {
        // close()는 Promise를 반환하지만, unload 중에는 await하지 않고
        // 즉시 호출만 해도 대체로 닫히도록 동작합니다.
        port.close().catch(err => {
            console.warn("Error closing serial port on unload:", err);
        });
    }
});