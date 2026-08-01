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


def button_snapshot(page: Page) -> list[dict]:
    return page.locator("button").evaluate_all(
        "buttons => buttons.map(b => ({text:(b.textContent||'').trim(), disabled:b.disabled, aria:b.getAttribute('aria-label')||''}))"
    )


def global_button(page: Page, pattern: str) -> Locator:
    return page.locator("button").filter(has_text=re.compile(pattern, re.I)).last


def accept_terms_after_synthesis_click(locator: Locator) -> None:
    page = locator.page
    try:
        page.wait_for_selector('[role="dialog"]', state="attached", timeout=7000)
    except PlaywrightTimeoutError:
        print("No terms dialog appeared; synthesis authorization already exists")
        return

    dialog_text = page.locator('[role="dialog"]').last.inner_text()
    if not re.search(r"利用規約|terms", dialog_text, re.I):
        print("Non-terms dialog appeared:", dialog_text[:500])
        return

    print("Terms consent dialog detected")
    print("BUTTONS BEFORE TERMS", button_snapshot(page))

    view_button = global_button(page, r"利用規約を表示|view terms")
    if view_button.count() == 0:
        raise RuntimeError("View terms button was not found")

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
        print("Terms opened in current page:", page.url)
        page.go_back(wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(1200)
    else:
        print("Terms opened in nested UI")
        print("BUTTONS INSIDE TERMS", button_snapshot(page))
        page.screenshot(path="roy_song_work/sinsy_terms_open.png", full_page=True)

        close_button = global_button(page, r"^閉じる$|^close$|戻る|back")
        if close_button.count() and not close_button.is_disabled():
            _original_click(close_button, force=True)
            page.wait_for_timeout(900)
            print("Nested terms UI closed")
        else:
            # Some MUI variants use an icon-only close control.
            icon_close = page.locator('button[aria-label*="close" i], button[aria-label*="閉じる"]')
            if icon_close.count():
                _original_click(icon_close.last, force=True)
                page.wait_for_timeout(900)
                print("Icon close used for nested terms UI")

    print("BUTTONS AFTER TERMS", button_snapshot(page))
    agree_button = global_button(page, r"同意して進む|agree and continue")
    if agree_button.count() == 0:
        raise RuntimeError("Agreement button was not found after viewing terms")

    deadline = time.time() + 12
    while time.time() < deadline and agree_button.is_disabled():
        page.wait_for_timeout(250)
        agree_button = global_button(page, r"同意して進む|agree and continue")

    if agree_button.is_disabled():
        raise RuntimeError("Agreement button remained disabled after viewing terms")

    _original_click(agree_button, force=True)
    page.wait_for_timeout(700)
    print("Terms accepted; real synthesis request started")


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
