import { UI } from './main.js';
import { updateshape } from './infer.js';

class infer_condition
{
    constructor()
    {
        this._model = false;
        this._ser = false;
        this._cam = false;
        this._stop = true;
    }

    check_infer()
    {
        if (this._model && this._ser && this._cam)
        {
            UI.infer.style.display = 'block';
            updateshape(true);
        }
        else
        {
            this._stop = true;
            UI.infer.style.display = 'none';
        }
    }

    set_model(boolean)
    {
        this._model = boolean;
        this.check_infer();
    }

    set_ser(boolean)
    {
        this._ser = boolean;
        this.check_infer();
    }

    set_cam(boolean)
    {
        this._cam = boolean;
        this.check_infer();
    }

    get_ser()
    {
        return this._ser;
    }

    get_cam()
    {
        return this._cam;
    }

    get_infer()
    {
        return this._model && this._ser && this._cam;
    }

    set_stop(boolean)
    {
        this._stop = boolean;
    }

    is_stop()
    {
        return this._stop;
    }
}

export const infer_cond = new infer_condition();