function del_child(ui)
{
    while (ui.firstChild)
        ui.removeChild(ui.firstChild);
}
