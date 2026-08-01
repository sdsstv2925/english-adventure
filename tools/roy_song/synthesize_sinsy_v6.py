from __future__ import annotations

import time

import synthesize_sinsy_v4 as sinsy


def set_react_input(locator, value: str) -> None:
    locator.evaluate(
        """(e, value) => {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          setter.call(e, value);
          e.dispatchEvent(new InputEvent('input', {bubbles: true, inputType: 'insertText', data: value}));
          e.dispatchEvent(new Event('change', {bubbles: true}));
        }""",
        value,
    )


def wait_for(page, condition, timeout_seconds: float = 10.0) -> bool:
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        if condition():
            return True
        page.wait_for_timeout(180)
    return False


def configure_current_english_dnn(page) -> None:
    inputs = page.locator("input.MuiSelect-nativeInput")
    if inputs.count() < 3:
        raise RuntimeError(f"Expected Sinsy select inputs, found {inputs.count()}")

    print("INITIAL SELECT VALUES", inputs.evaluate_all("els => els.map(e => e.value)"))
    set_react_input(inputs.nth(1), "english")

    if not wait_for(page, lambda: page.locator("input.MuiSelect-nativeInput").nth(1).input_value() == "english"):
        raise RuntimeError("Could not switch lyrics language to English")
    if not wait_for(page, lambda: "e_" in page.locator("input.MuiSelect-nativeInput").nth(2).input_value()):
        raise RuntimeError("English DNN singer did not load")

    values = page.locator("input.MuiSelect-nativeInput").evaluate_all("els => els.map(e => e.value)")
    print("ENGLISH DNN SELECT VALUES", values)

    # Keep the current supported English DNN singer. Smaller ALP produces a
    # younger character; vibrato makes it clearly sung; PIT stays natural.
    sliders = page.locator('input[type="range"]')
    print("SLIDERS", sliders.evaluate_all("els => els.map(e => ({min:e.min,max:e.max,value:e.value}))"))
    for index in range(sliders.count()):
        slider = sliders.nth(index)
        minimum = float(slider.get_attribute("min") or 0)
        maximum = float(slider.get_attribute("max") or 0)
        if 0.44 <= minimum <= 0.46 and 0.64 <= maximum <= 0.66:
            target = "0.45"
        elif minimum == 0 and maximum == 2:
            target = "1.10"
        elif minimum == -24 and maximum == 24:
            target = "0"
        else:
            continue
        set_react_input(slider, target)
        print("SET SLIDER", minimum, maximum, slider.input_value())

    print("FINAL SELECT VALUES", page.locator("input.MuiSelect-nativeInput").evaluate_all(
        "els => els.map(e => e.value)"
    ))


sinsy.configure_voice = configure_current_english_dnn

if __name__ == "__main__":
    sinsy.main()
