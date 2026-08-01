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


def wait_for_value(page, index: int, expected: str, timeout_seconds: float = 8.0) -> bool:
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        inputs = page.locator("input.MuiSelect-nativeInput")
        if inputs.count() > index and inputs.nth(index).input_value() == expected:
            return True
        page.wait_for_timeout(180)
    return False


def configure_voice_directly(page) -> None:
    inputs = page.locator("input.MuiSelect-nativeInput")
    if inputs.count() < 3:
        raise RuntimeError(f"Expected at least 3 Sinsy select inputs, found {inputs.count()}")

    initial = inputs.evaluate_all("els => els.map(e => e.value)")
    print("INITIAL SELECT VALUES", initial)

    # 0 = interface locale, 1 = lyrics language, 2 = singer.
    set_react_input(inputs.nth(1), "english")
    if not wait_for_value(page, 1, "english"):
        raise RuntimeError("Sinsy lyrics language did not switch to English")

    page.wait_for_timeout(900)
    after_language = page.locator("input.MuiSelect-nativeInput").evaluate_all(
        "els => els.map(e => e.value)"
    )
    print("AFTER ENGLISH", after_language)

    singer_input = page.locator("input.MuiSelect-nativeInput").nth(2)
    # The male English singer backend ID shown by the current Sinsy app.
    set_react_input(singer_input, "m00003e_beta")
    page.wait_for_timeout(900)

    singer_value = page.locator("input.MuiSelect-nativeInput").nth(2).input_value()
    if singer_value != "m00003e_beta":
        # Some builds expose the UI key rather than the backend voice ID.
        set_react_input(page.locator("input.MuiSelect-nativeInput").nth(2), "m00003e_hmm")
        page.wait_for_timeout(900)
        singer_value = page.locator("input.MuiSelect-nativeInput").nth(2).input_value()

    print("SELECTED SINGER VALUE", singer_value)
    if singer_value not in {"m00003e_beta", "m00003e_hmm"}:
        raise RuntimeError(f"Male English singer was not selected: {singer_value}")

    # ALP: smaller = younger; VIB: real singing vibrato; PIT: modest upward shift.
    sliders = page.locator('input[type="range"]')
    for index in range(sliders.count()):
        slider = sliders.nth(index)
        minimum = slider.get_attribute("min") or ""
        maximum = slider.get_attribute("max") or ""
        if minimum == "0.45" and maximum == "0.65":
            target = "0.45"
        elif minimum in {"0", "0.0"} and maximum in {"2", "2.0"}:
            target = "1.10"
        elif minimum in {"-24", "-24.0"} and maximum in {"24", "24.0"}:
            target = "2"
        else:
            continue
        set_react_input(slider, target)
        print("SLIDER", minimum, maximum, "=>", slider.input_value())

    final_values = page.locator("input.MuiSelect-nativeInput").evaluate_all(
        "els => els.map(e => e.value)"
    )
    print("FINAL SELECT VALUES", final_values)


sinsy.configure_voice = configure_voice_directly

if __name__ == "__main__":
    sinsy.main()
