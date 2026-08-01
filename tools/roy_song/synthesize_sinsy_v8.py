from __future__ import annotations

import re

from playwright.sync_api import Locator, Page, TimeoutError as PlaywrightTimeoutError

import synthesize_sinsy_v6 as version6

_original_get_by_role = Page.get_by_role
_original_wait_for = Locator.wait_for


def direct_synthesis_button(self, role, *args, **kwargs):
    name = kwargs.get("name")
    if role == "button" and name is not None:
        pattern = getattr(name, "pattern", str(name))
        if re.search(r"歌声を合成|synthesi|synthesis", pattern, re.I):
            # The form's parent remains opacity:0 in headless Chromium, so the
            # real enabled button is omitted from Playwright's ARIA tree.
            return self.locator("button").filter(
                has_text=re.compile(r"歌声を合成|synthesi[sz]e|synthesis", re.I)
            )
    return _original_get_by_role(self, role, *args, **kwargs)


def tolerate_unfinished_fade_in(self, *args, **kwargs):
    try:
        return _original_wait_for(self, *args, **kwargs)
    except PlaywrightTimeoutError:
        if kwargs.get("state") == "visible":
            print("Ignoring unfinished Sinsy fade-in animation")
            return None
        raise


Page.get_by_role = direct_synthesis_button
Locator.wait_for = tolerate_unfinished_fade_in

if __name__ == "__main__":
    version6.sinsy.main()
