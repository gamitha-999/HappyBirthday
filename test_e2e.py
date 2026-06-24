from playwright.sync_api import sync_playwright
import sys

BASE_URL = "http://localhost:8765"
errors = []
total_checks = 0

def log(msg):
    print(f"  {msg}", flush=True)

def check(cond, msg):
    global total_checks
    total_checks += 1
    if cond:
        log(f"PASS: {msg}")
    else:
        log(f"FAIL: {msg}")
        errors.append(msg)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 720})

    print("\n=== E2E TEST: Birthday Twins SPA ===\n", flush=True)

    # ===== TEST 1: Page load with no console errors =====
    print("1. PAGE LOAD + CONSOLE\n", flush=True)
    console_errors = []
    page = context.new_page()
    page.on("pageerror", lambda err: console_errors.append(str(err)))
    page.goto(BASE_URL, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(3000)

    check(page.title() == "Happy Birthday Twins \U0001f382\u2728", "Title is correct")
    check(len(console_errors) == 0, f"No JS errors (got {len(console_errors)})")
    for e in console_errors:
        log(f"  Console error: {e}")

    # ===== TEST 2: Landing Section Visible =====
    print("\n2. LANDING SECTION\n", flush=True)
    landing = page.locator("#section-landing")
    check(landing.is_visible(), "Landing section is visible")
    hero_title = landing.locator(".hero-title")
    check(hero_title.is_visible(), "Hero title is visible")
    twin_cards = landing.locator(".twin-card")
    check(twin_cards.count() == 2, "Found 2 twin cards")

    # ===== TEST 3: Canvas Elements =====
    print("\n3. CANVAS EFFECTS\n", flush=True)
    for cid in ["celebrationCanvas", "heartsCanvas", "particlesCanvas", "sparklesCanvas", "orbsCanvas"]:
        check(page.locator(f"#{cid}").count() == 1, f"Canvas #{cid} exists")

    # ===== TEST 4: Navigation (twin card click + Escape) =====
    print("\n4. NAVIGATION\n", flush=True)
    twin_cards.nth(0).click(force=True)
    page.wait_for_timeout(3000)

    harsha = page.locator("#section-harsha")
    check(harsha.is_visible(), "Harsha section visible after click")

    page.keyboard.press("Escape")
    page.wait_for_timeout(1000)
    check(landing.is_visible(), "Escape returns to landing from Harsha")

    twin_cards.nth(1).click(force=True)
    page.wait_for_timeout(3000)

    harshi = page.locator("#section-harshi")
    check(harshi.is_visible(), "Harshi section visible after click")

    page.keyboard.press("Escape")
    page.wait_for_timeout(1000)
    check(landing.is_visible(), "Escape returns to landing from Harshi")

    # ===== TEST 5: Galleries (Masonry) =====
    print("\n5. GALLERIES\n", flush=True)
    twin_cards.nth(0).click(force=True)
    page.wait_for_timeout(3000)
    masonry_items = page.locator("#section-harsha .masonry-item")
    count = masonry_items.count()
    check(count > 0, f"Harsha gallery has {count} images")

    # ===== TEST 6: Lightbox =====
    print("\n6. LIGHTBOX\n", flush=True)
    if count > 0:
        masonry_items.nth(0).click()
        page.wait_for_timeout(500)
        lightbox = page.locator("#lightbox")
        check(lightbox.is_visible(), "Lightbox opens")
        lb_close = page.locator(".lightbox-close")
        if lb_close.is_visible():
            lb_close.click()
            page.wait_for_timeout(500)
            check(not lightbox.is_visible(), "Lightbox closes")

    # ===== TEST 7: Funny Sections =====
    print("\n7. FUNNY SECTIONS\n", flush=True)
    funny_cards = page.locator("#section-harsha .polaroid-card")
    check(funny_cards.count() > 0, f"Harsha Fun has {funny_cards.count()} cards")

    page.keyboard.press("Escape")
    page.wait_for_timeout(1000)

    twin_cards.nth(1).click(force=True)
    page.wait_for_timeout(3000)
    playful_cards = page.locator("#section-harshi .playful-card")
    check(playful_cards.count() > 0, f"Harshi Fun has {playful_cards.count()} cards")

    # ===== TEST 8: Hero Images =====
    print("\n8. HERO\n", flush=True)
    page.keyboard.press("Escape")
    page.wait_for_timeout(1000)

    twin_cards.nth(0).click(force=True)
    page.wait_for_timeout(3000)
    harsha_hero = page.locator("#harshaHeroImg")
    check(harsha_hero.count() > 0, "Harsha hero image div exists")

    page.keyboard.press("Escape")
    page.wait_for_timeout(1000)

    twin_cards.nth(1).click(force=True)
    page.wait_for_timeout(3000)
    harshi_hero = page.locator("#harshiHeroImg")
    check(harshi_hero.count() > 0, "Harshi hero image div exists")

    # ===== TEST 9: Hard Refresh =====
    print("\n9. HARD REFRESH\n", flush=True)
    page2 = context.new_page()
    page2.goto(BASE_URL, wait_until="domcontentloaded", timeout=30000)
    page2.wait_for_timeout(100)
    fast_landing = page2.locator("#section-landing")
    fast_class = fast_landing.get_attribute("class")
    check("active" in (fast_class or ""), "Landing has 'active' class on DOMContentLoaded")
    page2.wait_for_load_state("networkidle")
    page2.wait_for_timeout(1500)
    check(fast_landing.is_visible(), "Landing visible after hard refresh")
    page2.close()

    # ===== SUMMARY =====
    print("\n=============================", flush=True)
    passed = total_checks - len(errors)
    print(f"RESULTS: {passed}/{total_checks} passed, {len(errors)} failed\n", flush=True)
    if errors:
        print("FAILURES:", flush=True)
        for e in errors:
            print(f"  - {e}", flush=True)

    browser.close()
    sys.exit(1 if errors else 0)
