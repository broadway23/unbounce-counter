<style>
  #counter-wrap {
    background-color: #000;
    width: 100%;
    max-width: 490px;
    height: 130px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #js-user-num {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    line-height: 1;
    color: #ffc700;
    white-space: nowrap;
    display: inline-block;
    font-size: 100px;  /* fixed size */
  }
</style>

<div id="counter-wrap">
  <span id="js-user-num">200,000</span>
</div>

<script>
  /* ==== CAMPAIGN CONFIG ==== */
  const START_VALUE        = 200000;
  const END_VALUE          = 205000;
  const CAMPAIGN_START_UTC = Date.UTC(2025, 3, 17, 0, 0, 0);
  const CAMPAIGN_MS        = 7 * 24 * 60 * 60 * 1000;
  /* ========================= */

  const el        = document.getElementById('js-user-num');
  const nf        = new Intl.NumberFormat('en-US');
  const ratePerMs = (END_VALUE - START_VALUE) / CAMPAIGN_MS;
  let   shuffled  = false;

  function currentValue(){
    const elapsed = Date.now() - CAMPAIGN_START_UTC;
    const clamped = Math.min(Math.max(elapsed, 0), CAMPAIGN_MS);
    return START_VALUE + clamped * ratePerMs;
  }

  /* slot‑machine shuffle of last 2 digits */
  (function shuffleTail(){
    const DURATION = 800, STEP = 60;
    const target   = Math.floor(currentValue());
    const base     = Math.floor(target / 100);       // everything except last 2 digits
    const maxTail  = target % 100;                  // last 2 digits
    const start    = Date.now();

    const iv = setInterval(() => {
      const dt = Date.now() - start;
      if (dt >= DURATION) {
        clearInterval(iv);
        el.textContent = nf.format(target);
        shuffled = true;
        return;
      }
      const rndTail = Math.floor(Math.random() * (maxTail + 1))
                        .toString().padStart(2, '0');
      el.textContent = nf.format(Number(`${base}${rndTail}`));
    }, STEP);
  })();

  /* live update after shuffle */
  (function liveTick(){
    if (shuffled) {
      el.textContent = nf.format(Math.floor(currentValue()));
    }
    requestAnimationFrame(liveTick);
  })();
</script>
