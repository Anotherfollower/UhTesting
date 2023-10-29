
[![circleci](https://circleci.com/gh/tie/dummyneko.svg?style=shield)](https://circleci.com/gh/tie/dummyneko)
[![codecov](https://codecov.io/gh/tie/dummyneko/coverage.svg)](https://codecov.io/gh/tie/dummyneko)

## Features. What's working?
- state_still
- state_yawn
- state_sleep
- state_alert
- state_run

## Roadmap. What's not implemented?

- state_scratch
- state_itch
- home position
- refactoring (JS only)

  Note that there is a cleaner Go/GopherJS port, which should (probably) also compile for the *js/wasm* target.  Though only state machine is currently covered by tests.

## Known bugs and workarounds.

- Default `display_state` updates image source URL, and some browsers (e.g.  Chrome) cancel unfinished downloads — low-bandwidth network users never receive the neko (unless they manually preload it).

  Temporary workaround: display preloaded images in `display_state` function.

- Web/猫 was not managed using Git from the start.  Unfortunately, there is no fix or workaround for this problem.

## License

### Public domain

Unlike the [webneko.net](https://webneko.net/n200504.js) JavaScript code, Web/猫 is published and distributed under the Unlicense and WTFPL.  Attribution is optional, but desirable.

Rationales for placing software in public domain are listed in [nothings/stb docs](https://github.com/nothings/stb/blob/master/docs/why_public_domain.md).
