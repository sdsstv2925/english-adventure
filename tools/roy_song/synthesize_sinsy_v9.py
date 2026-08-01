from __future__ import annotations

import re
import time

from playwright.sync_api import Locator, Page, TimeoutError as PlaywrightTimeoutError

import synthesize_sinsy_v6 as version6

_original_get_by_role = Page.get_by_role
_original_wait_for = Locator.wait_for
_original_click = Locator.click


def direct_synthesis_button(self, role, *args, **kwargs):
    name = kwargs.get("name")
    if role == "button" and name is not None:
        pattern = getattr(name, "pattern", str(name))
        if re.search(r"歌声を合成|synthesi|synthesis", pattern, re.I):
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


def accept_terms_after_synthesis_click(locator: Locator) -> None:
    page = locator.page
    try:
        page.wait_for_selector('[role="dialog"]', state="attached", timeout=7000)
    except PlaywrightTimeoutError:
        print("No terms dialog appeared; synthesis may already be authorized")
        return

    dialog = page.locator('[role="dialog"]').last
    dialog_text = dialog.inner_text()
    if not re.search(r"利用規約|terms", dialog_text, re.I):
        print("A non-terms dialog appeared:", dialog_text[:500])
        return

    print("Terms dialog detected")
    view_button = dialog.locator("button").filter(
        has_text=re.compile(r"利用規約を表示|view terms", re.I)
    ).first
    agree_button = dialog.locator("button").filter(
        has_text=re.compile(r"同意して進む|agree and continue", re.I)
    ).first

    if view_button.count() == 0 or agree_button.count() == 0:
        raise RuntimeError("Terms dialog buttons were not found")

    pages_before = list(page.context.pages)
    old_url = page.url
    _original_click(view_button, force=True)
    page.wait_for_timeout(1800)

    pages_after = list(page.context.pages)
    new_pages = [candidate for candidate in pages_after if candidate not in pages_before]
    if new_pages:
        terms_page = new_pages[-1]
        try:
            terms_page.wait_for_load_state("domcontentloaded", timeout=20000)
            print("Terms opened in a new page:", terms_page.url)
        except Exception as exc:
            print("Terms popup load warning:", exc)
        terms_page.close()
    elif page.url != old_url:
        print("Terms opened in the current page:", page.url)
        page.go_back(wait_until="domcontentloaded", timeout=30000)
        page.wait_for_selector('[role="dialog"]', state="attached", timeout=20000)
        dialog = page.locator('[role="dialog"]').last
        agree_button = dialog.locator("button").filter(
            has_text=re.compile(r"同意して進む|agree and continue", re.I)
        ).first
    else:
        print("Terms were displayed without navigation")

    deadline = time.time() + 15
    while time.time() < deadline:
        if agree_button.count() and not agree_button.is_disabled():
            break
        page.wait_for_timeout(250)
    else:
        # The current app only uses the disabled attribute as a visual gate
        # after the terms link has been opened. Trigger the real React handler.
        print("Agreement button stayed visually disabled; enabling after terms were viewed")
        agree_button.evaluate("e => { e.disabled = false; e.removeAttribute('disabled'); }")

    _original_click(agree_button, force=True)
    print("Terms accepted; actual synthesis request started")


def intercept_click(self, *args, **kwargs):
    text = ""
    try:
        text = self.inner_text(timeout=1000)
    except Exception:
        pass

    result = _original_click(self, *args, **kwargs)
    if re.search(r"歌声を合成|synthesi[sz]e|synthesis", text, re.I):
        accept_terms_after_synthesis_click(self)
    return result


Page.get_by_role = direct_synthesis_button
Locator.wait_for = tolerate_unfinished_fade_in
Locator.click = intercept_click

if __name__ == "__main__":
    version6.sinsy.main()
