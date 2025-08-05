const model_load_btn = document.getElementById("model_load_btn");
model_load_btn.addEventListener('click', model_load_btn_click);

const model_url = document.getElementById("model_url");

const model_status_text = document.getElementById("model_status_text");

async function model_load(url)
{
    const modelURL = url + "model.json";
    const metadataURL = url + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    label_count = model.getTotalClasses();
    labels = model.getClassLabels();
}

async function model_load_btn_click()
{
    model_txt.textContent = "가져오는 중";
    infer_cond.set_model(false);

    try
    {
        await model_load(model_url.value);
        model_txt.textContent = "Load Success\nLabel : " + labels.join(" ");
        infer_cond.set_model(true);
    }
    catch (err)
    {
        model_txt.textContent = err.message;
    }
}

