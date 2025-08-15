function del_child(ui)
{
    while (ui.firstChild)
        ui.removeChild(ui.firstChild);
}

function dict_clear(dict)
{
    for (let k in dict) dict[k] = null;
}

export { del_child, dict_clear };