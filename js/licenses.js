/*!
SPDX-License-Identifier: Apache-2.0
Copyright 2025 topaz11100
*/

const License_txt =
{
    tm_image: document.getElementById("tm_image_license"),
    tfjs: document.getElementById("tfjs_license"),
    asta_sans: document.getElementById("asta_sans_license"),
    my_project: document.getElementById("my_license")
}

const Btn = 
{
    tm_image: document.getElementById("tm_image_btn"),
    tfjs: document.getElementById("tfjs_btn"),
    asta_sans: document.getElementById("asta_sans_btn"),
    my_project: document.getElementById("my_license_btn")
}

Btn.tm_image.addEventListener('click', () => control_txt_btn(Btn.tm_image, License_txt.tm_image));
Btn.tfjs.addEventListener('click', () => control_txt_btn(Btn.tfjs, License_txt.tfjs));
Btn.asta_sans.addEventListener('click', () => control_txt_btn(Btn.asta_sans, License_txt.asta_sans));
Btn.my_project.addEventListener('click', () => control_txt_btn(Btn.my_project, License_txt.my_project));

function control_txt_btn(btn, txt)
{
    if (txt.style.display === "none")
    {
        txt.style.display = "";
        btn.textContent = "Hide License";
        btn.className = "con_btn";
    }
    else
    {
        txt.style.display = "none";
        btn.textContent = "Show License";
        btn.className = "dis_btn";
    }
}