<p align="center">
  <img width="300" src="https://user-images.githubusercontent.com/10660468/55279861-281d0880-52f4-11e9-91ee-b715aa8953f8.png" />
</p>
<h3 align="center">Smee Action</h3>
<p align="center">Use <a href="https://smee.io">smee.io</a> to debug Action runs<p>

## Usage

```yaml
# .github/workflows/smee.yml
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: JasonEtco/smee-action@v1
```


<h3 align="center">⚠️</h3>
<p align="center">Heads up! This is only to be used for debugging, <strong>not for sensitive data</strong>. Smee.io is not secured by any authentication, so anyone with the channel ID can view your payloads as they come in.</p>

---

## Seeing the payloads

A common misconception about Smee.io is that the payloads will be available all the time - to see a new payload as its sent, **you must have a browser tab open to the channel URL.** The payloads are stored in `localStorage` in your browser.

## Specifying the channel

By default, this Action will post event payloads to the **smee.io/owner-name**.

You can specify what channel you want to send to:

```yaml
steps:
  - uses: JasonEtco/smee-action@v1
    with:
      channel: my-channel
```
