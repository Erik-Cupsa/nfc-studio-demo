# Studio Tap

A recording demo for an iPhone: a passive NFC sticker launches an Apple shortcut, which opens an illustrated studio that changes from amber to blue. Physical studio lighting is not connected. An iPad cue can be performed manually at the same moment.

- [Open the phone demo](https://erik-cupsa.github.io/nfc-studio-demo/)
- [Install Studio Tap in Shortcuts](https://www.icloud.com/shortcuts/0de5f08706af4bd48c0080ee89d8d214)
- [Open phone setup instructions](https://erik-cupsa.github.io/nfc-studio-demo/?setup=1)

## The three phone-only steps

### 1. Install and test

Open the install link on the iPhone, tap **Get Shortcut**, then **Add Shortcut**. Run **Studio Tap** in Shortcuts. Safari opens the demo in warm amber and switches to Ocean blue after 0.7 seconds, with a 0.85-second glow transition. Run it a second time: it repeats the same amber-to-blue take.

The shortcut has only three actions: Random Number (1 to 999999999), URL, Open URLs. It does not read contacts, photos, location, files, or studio devices. The random number gives each run a fresh URL so Safari can open another take reliably. Apple receives the shortcut when signing/sharing it.

Studio Tap was also added to Shortcuts on the build Mac. If Shortcuts iCloud sync is already enabled, it may appear automatically on the phone; use the existing copy rather than adding a duplicate. Sync arrival on the phone is not verified.

If the iCloud link is unavailable, [download the signed file](https://erik-cupsa.github.io/nfc-studio-demo/shortcuts/Studio%20Tap.shortcut), then open it from Safari Downloads or Files and add it to Shortcuts.

### 2. Register the sticker on the iPhone

Use one NTAG215 sticker, separated from the stack, on paper, wood, or plastic. Avoid metal. Keep the iPhone unlocked and screen on. Hold its top edge near the sticker when asked to scan.

- **iOS 26 or earlier:** Shortcuts → Automation → + / New Automation → NFC → Scan. Name it **Studio sticker**. Choose **Run Immediately**, then **Next**, and choose **Studio Tap**. If an action editor appears, add **Run Shortcut** and select Studio Tap. Older versions may instead offer **Ask Before Running**; turn it off and confirm Don't Ask.
- **iOS 27:** Apple's current guide describes opening **Studio Tap → Edit → Automation**, then choosing the NFC trigger and scanning the sticker. Its automatic-run path is **Edit → Info → Privacy → Allow Running When Locked**. Test unlocked first; opening a webpage can still require the phone to be unlocked. The actual iOS version and screen labels need confirmation on the phone.

No NFC-writing app, URL programming, password, or permanent tag locking is required. Apple's personal automation matches the tag identifier and ignores other tag contents. The automation belongs to the phone, not the sticker. It must be registered separately on another phone.

### 3. Test and record

1. Manually run Studio Tap once, resolving any normal permission prompts before filming.
2. Open the demo and tap **Reset rehearsal**. The phone shows amber.
3. Move the top edge of the unlocked phone near the sticker, hold briefly, then lift away. Expected: the shortcut opens the preview and it changes to blue.
4. Manually cue the iPad at the same moment. There is no phone-to-iPad synchronization or connection to lights.
5. Repeat the scan three times, lifting the phone away between reads. Each Studio Tap run starts amber and ends blue, even if the preceding take ended blue.
6. Reset the demo and the separate iPad cue before recording another take.

Actual iPhone import, physical tag detection, and real-world timing still require this test on the phone. Browser tests and Mac shortcut execution do not establish that the iPhone scanned a tag.

## Without a sticker

Tap **Rehearse tap in 3 seconds**. The preview resets to amber, counts down, then changes to blue. Move the phone toward a prop during the countdown. This is explicitly a timed simulation, not an NFC scan. **Reset rehearsal**, any preset, and **Change scene** cancel a pending countdown or URL transition. Starting another rehearsal restarts the countdown.

## Optional three-color cycle

[Download Studio Cycle](https://erik-cupsa.github.io/nfc-studio-demo/shortcuts/Studio%20Cycle.shortcut) and choose it instead of Studio Tap in the NFC automation. It cycles Golden hour → Ocean blue → After hours → Golden hour. **Change scene** on the page does the same.

## Manual shortcut fallback

Add **Random Number** (1 to 999999999), **URL**, and **Open URLs**. Use:

`https://erik-cupsa.github.io/nfc-studio-demo/?action=rehearse&take=NUMBER`

Replace literal `NUMBER` with the Random Number output variable. For the three-color cycle, change `action=rehearse` to `action=next`. A fixed scene can use `?scene=ocean&take=NUMBER`.

## Troubleshooting

- If the shortcut itself fails, solve that before testing the sticker. Confirm Safari can open the live demo and that Open URLs uses the preceding URL action.
- If only scans fail, check that NFC is the trigger, the automation is enabled, the phone is unlocked, and the sticker is separated from metal and other tags. Lift away between scans.
- If a repeated run shows no change, confirm you imported Studio Tap or used a Random Number variable in the manual fallback URL. Avoid moving between Safari, private browsing, and Home Screen apps during a take; their storage can differ.
- The page cannot confirm NFC detection. Opening the link by hand also changes the preview. No simulated status says the physical tag was detected.
- Internet is required for reliable loading; offline operation is not promised. Use the local fallback only if needed.

## Implementation

Static HTML/CSS/JavaScript, original SVG artwork, no dependencies or backend. `site/` is the entire public website. `app.js` stores the scene in localStorage, consumes query actions once and removes them from the URL, and cancels pending work on manual interaction. Refresh does not replay a consumed action. State is local to each browser and is not synchronized across devices.

`shortcuts/` contains auditable unsigned XML property lists. `scripts/build-shortcuts.py` builds them; signed, importable copies are in `site/shortcuts/`. The random-number parameter names and variable attachment format were checked against an export from Apple's Shortcuts app. Signing uses Apple's official command:

```sh
python3 scripts/build-shortcuts.py
shortcuts sign --mode anyone --input 'shortcuts/Studio Tap.shortcut' --output 'site/shortcuts/Studio Tap.shortcut'
shortcuts sign --mode anyone --input 'shortcuts/Studio Cycle.shortcut' --output 'site/shortcuts/Studio Cycle.shortcut'
```

The iCloud link is a shared snapshot. Rebuilding local files does not update that shared snapshot; re-share a revised shortcut and update the install link if the actions change.

## Local fallback

```sh
python3 -m http.server 8843 --bind 0.0.0.0 --directory site
```

On the same Wi-Fi, open `http://YOUR-MAC-LAN-IP:8843/` on the phone. Find the address with `ipconfig getifaddr en0` if Wi-Fi uses en0. The Mac must stay awake. Guest Wi-Fi isolation, firewall rules, or network changes can prevent access. `localhost` on the phone does not reach the Mac. Use the URL in the page's manual setup panel to create a local shortcut; the shipped shortcuts use the public HTTPS site.

## References and verification boundaries

Original code and artwork created for SWErikCodes. No third-party application source or artwork copied.

- [Apple: Add automations, current iOS guide](https://support.apple.com/en-ie/guide/shortcuts/apdfbdbd7123/ios)
- [Apple: NFC identifier behavior, iOS 26](https://support.apple.com/en-gb/guide/shortcuts/apde31e9638b/9.0/ios/26)
- [Apple: Run and sign shortcuts from the command line](https://support.apple.com/guide/shortcuts-mac/apd455c82f02/mac)
- [NXP: NTAG213/215/216 datasheet](https://www.nxp.com/docs/en/data-sheet/NTAG213_215_216.pdf)

The tag has no battery and does not run code or communicate with the lights. The phone reads it and runs the local automation. This app uses no Web NFC API and has no physical-light integration. Personal purchase notes and screenshots remain in ignored `notes/`. The narration document is unchanged.
