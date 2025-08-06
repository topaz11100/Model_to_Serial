import { UI } from './main.js';
import { infer_cond } from './infer_cond.js';

let port, ser_send_end, writer; 

async function ser_on_btn_click()
{
    if (infer_cond.get_ser())
        return;

    UI.ser_status_text.textContent = "연결 중";
    infer_cond.set_ser(false);

    try
    {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        
        const encoder = new TextEncoderStream();
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
        UI.ser_status_text.textContent = "해제 실패";
    }
}

// 자원 해제 함수
async function closePort()
{
    if (writer)
    {
        await writer.close(); // writer 닫기
        writer = null;
    }
    if (port)
    {
        await port.close(); // 포트 닫기
        port = null;
    }
}

export { ser_on_btn_click, ser_send, ser_off_btn_click, closePort };