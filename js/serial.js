const ser_on_btn = document.getElementById("ser_on_btn");
ser_on_btn.addEventListener('click', ser_on_btn_click);

const ser_off_btn = document.getElementById("ser_off_btn");
ser_off_btn.addEventListener('click', ser_off_btn_click);

const ser_status_text = document.getElementById("ser_status_text");

let port, ser_send_end, writer; 

async function ser_on_btn_click()
{
    ser_txt.textContent = "연결 중";
    infer_cond.set_ser(false);

    try
    {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        
        const encoder = new TextEncoderStream();
        ser_send_end = encoder.readable.pipeTo(port.writable);
        writer = encoder.writable.getWriter();

        ser_txt.textContent = "시리얼 연결 완료"
        infer_cond.set_ser(true);
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

async function ser_off_btn_click()
{
    infer_cond.set_ser(false);
    try
    {
        await closePort();
        ser_txt.textContent = "연결 해제";
    }
    catch (err)
    {
        ser_txt.textContent = "해제 실패";
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

// 페이지 떠날 때 자원 정리
window.addEventListener("beforeunload", async () => {
    await closePort();
});