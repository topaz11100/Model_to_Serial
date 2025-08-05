const infer = document.getElementById("infer");

class infer_condition
{
    constructor()
    {
        this._model = false;
        this._ser = false;
        this._cam = false;
    }

    async check_infer()
    {
        if (this._model && this._ser && this._cam)
            infer.style.display = 'block';
        else
            infer.style.display = 'none';
    }

    async set_model(boolean)
    {
        this._model = boolean;
        check_infer();
    }

    async set_ser(boolean)
    {
        this._ser = boolean;
        check_infer();
    }

    async set_cam(boolean)
    {
        this._cam = boolean;
        check_infer();
    }
}

const infer_cond = new infer_condition();