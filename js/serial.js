import { UI } from './main.js';
import { infer_cond } from './infer_cond.js';

let port, ser_send_end, encoder, writer;

async function ser_btn_click() {
    UI.ser_btn.disabled = true;
    if (infer_cond.get_ser()) {
        off();
        updateshape(false);
    }
    else {
        on();
        updateshape(true);
    }
    UI.ser_btn.disabled = false;

    async function on() {
        if (infer_cond.get_ser())
            return;

        infer_cond.set_ser(false);
        UI.ser_status_text.textContent = "연결 중";

        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });

            encoder = new TextEncoderStream();
            ser_send_end = encoder.readable.pipeTo(port.writable);
            writer = encoder.writable.getWriter();

            UI.ser_status_text.textContent = "시리얼 연결 완료"
            infer_cond.set_ser(true);
        }
        catch (err) {
            UI.ser_status_text.textContent = err.message;
            updateshape(false);
        }
    }

    async function off() {
        if (!infer_cond.get_ser())
            return;

        infer_cond.set_ser(false);
        try {
            await closePort();
            UI.ser_status_text.textContent = "연결 해제";
        }
        catch (err) {
            UI.ser_status_text.textContent = err;
        }
    }

    function updateshape(is_on) {
        UI.ser_btn.textContent = is_on ? "시리얼 해제" : "시리얼 연결";
        UI.ser_btn.classList.toggle("off_btn", is_on);
        UI.ser_btn.classList.toggle("on_btn", !is_on);
    }
}

async function ser_send(txt) {
    if (writer)
        await writer.write(txt);
}

// 자원 해제 함수
async function closePort() {
    if (writer) {
        await writer.close();
        writer = null;
    }

    if (ser_send_end) {
        await ser_send_end.catch(() => { }); // pipeTo 에러 무시
        ser_send_end = null;
    }

    encoder = null;

    if (port) {
        await port.close();
        port = null;
    }
}

export { ser_btn_click, ser_send, closePort };