// =================================================================
// APP — UI functions, routing, and interactivity
// =================================================================

  function showTeam(teamId) {
    const t = TEAMS[teamId];
    if (!t) { showPage('teams'); return; }
    _currentTeamId = teamId;

    // hero
    const photoEl = document.querySelector('#page-team-detail .td-hero-photo');
    if (t.img) {
      photoEl.style.cssText = `background-image:url('${t.img}'); background-size:cover; background-position:center;`;
    } else {
      photoEl.style.cssText = `background:${t.heroGradient};`;
    }
    const logoImg = document.querySelector('#page-team-detail .td-hero-logo');
    logoImg.src = t.logo || '';
    logoImg.alt = 'Hikari ' + t.name;
    logoImg.style.marginLeft = t.logoOffset ? `${-(t.logoOffset * 480).toFixed(0)}px` : '0';

    // info strip
    const strip = document.querySelectorAll('#page-team-detail .info-strip-value');
    strip[0].textContent = t.level;
    strip[1].textContent = t.age;
    strip[2].textContent = t.schedule;
    strip[3].textContent = t.time;
    strip[4].textContent = 'Koperslagerstraat 8, 3077 MD Rotterdam';

    // body text
    document.querySelector('#page-team-detail .td-tagline').textContent = t.tagline;
    document.querySelector('#page-team-detail .td-about1').textContent = t.about;
    document.querySelector('#page-team-detail .td-about2').textContent = t.about2;

    // what to expect list
    // pricing box
    document.querySelector('#page-team-detail .price-amount').textContent = t.price;
    document.querySelector('#page-team-detail .price-period').textContent = t.period;
    const incList = document.querySelector('#page-team-detail .pricing-includes');
    incList.innerHTML = t.pricing.map(i => `<li>${i}</li>`).join('');

    // tryout note + trial callout + button label
    const tryNote = document.querySelector('#page-team-detail .td-tryout-note');
    const trialCallout = document.querySelector('#page-team-detail .td-trial-callout');
    const joinBtn = document.querySelector('#page-team-detail .td-join-btn');
    if (t.tryout) {
      tryNote.textContent = 'Try-out required. Contact us for the next try-out date.';
      trialCallout.style.display = 'none';
      joinBtn.textContent = 'Register for This Team';
    } else {
      tryNote.textContent = '';
      trialCallout.style.display = 'block';
      joinBtn.textContent = 'Come Try Out →';
    }

    // Selection & Membership section
    const isRec = t.type === 'recreational';
    document.querySelector('#page-team-detail .td-selection-text').textContent = t.tryout
      ? 'To be part of this team, athletes must attend a try-out and be selected by coaches. We often organise try-outs in June and September.'
      : 'There is no try-out to join this team — everyone is welcome, regardless of experience. New athletes start with 2 free trial lessons to get a feel for the team before committing to membership.';
    document.querySelector('#page-team-detail .td-selection-text2').textContent = t.tryout
      ? 'If you missed the try-outs, don\'t worry — there is always a chance to join! Contact us and we will discuss the possibilities.'
      : 'After your 2 trial sessions, you and your coach will discuss whether this team is the right fit. If you decide to continue, you\'ll be asked to sign up for a membership.';

    document.querySelector('#page-team-detail .td-membership-intro').textContent = isRec
      ? 'Recreational membership is collected via direct debit. You can choose from three options:'
      : 'Cheerleading is a team sport. When participating in a competition team, athletes commit to an entire season through an annual membership valid between September 1 and August 31 of the following year. The annual fee is automatically debited. You can choose from two options:';

    const memItems = isRec
      ? [
          'One-time payment for the entire year, debited at the end of September (valid September 1 – August 31)',
          'One-time payment for a semester, debited at the end of September (valid September 1 – February 28)',
          'One-time payment for a semester, debited at the end of February (valid March 1 – August 31)',
        ]
      : [
          'A one-time payment, debited at the end of September',
          'Payment in 2 instalments, debited at the end of September and the end of November',
        ];
    document.querySelector('#page-team-detail .td-membership-list').innerHTML =
      memItems.map(i => `<li>${i}</li>`).join('');

    document.querySelector('#page-team-detail .td-membership-note').textContent = isRec
      ? 'Recreational memberships are non-refundable.'
      : 'Competition memberships are non-refundable.';

    showPage('team-detail');
  }

  const _nav = document.querySelector('nav');

  // Inject shared footer into every page once
  (function injectFooters() {
    const tpl = document.getElementById('shared-footer-tpl');
    if (!tpl) return;
    document.querySelectorAll('.page').forEach(page => {
      if (!page.querySelector('footer')) {
        page.appendChild(tpl.content.cloneNode(true));
      }
    });
  })();

  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page-' + id);
    if (el) {
      el.classList.add('active');
      window.scrollTo(0,0);
      _isHome = (id === 'home');
      if (_nav) {
        _nav.classList.remove('scrolled');
        _nav.classList.toggle('solid', !_isHome);
      }
    }
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navMap = {
      'home':'nav-home','teams':'nav-teams','team-detail':'nav-teams',
      'join':'nav-join','about':'nav-about','coaches':'nav-about',
      'events':'nav-events','shop':'nav-shop','schedule':'nav-schedule',
      'support':'nav-support','myarea':'nav-myarea','product-detail':'nav-shop','contact':'nav-join',
      'event-detail':'nav-events'
    };
    const navId = navMap[id];
    if (navId) { const n = document.getElementById(navId); if(n) n.classList.add('active'); }
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.addEventListener('click', function() {
        this.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(x => x.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        document.querySelectorAll('#teams-full-grid .team-card').forEach(card => {
          if (filter === 'all') {
            card.style.display = '';
          } else if (filter === 'recreational' || filter === 'competitive') {
            card.style.display = card.dataset.type === filter ? '' : 'none';
          } else {
            // age filter: kids / youth / adults
            card.style.display = card.dataset.age.includes(filter) ? '' : 'none';
          }
        });
      });
    });
    document.querySelectorAll('.shop-tab').forEach(t => {
      t.addEventListener('click', function() {
        this.closest('.shop-cat-tabs').querySelectorAll('.shop-tab').forEach(x=>x.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  // Scroll: make nav solid on homepage when scrolled
  let _isHome = true;
  const _tickerTrack = document.querySelector('.ticker-track');
  const _parallaxBg = document.querySelector('.parallax-bg');
  window.addEventListener('scroll', () => {
    if (_isHome) _nav.classList.toggle('scrolled', window.scrollY > 60);
    if (_tickerTrack) {
      const halfWidth = _tickerTrack.scrollWidth / 2;
      const offset = (window.scrollY * 0.4) % halfWidth;
      _tickerTrack.style.transform = `translateX(-${offset}px)`;
    }
    if (_parallaxBg) {
      const banner = _parallaxBg.parentElement;
      const rect = banner.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const shift = (progress - 0.5) * 320;
        _parallaxBg.style.transform = `translateY(${shift}px)`;
      }
    }
  }, { passive: true });

  function toggleDrawer() {
    const drawer = document.getElementById('nav-drawer');
    const btn = document.getElementById('hamburger');
    drawer.classList.toggle('open');
    btn.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    // Force nav to solid white while drawer is open so X icon is always visible
    if (isOpen) _nav.classList.add('solid');
    else if (_isHome && window.scrollY <= 60) _nav.classList.remove('solid');
  }
  function closeDrawer() {
    document.getElementById('nav-drawer').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.style.overflow = '';
    if (_isHome && window.scrollY <= 60) _nav.classList.remove('solid');
  }


  function openCoachModal(name, role, initials, bio) {
    if (name) {
      document.getElementById('modalName').textContent = name;
      document.getElementById('modalRole').textContent = role;
      document.getElementById('modalRoleSub').textContent = role;
      document.getElementById('modalInitials').textContent = initials;
      document.getElementById('modalBio').textContent = bio;
    }
    document.getElementById('coachModal').classList.add('open');
    document.querySelector('#coachModal .bottom-sheet').scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  function closeCoachModal() {
    document.getElementById('coachModal').classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── CART ──────────────────────────────────
  let _cart = []; // [{id, name, price, emoji, size, qty}]

  function openCart() {
    document.getElementById('cart-overlay').classList.add('open');
    document.getElementById('cart-drawer').classList.add('open');
  }
  function closeCart() {
    document.getElementById('cart-overlay').classList.remove('open');
    document.getElementById('cart-drawer').classList.remove('open');
  }

  function addToCart() {
    const id = document.getElementById('pd-name').dataset.productId;
    if (!id) return;
    const p = PRODUCTS[id];
    if (!p) return;
    const sizeEl = document.querySelector('.pd-size.selected');
    const size = sizeEl ? sizeEl.textContent : null;
    if (p.sizes && p.sizes.length && !size) {
      alert('Please select a size first.');
      return;
    }
    const qty = _pdQty;
    const existing = _cart.find(i => i.id === id && i.size === size);
    if (existing) { existing.qty += qty; }
    else { _cart.push({ id, name: p.name, price: p.price, emoji: p.emoji, emojiStyle: p.emojiStyle||'', image: (p.images && p.images[0]) || null, size, qty }); }
    renderCart();
    openCart();
  }

  function cartRemove(id, size) {
    _cart = _cart.filter(i => !(i.id === id && i.size === size));
    renderCart();
  }

  function cartChangeQty(id, size, delta) {
    const item = _cart.find(i => i.id === id && i.size === size);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    renderCart();
  }

  function renderCart() {
    const itemsEl = document.getElementById('cart-items');
    const footerEl = document.getElementById('cart-footer');
    const badge = document.getElementById('cart-badge');
    const totalQty = _cart.reduce((s, i) => s + i.qty, 0);

    badge.style.display = totalQty > 0 ? 'block' : 'none';
    badge.textContent = totalQty;
    const drawerBadge = document.getElementById('drawer-cart-badge');
    if (drawerBadge) { drawerBadge.style.display = totalQty > 0 ? 'inline' : 'none'; drawerBadge.textContent = totalQty; }

    if (_cart.length === 0) {
      itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
      footerEl.style.display = 'none';
      return;
    }

    itemsEl.innerHTML = _cart.map(item => {
      const priceNum = parseFloat(item.price.replace('€',''));
      const linePrice = isNaN(priceNum) ? item.price : '€' + (priceNum * item.qty).toFixed(2).replace('.00','');
      return `
        <div class="cart-item">
          <div class="cart-item-img">${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:contain;border-radius:3px;">` : `<span style="${item.emojiStyle}">${item.emoji}</span>`}</div>
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">${item.size ? 'Size: ' + item.size : ''}</div>
            <div class="cart-item-qty">
              <button onclick="cartChangeQty('${item.id}','${item.size}',-1)">−</button>
              <span>${item.qty}</span>
              <button onclick="cartChangeQty('${item.id}','${item.size}',1)">+</button>
            </div>
            <span class="cart-item-remove" onclick="cartRemove('${item.id}','${item.size}')">Remove</span>
          </div>
          <div class="cart-item-price">${linePrice}</div>
        </div>`;
    }).join('');

    const subtotal = _cart.reduce((s, i) => {
      const n = parseFloat(i.price.replace('€',''));
      return s + (isNaN(n) ? 0 : n * i.qty);
    }, 0);
    document.getElementById('cart-subtotal-val').textContent = subtotal > 0 ? '€' + subtotal.toFixed(2).replace('.00','') : '—';
    footerEl.style.display = 'block';
  }



  let _currentEventId = null;

  function showEvent(id) {
    const e = EVENTS[id];
    if (!e) return;
    _currentEventId = id;
    history.replaceState(null, '', '#event/' + id);
    showPage('event-detail');

    // hero
    const heroImg = document.getElementById('ed-hero-img');
    heroImg.style.cssText = `position:absolute; inset:0; background:linear-gradient(135deg,#111D42,#1C2B5E); display:flex; align-items:center; justify-content:center; ${e.emojiStyle||''}`;
    heroImg.innerHTML = `<span style="font-size:80px; opacity:.3;">${e.emoji}</span>`;

    const typeChip = document.getElementById('ed-type-chip');
    typeChip.textContent = e.type;
    typeChip.className = 'event-type-chip ' + e.typeClass;

    document.getElementById('ed-title').textContent = e.title;
    document.getElementById('ed-date').textContent = e.date;
    document.getElementById('ed-time').textContent = e.time;
    document.getElementById('ed-location').textContent = e.location;
    document.getElementById('ed-maps-link').href = 'https://maps.google.com/?q=' + encodeURIComponent(e.location);

    // description — preserve newlines
    const descEl = document.getElementById('ed-description');
    descEl.innerHTML = e.description.split('\n\n').map(p => `<p style="margin-bottom:16px;">${p}</p>`).join('');

    // registration card
    const regCard = document.getElementById('ed-registration-card');
    if (e.registration === 'paid') {
      regCard.innerHTML = `
        <div style="font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--navy); letter-spacing:.04em; margin-bottom:4px;">Tickets</div>
        <div style="font-size:32px; font-weight:700; color:var(--navy); margin-bottom:4px;">${e.price}</div>
        <div style="font-size: 13px; color:var(--muted); margin-bottom:20px;">per person</div>
        <button class="btn btn-primary" style="width:100%; margin-bottom:12px;" onclick="openPayment('${id}')">Get Tickets</button>
        <p style="font-size: 13px; color:var(--muted); text-align:center;">🔒 Secure checkout</p>`;
    } else if (e.registration === 'free') {
      regCard.innerHTML = `
        <div style="font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--navy); letter-spacing:.04em; margin-bottom:16px;">Register</div>
        <p style="font-size:13px; color:var(--muted); margin-bottom:20px;">Free entry — registration helps us plan capacity.</p>
        <div class="form-group"><label class="form-label">Name</label><input class="form-input" id="ed-reg-name" placeholder="Your name"></div>
        <div class="form-group" style="margin-top:12px;"><label class="form-label">Email</label><input class="form-input" id="ed-reg-email" type="email" placeholder="you@example.com"></div>
        <button class="btn btn-primary" style="width:100%; margin-top:16px;" onclick="completeRegistration('${id}')">Register for Free</button>`;
    } else if (e.registration === 'booking') {
      regCard.innerHTML = `
        <div style="font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--navy); letter-spacing:.04em; margin-bottom:4px;">Join a Session</div>
        <div style="background:rgba(28,43,94,.06); border-radius:4px; padding:12px 14px; margin-bottom:16px;">
          <div style="font-size:13px; font-weight:600; color:var(--navy); margin-bottom:2px;">Members</div>
          <div style="font-size:13px; color:var(--muted);">Free · no booking needed, just show up</div>
        </div>
        <div style="background:rgba(28,43,94,.06); border-radius:4px; padding:12px 14px; margin-bottom:20px;">
          <div style="font-size:13px; font-weight:600; color:var(--navy); margin-bottom:6px;">Guests &amp; external athletes</div>
          <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px;">
            <div style="font-size:13px; color:var(--muted);">Drop-in (per session)</div>
            <div style="font-size:15px; font-weight:700; color:var(--navy);">€8</div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:baseline;">
            <div style="font-size:13px; color:var(--muted);">Monthly pass</div>
            <div style="font-size:15px; font-weight:700; color:var(--navy);">€25</div>
          </div>
        </div>
        <button class="btn btn-primary" style="width:100%;" onclick="openGymBooking()">Book a Spot →</button>`;
    } else {
      regCard.innerHTML = `
        <div style="font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--navy); letter-spacing:.04em; margin-bottom:12px;">Free Entry</div>
        <p style="font-size:13px; color:var(--muted); margin-bottom:0;">No registration needed — just show up! See you there.</p>`;
    }
  }

  let _registeredEvents = new Set();

  function completeRegistration(id) {
    _registeredEvents.add(id);
    const regCard = document.getElementById('ed-registration-card');
    const e = EVENTS[id];
    regCard.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
        <span style="font-size:24px;">✅</span>
        <div style="font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--navy); letter-spacing:.04em;">You're Registered!</div>
      </div>
      <p style="font-size:13px; color:var(--muted);">See you at <strong>${e.title}</strong> on ${e.date}. A confirmation will be sent to your email.</p>`;
  }

  function openPayment(id) {
    const e = EVENTS[id];
    if (!e) return;
    _currentEventId = id;
    document.getElementById('pm-price').textContent = e.price;
    document.getElementById('pm-event-name').textContent = e.title + ' · ' + e.date;
    const platform = e.paymentPlatform || 'Mollie';
    document.getElementById('pm-platform-chip').textContent = 'via ' + platform;
    document.getElementById('pm-platform-name').textContent = platform;
    document.getElementById('pm-continue-label').textContent = platform;
    document.getElementById('pm-step2-platform').textContent = platform;
    // reset to step 1
    document.getElementById('pm-step-1').style.display = 'block';
    document.getElementById('pm-step-2').style.display = 'none';
    document.getElementById('pm-name').value = '';
    document.getElementById('pm-email').value = '';
    document.getElementById('payment-overlay').classList.add('open'); document.body.style.overflow='hidden';
  }

  function pmContinue() {
    const email = document.getElementById('pm-email').value || 'your email';
    document.getElementById('pm-step2-email').textContent = email;
    document.getElementById('pm-step-1').style.display = 'none';
    document.getElementById('pm-step-2').style.display = 'block';
  }

  function pmDone() {
    const id = _currentEventId;
    closePayment();
    if (id) {
      _registeredEvents.add(id);
      const regCard = document.getElementById('ed-registration-card');
      const e = EVENTS[id];
      if (regCard && e) {
        regCard.innerHTML = `
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
            <span style="font-size:24px;">✅</span>
            <div style="font-family:'Bebas Neue',sans-serif; font-size:22px; color:var(--navy); letter-spacing:.04em;">Ticket Confirmed!</div>
          </div>
          <p style="font-size:13px; color:var(--muted);">Your ticket for <strong>${e.title}</strong> on ${e.date} is confirmed.</p>`;
      }
    }
  }

  function closePayment() {
    document.getElementById('payment-overlay').classList.remove('open'); document.body.style.overflow='';
  }

  let _gymType = 'single';
  let _gymSelectedDates = new Set();

  const _gymDayConfig = { 2: { label: 'Tue', time: '20:00–22:00' }, 6: { label: 'Sat', time: '10:00–12:00' } };
  const _gymMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const _gymMonthsFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function copyEventLink() {
    const url = location.href;
    navigator.clipboard.writeText(url).then(function() {
      const lbl = document.getElementById('ed-share-label');
      const btn = document.getElementById('ed-share-btn');
      if (!lbl) return;
      lbl.textContent = 'Copied!';
      btn.style.borderColor = '#2a7a4a';
      btn.style.color = '#2a7a4a';
      setTimeout(function() {
        lbl.textContent = 'Share';
        btn.style.borderColor = '';
        btn.style.color = 'var(--navy)';
      }, 2000);
    }).catch(function() {
      // Fallback: prompt with URL
      prompt('Copy this link:', url);
    });
  }

  // On load: if URL has #event/<id>, go straight to that event
  (function() {
    const hash = location.hash;
    if (hash && hash.startsWith('#event/')) {
      const id = hash.slice(7);
      if (EVENTS[id]) showEvent(id);
    }
  })();

  function openGymBooking() {
    _gymType = 'single';
    _gymSelectedDates = new Set();
    ['gym-step-1','gym-step-dates','gym-step-monthly','gym-step-contact','gym-step-done'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
    document.getElementById('gym-step-1').style.display = 'block';
    document.getElementById('gym-type-single').style.border = '2px solid var(--navy)';
    document.getElementById('gym-type-monthly').style.border = '2px solid var(--border)';
    document.getElementById('gym-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeGymBooking() {
    document.getElementById('gym-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function selectGymType(type) {
    _gymType = type;
    document.getElementById('gym-type-single').style.border = type === 'single' ? '2px solid var(--navy)' : '2px solid var(--border)';
    document.getElementById('gym-type-monthly').style.border = type === 'monthly' ? '2px solid var(--navy)' : '2px solid var(--border)';
  }

  function gymTypeNext() {
    document.getElementById('gym-step-1').style.display = 'none';
    if (_gymType === 'monthly') {
      // Fill today's date and reset consent
      const today = new Date();
      const formatted = `${today.getDate()} ${_gymMonthsFull[today.getMonth()]} ${today.getFullYear()}`;
      document.getElementById('gym-monthly-start-date').textContent = formatted;
      document.getElementById('gym-monthly-consent').checked = false;
      const btn = document.getElementById('gym-monthly-pay-btn');
      btn.disabled = true; btn.style.opacity = '.5';
      document.getElementById('gym-step-monthly').style.display = 'block';
    } else {
      buildGymDateList();
      document.getElementById('gym-step-dates').style.display = 'block';
    }
  }

  function gymBack(from) {
    ['gym-step-dates','gym-step-monthly','gym-step-contact'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
    if (from === 'contact') {
      document.getElementById('gym-step-dates').style.display = 'block';
    } else {
      document.getElementById('gym-step-1').style.display = 'block';
    }
  }

  function buildGymDateList() {
    _gymSelectedDates = new Set();
    const container = document.getElementById('gym-dates-list');
    container.innerHTML = '';
    const today = new Date(); today.setHours(0,0,0,0);
    const end = new Date(today); end.setMonth(end.getMonth() + 3);
    const datesByMonth = {};
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    while (d <= end) {
      if (_gymDayConfig[d.getDay()]) {
        const mKey = d.getFullYear() + '-' + d.getMonth();
        if (!datesByMonth[mKey]) datesByMonth[mKey] = { label: _gymMonthsFull[d.getMonth()] + ' ' + d.getFullYear(), dates: [] };
        datesByMonth[mKey].dates.push(new Date(d));
      }
      d.setDate(d.getDate() + 1);
    }
    Object.values(datesByMonth).forEach(group => {
      const heading = document.createElement('div');
      heading.style.cssText = 'font-size: 13px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin:12px 0 8px;';
      heading.textContent = group.label;
      container.appendChild(heading);
      group.dates.forEach(date => {
        const cfg = _gymDayConfig[date.getDay()];
        // Use local date string to avoid UTC timezone shift
        const dateKey = date.getFullYear() + '-' + String(date.getMonth()+1).padStart(2,'0') + '-' + String(date.getDate()).padStart(2,'0');
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border:1px solid var(--border); border-radius:4px; margin-bottom:6px; cursor:pointer; transition:border-color .15s;';
        const chk = document.createElement('div');
        chk.style.cssText = 'width:20px;height:20px;border:2px solid var(--border);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;';
        const label = document.createElement('div');
        label.innerHTML = '<span style="font-weight:600; font-size:14px;">' + cfg.label + ' ' + date.getDate() + ' ' + _gymMonths[date.getMonth()] + '</span><span style="font-size: 13px; color:var(--muted); margin-left:10px;">' + cfg.time + '</span>';
        row.appendChild(label);
        row.appendChild(chk);
        row.onclick = () => toggleGymDate(dateKey, cfg, row, chk);
        container.appendChild(row);
      });
    });
    updateGymSummary();
  }

  function toggleGymDate(key, cfg, row, chk) {
    if (_gymSelectedDates.has(key)) {
      _gymSelectedDates.delete(key);
      row.style.borderColor = 'var(--border)';
      row.style.background = '';
      chk.textContent = '';
      chk.style.borderColor = 'var(--border)';
      chk.style.color = '';
    } else {
      _gymSelectedDates.add(key);
      row.style.borderColor = 'var(--navy)';
      row.style.background = '#f0f4ff';
      chk.textContent = '✓';
      chk.style.borderColor = 'var(--navy)';
      chk.style.color = 'var(--navy)';
      chk.style.fontWeight = '700';
    }
    updateGymSummary();
  }

  function updateGymSummary() {
    const n = _gymSelectedDates.size;
    document.getElementById('gym-summary-text').textContent = n === 0 ? 'No sessions selected' : `${n} session${n>1?'s':''} selected`;
    document.getElementById('gym-summary-price').textContent = `€${n * 8}`;
    const btn = document.getElementById('gym-add-cart-btn');
    btn.disabled = n === 0;
    btn.style.opacity = n === 0 ? '0.5' : '1';
  }

  function gymDatesNext() {
    const n = _gymSelectedDates.size;
    if (n === 0) return;
    // Build summary text
    const lines = [..._gymSelectedDates].map(key => {
      const parts = key.split('-');
      const d = new Date(+parts[0], +parts[1]-1, +parts[2]);
      const cfg = _gymDayConfig[d.getDay()];
      return (cfg ? cfg.label + ' ' + d.getDate() + ' ' + _gymMonths[d.getMonth()] + ' · ' + cfg.time : key);
    }).join('<br>');
    document.getElementById('gym-contact-summary').innerHTML =
      `<strong>${n} session${n>1?'s':''} · €${n*8}</strong><br><span style="color:var(--muted);font-size: 13px;margin-top:4px;display:block;">${lines}</span>`;
    document.getElementById('gym-pay-btn').textContent = `Pay with Mollie → (€${n*8})`;
    document.getElementById('gym-step-dates').style.display = 'none';
    document.getElementById('gym-step-contact').style.display = 'block';
  }

  function gymMonthlyConsentChange() {
    const checked = document.getElementById('gym-monthly-consent').checked;
    const btn = document.getElementById('gym-monthly-pay-btn');
    btn.disabled = !checked;
    btn.style.opacity = checked ? '1' : '.5';
  }

  function gymPayNow(type) {
    ['gym-step-monthly','gym-step-contact'].forEach(id => {
      document.getElementById(id).style.display = 'none';
    });
    document.getElementById('gym-done-title').textContent = type === 'monthly' ? 'Pass Confirmed!' : 'Booking Confirmed!';
    document.getElementById('gym-done-msg').textContent = type === 'monthly'
      ? 'Your monthly pass is active. Just show up any Tuesday or Saturday!'
      : `Your ${_gymSelectedDates.size} session${_gymSelectedDates.size>1?'s are':' is'} booked. See you on the mat!`;
    document.getElementById('gym-step-done').style.display = 'block';
  }

  function submitGymBooking() {} // legacy stub

  function submitGymBooking() {
    const email = document.getElementById('gym-email').value || 'your email';
    document.getElementById('gym-confirm-email').textContent = email;
    document.getElementById('gym-confirm-text').textContent = `See you ${_gymSession} at Koperslagerstraat 8, Rotterdam.`;
    document.getElementById('gym-step-1').style.display = 'none';
    document.getElementById('gym-step-2').style.display = 'block';
  }



  const SIZE_CHARTS = {
    sweat_uni: {
      note: 'Measurements refer to body measurements in cm. The garment runs true to size.',
      tables: [
        {
          label: '',
          headers: ['Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
          rows: [
            ['Chest (cm)', '84–88', '88–92', '92–96', '96–100', '100–104', '104–108'],
            ['Waist (cm)', '70–74', '74–78', '78–82', '82–86', '86–90', '90–94'],
            ['Body length (cm)', '64', '66', '68', '70', '72', '74'],
          ]
        }
      ]
    },
    sweat_youth: {
      note: 'Measurements refer to body measurements in cm.',
      tables: [
        {
          label: '',
          headers: ['Size', '6–8y', '8–10y', '10–12y', '12–14y', '14–16y'],
          rows: [
            ['Height (cm)', '116–128', '128–140', '140–152', '152–164', '164–176'],
            ['Chest (cm)', '62–67', '67–72', '72–77', '77–82', '82–87'],
            ['Body length (cm)', '46', '49', '52', '55', '58'],
          ]
        }
      ]
    },
    tee_man: {
      note: 'Garment measurements in cm. Measure the item flat.',
      tables: [
        {
          label: '',
          headers: ['Size', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
          rows: [
            ['Length (cm)', '67.5', '70', '72.5', '75', '77.5', '80', '82.5', '85', '87.5'],
            ['Width (cm)',  '44.5', '48', '51.5', '55', '58.5', '62', '65.5', '69', '72.5'],
          ]
        }
      ]
    },
    tee_woman: {
      note: 'Garment measurements in cm. Measure the item flat.',
      tables: [
        {
          label: '',
          headers: ['Size', 'XS', 'S', 'M', 'L', 'XL', '2XL'],
          rows: [
            ['Length (cm)', '65', '67', '69', '71', '73', '75'],
            ['Width (cm)',  '40', '44', '48', '52', '56', '60'],
          ]
        }
      ]
    },
    tee_child: {
      note: 'Garment measurements in cm. Measure the item flat.',
      tables: [
        {
          label: '',
          headers: ['Size', 'XS (3–4y)', 'S (5–6y)', 'M (7–8y)', 'L (9–11y)', 'XL (12–13y)'],
          rows: [
            ['Length (cm)',       '45', '50', '55', '60', '65'],
            ['Width (cm)',        '33', '36', '39', '52', '44.5'],
            ['Sleeve length (cm)','14', '15', '16', '17', '18'],
          ]
        }
      ]
    },
  };

  let _currentSizeChartKey = null;

  function openSizeChart() {
    const p = PRODUCTS[document.getElementById('pd-name').dataset.productId];
    if (!p || !p.sizeChartKey) return;
    const chart = SIZE_CHARTS[p.sizeChartKey];
    if (!chart) return;
    _currentSizeChartKey = p.sizeChartKey;

    document.getElementById('size-chart-title').textContent = p.name + ' — Size Guide';
    document.getElementById('size-chart-note').textContent = chart.note || '';

    const container = document.getElementById('size-chart-tables');
    container.innerHTML = chart.tables.map(t => {
      const thCells = t.headers.map((h, i) =>
        `<th style="padding:9px 14px; text-align:${i===0?'left':'center'}; font-size: 13px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--navy); border-bottom:2px solid var(--navy); white-space:nowrap;">${h}</th>`
      ).join('');
      const rows = t.rows.map((row, ri) =>
        `<tr style="background:${ri%2===0?'#f9f8f6':'white'};">${row.map((cell, ci) =>
          `<td style="padding:8px 14px; text-align:${ci===0?'left':'center'}; font-size:13px; color:${ci===0?'#333':'#555'}; font-weight:${ci===0?'600':'400'}; border-bottom:1px solid #eee;">${cell}</td>`
        ).join('')}</tr>`
      ).join('');
      return `${t.label ? `<div style="font-size: 13px; font-weight:700; color:var(--gold); text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px;">${t.label}</div>` : ''}
      <div style="overflow-x:auto; margin-bottom:20px;"><table style="width:100%; border-collapse:collapse; min-width:360px;">
        <thead><tr>${thCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
    }).join('');

    document.getElementById('size-chart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSizeChart() {
    document.getElementById('size-chart-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  let _pdQty = 1;
  let _pdCurrentCta = null;

  function showProduct(id) {
    const p = PRODUCTS[id];
    if (!p) return;
    showPage('product-detail');

    document.getElementById('pd-cat').textContent = p.cat;
    const pdNameEl = document.getElementById('pd-name');
    pdNameEl.textContent = p.name;
    pdNameEl.dataset.productId = id;
    document.getElementById('pd-price').textContent = p.price;
    document.getElementById('pd-colors').textContent = p.colors || '';

    // gallery
    _galleryImages = p.images && p.images.length ? p.images : [];
    _galleryIndex = 0;
    renderGallery(p);
    const badge = document.getElementById('pd-new-badge');
    badge.style.display = p.isNew ? 'block' : 'none';

    // sizes
    const sizesSection = document.getElementById('pd-sizes-section');
    const sizesEl = document.getElementById('pd-sizes');
    const sizeGuideLink = document.getElementById('pd-size-guide-link');
    if (p.sizes && p.sizes.length) {
      sizesSection.style.display = 'block';
      sizesEl.innerHTML = p.sizes.map(s =>
        `<div class="pd-size" onclick="selectSize(this)">${s}</div>`
      ).join('');
      sizeGuideLink.style.display = p.sizeChartKey ? 'inline' : 'none';
    } else {
      sizesSection.style.display = 'none';
      sizeGuideLink.style.display = 'none';
    }

    // qty
    document.getElementById('pd-qty-section').style.display = p.noQty ? 'none' : 'block';
    _pdQty = 1;
    document.getElementById('pd-qty-val').textContent = '1';

    // CTA
    const ctaBtn = document.getElementById('pd-cta-btn');
    ctaBtn.textContent = p.cta || 'Add to Cart';
    ctaBtn.onclick = p.ctaAction ? new Function(p.ctaAction) : addToCart;

    // description
    document.getElementById('pd-desc').textContent = p.desc || '';

    // details list
    const dl = document.getElementById('pd-details-list');
    dl.innerHTML = (p.details || []).map(d =>
      d.startsWith('⚠️')
        ? `<li style="font-size:13px; color:#8a5200; background:#fff8ee; border:1px solid #f5d9a0; border-radius:3px; padding:8px 12px; margin-top:4px; list-style:none;">${d}</li>`
        : `<li style="font-size:14px; color:#555; padding-left:20px; position:relative;"><span style="position:absolute;left:0;color:var(--gold);">✦</span> ${d}</li>`
    ).join('');
  }

  function filterTeamsMobile() {
    const type = document.getElementById('filter-type').value;
    const age  = document.getElementById('filter-age').value;
    document.querySelectorAll('#teams-full-grid .team-card').forEach(card => {
      const typeOk = type === 'all' || card.dataset.type === type;
      const ageOk  = age  === 'all' || card.dataset.age.includes(age);
      card.style.display = (typeOk && ageOk) ? '' : 'none';
    });
  }

  function filterShop(btn) {
    const filter = btn.dataset.filter;
    btn.closest('.filter-bar').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#page-shop .product-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
    });
  }

  let _galleryImages = [];
  let _galleryIndex = 0;

  function renderGallery(p) {
    const mainEl = document.getElementById('pd-main-img');
    const trackEl = document.getElementById('pd-img-track');
    const thumbsEl = document.getElementById('pd-thumbs');
    const dotsEl = document.getElementById('pd-dots');
    const emojiEl = document.getElementById('pd-emoji-fallback');
    const badge = document.getElementById('pd-new-badge');
    const prevBtn = document.getElementById('pd-prev');
    const nextBtn = document.getElementById('pd-next');

    badge.style.display = p.isNew ? 'block' : 'none';

    if (_galleryImages.length > 0) {
      emojiEl.textContent = '';
      mainEl.style.cssText = 'min-height:360px; position:relative; overflow:hidden;';

      // Build slide strip
      trackEl.innerHTML = _galleryImages.map(img =>
        `<div class="pd-img-slide" style="background-image:url('${img}');"></div>`
      ).join('');
      trackEl.style.transition = 'none';
      trackEl.style.transform = 'translateX(0)';

      if (_galleryImages.length > 1) {
        thumbsEl.style.display = 'flex';
        thumbsEl.innerHTML = _galleryImages.map((img, i) =>
          `<div class="pd-thumb${i===0?' active':''}" style="background-image:url('${img}');" onclick="galleryGoTo(${i})"></div>`
        ).join('');
        dotsEl.innerHTML = _galleryImages.map((_, i) =>
          `<div class="pd-dot${i===0?' active':''}" onclick="galleryGoTo(${i})"></div>`
        ).join('');
      } else {
        thumbsEl.style.display = 'none';
        dotsEl.innerHTML = '';
      }

      prevBtn.style.display = _galleryImages.length > 1 ? 'flex' : 'none';
      nextBtn.style.display = _galleryImages.length > 1 ? 'flex' : 'none';
      setGalleryFrame(_galleryIndex);
    } else {
      // Emoji fallback
      trackEl.innerHTML = '';
      mainEl.style.cssText = (p.emojiStyle || '') + ' min-height:360px; display:flex; align-items:center; justify-content:center; font-size:120px; position:relative; overflow:hidden;';
      emojiEl.textContent = p.emoji || '';
      thumbsEl.style.display = 'none';
      dotsEl.innerHTML = '';
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }

  function setGalleryFrame(i) {
    const trackEl = document.getElementById('pd-img-track');
    const w = document.getElementById('pd-main-img').offsetWidth || 0;
    trackEl.style.transition = 'transform .32s cubic-bezier(.25,.46,.45,.94)';
    trackEl.style.transform = `translateX(${-i * w}px)`;
    document.querySelectorAll('.pd-thumb').forEach((t, ti) => t.classList.toggle('active', ti === i));
    document.querySelectorAll('.pd-dot').forEach((d, di) => d.classList.toggle('active', di === i));
    document.getElementById('pd-prev').style.display = _galleryImages.length > 1 ? 'flex' : 'none';
    document.getElementById('pd-next').style.display = _galleryImages.length > 1 ? 'flex' : 'none';
  }

  function galleryNav(dir) {
    _galleryIndex = (_galleryIndex + dir + _galleryImages.length) % _galleryImages.length;
    setGalleryFrame(_galleryIndex);
  }

  function galleryGoTo(i) {
    _galleryIndex = i;
    setGalleryFrame(i);
  }

  // Drag-to-slide on product image gallery
  (function() {
    let _dragStartX = null;
    let _dragStartIndex = 0;
    let _dragging = false;

    function getTrack() { return document.getElementById('pd-img-track'); }
    function getW()     { const m = document.getElementById('pd-main-img'); return m ? m.offsetWidth : 0; }

    document.addEventListener('touchstart', function(e) {
      if (!e.target.closest('#pd-main-img') || _galleryImages.length < 2) return;
      _dragStartX = e.touches[0].clientX;
      _dragStartIndex = _galleryIndex;
      _dragging = true;
      const t = getTrack();
      if (t) t.style.transition = 'none';
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
      if (!_dragging || _dragStartX === null) return;
      const dx = e.touches[0].clientX - _dragStartX;
      const w = getW();
      const base = -_dragStartIndex * w;
      // add rubber-band resistance at edges
      let offset = base + dx;
      const maxOffset = 0;
      const minOffset = -(_galleryImages.length - 1) * w;
      if (offset > maxOffset) offset = dx * 0.25;
      if (offset < minOffset) offset = minOffset + (offset - minOffset) * 0.25;
      const t = getTrack();
      if (t) t.style.transform = `translateX(${offset}px)`;
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
      if (!_dragging) return;
      _dragging = false;
      const dx = e.changedTouches[0].clientX - _dragStartX;
      const w = getW();
      // snap: move if dragged more than 60px or faster than 0.3px/ms
      let newIndex = _galleryIndex;
      if (dx < -60 && _galleryIndex < _galleryImages.length - 1) newIndex = _galleryIndex + 1;
      else if (dx > 60 && _galleryIndex > 0) newIndex = _galleryIndex - 1;
      _galleryIndex = newIndex;
      setGalleryFrame(_galleryIndex);
      _dragStartX = null;
    }, { passive: true });
  })();

  function selectSize(el) {
    el.closest('.pd-sizes').querySelectorAll('.pd-size').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
  }

  function changeQty(delta) {
    _pdQty = Math.max(1, _pdQty + delta);
    document.getElementById('pd-qty-val').textContent = _pdQty;
  }

  let _currentTeamId = null;

  function showJoin(teamId) {
    const id = teamId || _currentTeamId;
    showPage('join');
    const sel = document.getElementById('join-team-select');
    if (sel && id) sel.value = id;

    // Show trial notice for non-tryout teams
    const team = id && TEAMS[id];
    const isTrial = team && !team.tryout;
    const notice = document.getElementById('join-trial-notice');
    const heading = document.getElementById('join-form-heading');
    const submitBtn = document.getElementById('join-submit-btn');
    const pageTitle = document.getElementById('join-page-title');
    const pageIntro = document.getElementById('join-page-intro');

    if (notice) notice.style.display = isTrial ? 'block' : 'none';
    if (heading) heading.textContent = isTrial ? 'Book Your Trial Lessons' : 'Registration Form';
    if (submitBtn) submitBtn.textContent = isTrial ? 'Sign Up for Trial' : 'Send Registration';
    if (pageTitle) pageTitle.innerHTML = isTrial ? 'Come<br>Try Out' : 'Join<br>Hikari';
    if (pageIntro) pageIntro.textContent = isTrial
      ? 'Fill in the form and we\'ll confirm your two free trial sessions. No commitment needed until you decide you want to join.'
      : 'Fill in the form and we\'ll be in touch to find the right team for you.';
  }

  function showContact(subject) {
    showPage('contact');
    if (subject) {
      const sel = document.getElementById('contact-subject');
      if (sel) sel.value = subject;
    }
  }

  function doLogin() {
    document.getElementById('area-login-panel').style.display = 'none';
    document.getElementById('area-portal-panel').style.display = 'block';
  }
  function doLogout() {
    document.getElementById('area-portal-panel').style.display = 'none';
    document.getElementById('area-login-panel').style.display = 'block';
  }

  function renderMyAreaEvents() {
    const list = document.getElementById('area-events-list');
    const empty = document.getElementById('area-events-empty');
    if (!list) return;
    const ids = [..._registeredEvents].filter(id => EVENTS[id]);
    if (ids.length === 0) {
      list.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';
    list.innerHTML = ids.map(id => {
      const e = EVENTS[id];
      return `<div onclick="showEvent('${id}')" style="background:var(--white); border:1px solid var(--border); border-radius:4px; padding:20px 24px; display:grid; grid-template-columns:64px 1fr auto; gap:16px; align-items:center; margin-bottom:12px; cursor:pointer; transition:box-shadow .15s;" onmouseover="this.style.boxShadow='0 4px 16px rgba(0,0,0,.08)'" onmouseout="this.style.boxShadow='none'">
        <div class="event-date-box"><div class="event-date-day">${e.day}</div><div class="event-date-month">${e.month}</div></div>
        <div><div class="event-name">${e.title}</div><div class="event-meta">${e.location} · ${e.time}</div></div>
        <span style="font-size: 13px; font-weight:600; background:#e8f5e8; color:#2a6a2a; padding:4px 10px; border-radius:2px; white-space:nowrap;">Registered ›</span>
      </div>`;
    }).join('');
  }

  function showAreaTab(tab) {
    ['team','orders','profile','events'].forEach(t => {
      document.getElementById('area-' + t).style.display = t === tab ? 'block' : 'none';
      const el = document.getElementById('area-tab-' + t);
      el.style.background = t === tab ? 'var(--navy)' : 'transparent';
      el.style.color = t === tab ? 'var(--white)' : 'var(--text)';
    });
    if (tab === 'events') renderMyAreaEvents();
  }
