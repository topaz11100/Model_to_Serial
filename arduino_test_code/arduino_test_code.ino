#include <IO_helper.hpp>
#include <base_part.hpp>

Actuator led(13);

void setup()
{
    Serial.begin(9600);
    led.init();
}

void loop()
{
    char r = Rx::r_char('?');
    switch(r)
    {
        case '0':
            led.write(false);
            break;
        case '1':
            led.write(true);
            break;
        default:
            break;
    }
}
