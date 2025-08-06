import { UI } from './main.js';
import { infer_cond } from './infer_cond.js';

let port, ser_send_end, encoder, writer; 

async function ser_on_btn_click()
{
    if (infer_cond.get_ser())
        return;

    infer_cond.set_ser(false);
    UI.ser_status_text.textContent = "연결 중";

    try
    {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        
        encoder = new TextEncoderStream();
        ser_send_end = encoder.readable.pipeTo(port.writable);
        writer = encoder.writable.getWriter();

        UI.ser_status_text.textContent = "시리얼 연결 완료"
        infer_cond.set_ser(true);
    }
    catch (err)
    {
        UI.ser_status_text.textContent = err.message;
    }
}

async function ser_send(txt)
{
    await writer.write(txt);
}

async function ser_off_btn_click()
{
    if (!infer_cond.get_ser())
        return;

    infer_cond.set_ser(false);
    try
    {
        await closePort();
        UI.ser_status_text.textContent = "연결 해제";
    }
    catch (err)
    {
        UI.ser_status_text.textContent = err;
    }
}

// 자원 해제 함수
async function closePort()
{
    if (writer) 
    {
        await writer.close();
        writer = null;
    }

    if (ser_send_end)
    {
        await ser_send_end.catch(() => { }); // pipeTo 에러 무시
        ser_send_end = null;
    }

    encoder = null;

    if (port) 
    {
        await port.close();
        port = null;
    }
}

export { ser_on_btn_click, ser_send, ser_off_btn_click, closePort };