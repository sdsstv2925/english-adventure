from __future__ import annotations

from playwright.sync_api import Locator, TimeoutError as PlaywrightTimeoutError

import synthesize_sinsy_v6 as version6

_original_wait_for = Locator.wait_for


def tolerate_unfinished_fade_in(self, *args, **kwargs):
    """Sinsy's upload form remains opacity:0 in headless Chromium.

    The real button and React handlers are present and enabled. Only the
    cosmetic entrance animation never completes, so bypass this one visual
    check. The following disabled-state check in v4 is still enforced.
    """
    try:
        return _original_wait_for(self, *args, **kwargs)
    except PlaywrightTimeoutError:
        if kwargs.get("state") == "visible":
            print("Ignoring unfinished Sinsy fade-in animation for active control")
            return None
        raise


Locator.wait_for = tolerate_unfinished_fade_in

if __name__ == "__main__":
    version6.sinsy.main()
