# Studio Tap

A small phone-friendly NFC rehearsal demo. The illustrated room cycles Golden hour → Ocean blue → After hours → Golden hour. It is a static HTML/CSS/JavaScript page with original SVG artwork, no dependencies, accounts, device credentials, or analytics.

## Open on your iPhone

Live page: https://erik-cupsa.github.io/nfc-studio-demo/

1. Open the page in Safari and tap **Change scene**. All three presets also work individually.
2. Tap **Reset rehearsal** to return to Golden hour.
3. Keep using Safari for the NFC test. Home Screen apps and private browsing can have separate storage, so switching contexts can restart the scene sequence.

## Connect one NFC sticker

Do this on the iPhone that will appear in the shot. A Mac cannot register a personal NFC automation for it.

1. In Shortcuts, create a shortcut named **Studio Tap**.
2. Add **Random Number** with minimum 1 and maximum 999999999.
3. Add **URL** and enter `https://erik-cupsa.github.io/nfc-studio-demo/?action=next&take=NUMBER`. Replace the literal `NUMBER` with the Random Number output variable using the variable picker above the keyboard.
4. Add **Open URLs**, using the URL from step 3. Press the shortcut's play button. The page should advance one scene. Run it again to check another scene.
5. Register the sticker using the instructions for your iOS version below.

The number ensures a fresh URL for every invocation, even if Safari already has the demo open. Do not put `NUMBER` in the URL literally for repeated tests. The page removes the action parameters after consuming them, so a refresh does not advance again. Every newly opened action link advances once; sharing/opening one manually also advances. The page cannot authenticate that a link came from NFC.

### iOS 26 and earlier

Open **Shortcuts → Automation → + / New Automation → NFC → Scan**. Hold the top edge of the unlocked iPhone near one isolated sticker. Name it **Studio sticker**. Choose **Run Immediately** if shown, then **Next**, and choose the **Studio Tap** shortcut. Older versions offer **Ask Before Running** instead: turn it off and confirm **Don't Ask**. If the shortcut picker is absent, add **Run Shortcut** and select Studio Tap.

### iOS 27

Apple's current guide describes adding triggers directly to a shortcut: open **Studio Tap → Edit → Automation**, choose **NFC**, and scan/name the sticker. Apple's automatic-run instructions use **Edit → Info → Privacy → Allow Running When Locked**. Test with the phone unlocked first, because opening a webpage may still need an unlocked phone. UI labels and individual action permissions need verification on the actual phone.

### Test, reset, record

- Place one tag on wood, paper, or plastic. Keep it away from metal and other tags. No tag writing, NFC Tools purchase, or permanent locking is needed for this personal automation.
- Unlock the phone with the screen on. Run the shortcut manually once and resolve any normal Shortcuts permission prompt before filming.
- Reset the preview to Golden hour. Leave Safari visible. Move the top of the phone close to the tag, pause briefly, then lift it away.
- Expected: Shortcuts runs, Safari opens the page, and the simulated room changes to Ocean blue after 0.7 seconds. The glow transitions over 0.85 seconds. There is no timer cycling scenes by itself.
- Lift away before each new scan. Scan again for pink, then again for warm amber. Test three complete cycles.
- Reset before every take. Manual scene selection also cancels a pending URL transition. For a fixed target use `?scene=ocean&take=NUMBER` instead of `?action=next&take=NUMBER`.
- If the scan fails, test the shortcut by hand first. Check NFC trigger availability, sticker position, phone unlock state, and that the automation is enabled. If a repeated scan opens an unchanged page, check the Random Number variable.

## What is real

- **Real when configured and physically tested:** the iPhone reading a passive tag and running its local Shortcuts automation. The phone powers the tag briefly through its radio field. The tag does not run the shortcut or communicate with lights.
- **Simulated:** all lighting in this webpage. A manual button or URL changes SVG glow, scene name, and local browser state.
- **Not implemented or verified:** physical LED control. There is no Web NFC API use and no claim that Safari reads the sticker.

A physical-light version should first use an existing light app's Siri shortcut or Apple Home scene. Create two fixed color scenes in that app, test each manually, then attach one to the NFC automation. No lighting backend is necessary. Do not equate Siri shortcut compatibility with HomeKit support.

## Local fallback

Run from this folder:

```sh
python3 -m http.server 8843 --bind 0.0.0.0 --directory site
```

On the same Wi-Fi, open `http://YOUR-MAC-LAN-IP:8843/` on the phone. Find the address with `ipconfig getifaddr en0` for a Mac using Wi-Fi on en0. The Mac must stay awake; guest Wi-Fi isolation, firewall rules, and network changes can prevent access. Do not use `localhost` on the phone to reach the Mac. Only `site/` is served. Clipboard copying may require HTTPS; select and copy the field manually on HTTP.

## Files and behavior

- `site/index.html`: portrait interface, original inline studio illustration, preset buttons, phone setup panel.
- `site/style.css`: responsive controls, scene glow transitions, reduced-motion support and visible keyboard focus.
- `site/app.js`: scene selection, safe localStorage persistence, URL action consumption, reset and copy controls. A missing or invalid saved value falls back to Golden hour. Storage failure does not break manual controls.
- `site/icon.svg`: original NFC-style favicon.
- `.github/workflows/pages.yml`: publishes only `site/` to GitHub Pages.

The browser owns scene state; it is not synchronized between phone and Mac. A reload keeps the selected scene without replaying a consumed URL command. A fresh URL can load a previously saved scene then animate to the requested scene. Safari on the physical phone must be tested before recording.

## References

Original code and artwork created for SWErikCodes. No third-party artwork or application source copied. Setup based on:

- [Apple: Add automations, current iOS guide](https://support.apple.com/en-ie/guide/shortcuts/apdfbdbd7123/ios)
- [Apple: Setting triggers, NFC identifier behavior](https://support.apple.com/en-ie/guide/shortcuts/setting-triggers-apde31e9638b/9.0/ios/26)
- [NXP: NTAG213/215/216 datasheet](https://www.nxp.com/docs/en/data-sheet/NTAG213_215_216.pdf)
- [Lloyd's: Siri Shortcuts through app routines](https://lloydscorp.com/manual-foco/index.html)

Amazon order observations and personal setup notes are kept outside the published source in ignored `notes/`. The approved narration document is not modified by this project.
