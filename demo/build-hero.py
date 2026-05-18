#!/usr/bin/env python3
"""
kanka için animasyonlu hero SVG üretici (CSS keyframe versiyon).

4 sahne, her biri 6 saniye, toplam 24 saniye döngü.

CSS @keyframes ile çok daha öngörülebilir — GitHub README ve tüm modern tarayıcılarda çalışır.
"""

W = 900
H = 580
BG = "#1e1e2e"
CYAN = "#94e2d5"
ORANGE = "#fab387"
PINK = "#f5c2e7"
FG = "#cdd6f4"
DIM = "#7f849c"
GREEN = "#a6e3a1"
YELLOW = "#f9e2af"
RED = "#f38ba8"
BLUE = "#89b4fa"
PURPLE = "#cba6f7"
ACCENT = "#94e2d5"
FONT_SIZE = 15
LINE_H = 22

SCENE_DUR = 6
NUM_SCENES = 8
TOTAL = SCENE_DUR * NUM_SCENES  # 48

def t(x, y, content, fill=FG, size=FONT_SIZE, weight=""):
    """Basit text element."""
    w = f' font-weight="{weight}"' if weight else ""
    content = (content.replace("&", "&amp;")
                      .replace("<", "&lt;")
                      .replace(">", "&gt;"))
    return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}"{w}>{content}</text>'


def make_css():
    """
    CSS keyframes — her sahne için ayrı animation.

    Sahne i için zamanlama (yüzdesel):
      0%       → opacity 0  (gizli)
      a%       → opacity 0  (henüz)
      b%       → opacity 1  (fade in tamam, görünür)
      c%       → opacity 1  (görünür)
      d%       → opacity 0  (fade out tamam)
      100%     → opacity 0

    Sahne uzunluğu: 25% (6 saniye / 24 saniye)
    Fade süresi: %1 (≈0.24 saniye)
    """
    css = []
    for i in range(NUM_SCENES):
        # Toplam 24sn içinde bu sahnenin başlangıç/bitiş yüzdesi
        start_pct = (i * SCENE_DUR / TOTAL) * 100  # 0, 25, 50, 75
        end_pct = ((i + 1) * SCENE_DUR / TOTAL) * 100  # 25, 50, 75, 100
        fade_in_pct = start_pct + 1  # %1 fade in
        fade_out_pct = end_pct - 1   # %1 fade out

        # i=0 için: %0 görünür başlasın diye trick - tüm scene 1 görünür baslamali
        # Çünkü loop'ta da baslangic = 0 olunca, scene1 görünür olmalı
        if i == 0:
            css.append(f"""@keyframes scene-{i+1} {{
  0%   {{ opacity: 1; }}
  {fade_in_pct:.2f}%  {{ opacity: 1; }}
  {fade_out_pct:.2f}% {{ opacity: 1; }}
  {end_pct:.2f}% {{ opacity: 0; }}
  99.99% {{ opacity: 0; }}
  100% {{ opacity: 1; }}
}}""")
        else:
            css.append(f"""@keyframes scene-{i+1} {{
  0%   {{ opacity: 0; }}
  {start_pct:.2f}%  {{ opacity: 0; }}
  {fade_in_pct:.2f}% {{ opacity: 1; }}
  {fade_out_pct:.2f}% {{ opacity: 1; }}
  {end_pct:.2f}% {{ opacity: 0; }}
  100% {{ opacity: 0; }}
}}""")

    # Class definitions
    for i in range(NUM_SCENES):
        css.append(f""".scene-{i+1} {{
  animation: scene-{i+1} {TOTAL}s infinite;
}}""")

    # Progress bar items
    for i in range(NUM_SCENES):
        start_pct = (i * SCENE_DUR / TOTAL) * 100
        end_pct = ((i + 1) * SCENE_DUR / TOTAL) * 100
        # Aktif yüzdeleri
        active_start = start_pct + 0.5
        active_end = end_pct - 0.5

        css.append(f"""@keyframes nav-{i+1} {{
  0%, {start_pct:.2f}%   {{ fill: {DIM}; font-weight: normal; }}
  {active_start:.2f}%, {active_end:.2f}% {{ fill: {ACCENT}; font-weight: bold; }}
  {end_pct:.2f}%, 100%   {{ fill: {DIM}; font-weight: normal; }}
}}""")
        css.append(f""".nav-{i+1} {{
  animation: nav-{i+1} {TOTAL}s infinite;
}}""")

    return "\n".join(css)


# ===== SAHNE İÇERİK animasyonu (sub-element fade) =====
def sub_anim_class(scene_idx, t_start_in_scene, t_end_in_scene=None):
    """
    Bir sahne içindeki alt elemanların belirme/kaybolma animasyonu için CSS class.
    t_start_in_scene: 0-1 arası (sahne içi yüzde)
    t_end_in_scene: opsiyonel, belirtilmezse sahne sonuna kadar görünür kalır.

    Tüm bunlar 24sn TOTAL animation'a göre yüzde.
    """
    scene_start_global = (scene_idx * SCENE_DUR / TOTAL) * 100
    scene_end_global = ((scene_idx + 1) * SCENE_DUR / TOTAL) * 100
    scene_pct_size = scene_end_global - scene_start_global

    appear_at = scene_start_global + t_start_in_scene * scene_pct_size
    fade_in_done = appear_at + 0.3  # 0.3% fade in

    if t_end_in_scene is None:
        # Sahne sonuna kadar görünür kalır
        return appear_at, fade_in_done, None, None, scene_end_global
    else:
        disappear_at = scene_start_global + t_end_in_scene * scene_pct_size
        fade_out_done = disappear_at + 0.3
        return appear_at, fade_in_done, disappear_at, fade_out_done, scene_end_global


def sub_keyframe(name, t_start_in_scene, scene_idx, t_end_in_scene=None):
    """Sub element için CSS keyframe."""
    appear, fade_in_done, disappear, fade_out_done, scene_end = sub_anim_class(scene_idx, t_start_in_scene, t_end_in_scene)
    scene_start = (scene_idx * SCENE_DUR / TOTAL) * 100

    if disappear is None:
        # Görünür kalır, sahne sonunda da hala görünür
        return f"""@keyframes {name} {{
  0%, {scene_start:.2f}% {{ opacity: 0; }}
  {appear:.2f}% {{ opacity: 0; }}
  {fade_in_done:.2f}%, {scene_end:.2f}% {{ opacity: 1; }}
  {scene_end + 0.01:.2f}%, 100% {{ opacity: 0; }}
}}"""
    else:
        return f"""@keyframes {name} {{
  0%, {scene_start:.2f}% {{ opacity: 0; }}
  {appear:.2f}% {{ opacity: 0; }}
  {fade_in_done:.2f}% {{ opacity: 1; }}
  {disappear:.2f}% {{ opacity: 1; }}
  {fade_out_done:.2f}%, 100% {{ opacity: 0; }}
}}"""


# ===== SAHNE 1: PERSONA =====
def scene1():
    elems = []
    elems.append(t(40, 60, "🎭 Aynı soru, farklı kişilik — anında değişir", fill=ACCENT, weight="bold", size=17))
    elems.append(t(40, 100, "$ kanka", fill=GREEN, weight="bold"))
    elems.append(t(40, 122, "> Bir fonksiyon nasıl yazılır?", fill=YELLOW))

    personas = [
        ("🤝 kanka", "Tamamdır kanka, hemen yazalım.", "function selam() { ... }", PURPLE),
        ("🧑‍🏫 hoca", "Önce 'fonksiyon' nedir bakalım — bir görevi", "tekrar tekrar yapan kod parçası...", BLUE),
        ("🧔 abi", "function add(a, b) { return a + b; }", "Bu kadar.", GREEN),
        ("💼 patron", "MVP için yeter: const fn = () => {}", "Sonra refactor ederiz.", YELLOW),
    ]

    inner_dur = 1 / len(personas)  # 0.25
    keyframes = []
    for i, (kisi, satir1, satir2, renk) in enumerate(personas):
        sub_start = i * inner_dur
        sub_end = sub_start + inner_dur
        gap = 0.05  # %5 fade
        anim_name = f"p1-{i}"
        keyframes.append(sub_keyframe(anim_name, sub_start, 0, sub_end))

        y = 165
        elems.append(f'''<g style="animation: {anim_name} {TOTAL}s infinite; opacity:0;">
            {t(40, y, "Aktif kişilik: " + kisi, fill=ACCENT, weight="bold")}
            {t(40, y + LINE_H + 8, satir1, fill=FG)}
            {t(40, y + LINE_H * 2 + 8, satir2, fill=renk)}
        </g>''')

    return "\n".join(keyframes), f'<g class="scene-1">{"".join(elems)}</g>'


# ===== SAHNE 2: GÜNLÜK =====
def scene2():
    elems = []
    elems.append(t(40, 60, "📓 Geliştirme günlüğü — kararları unutma", fill=ACCENT, weight="bold", size=17))

    entries = [
        ("> /gunluk yaz auth refresh token bug düzeltildi #fix #auth", YELLOW, 0.05),
        ("✓ Günlüğe yazdım [#fix #auth]", GREEN, 0.13),
        ("  → auth refresh token bug düzeltildi", DIM, 0.18),
        ("", FG, 0.22),
        ("> /gunluk yaz NextJS 15'e migrate başladı #frontend", YELLOW, 0.27),
        ("✓ Günlüğe yazdım [#frontend]", GREEN, 0.35),
        ("", FG, 0.40),
        ("> /gunluk bugun", YELLOW, 0.46),
        ("", FG, 0.49),
        ("📓 Bugün (2 giriş) — kanka", ACCENT, 0.54),
        ("─────────────────────────────────────────────", DIM, 0.57),
        ("  18.05.2026 14:23  [#fix #auth]", PURPLE, 0.62),
        ("  → auth refresh token bug düzeltildi", FG, 0.66),
        ("  18.05.2026 14:25  [#frontend]", PURPLE, 0.72),
        ("  → NextJS 15'e migrate başladı", FG, 0.77),
    ]

    keyframes = []
    y = 100
    for idx, (line_text, color, t_appear) in enumerate(entries):
        if line_text:
            anim_name = f"g2-{idx}"
            keyframes.append(sub_keyframe(anim_name, t_appear, 1))
            elems.append(f'<g style="animation: {anim_name} {TOTAL}s infinite; opacity:0;">{t(40, y, line_text, fill=color)}</g>')
        y += LINE_H

    return "\n".join(keyframes), f'<g class="scene-2">{"".join(elems)}</g>'


# ===== SAHNE 3: TERMINAL =====
def scene3():
    elems = []
    elems.append(t(40, 60, "🔔 Windows Terminal entegrasyonu — canlı tab title", fill=ACCENT, weight="bold", size=17))

    tab_y = 120
    tab_states = [
        ("kanka · hazır", GREEN, 0.0, 0.20),
        ("kanka · düşünüyor…", YELLOW, 0.20, 0.40),
        ("kanka · komut çalıştırıyor", BLUE, 0.40, 0.60),
        ("kanka · dosya okuyor", PURPLE, 0.60, 0.80),
        ("kanka · hazır ✓", GREEN, 0.80, 1.0),
    ]

    keyframes = []
    for idx, (label, color, start_pct, end_pct) in enumerate(tab_states):
        anim_name = f"tab-{idx}"
        keyframes.append(sub_keyframe(anim_name, start_pct, 2, end_pct))
        elems.append(f'''<g style="animation: {anim_name} {TOTAL}s infinite; opacity:0;">
            <rect x="40" y="{tab_y - 22}" width="430" height="34" rx="6" fill="#313244" stroke="{color}" stroke-width="2"/>
            {t(60, tab_y, "▶ " + label, fill=color, weight="bold")}
        </g>''')

    # Açıklama metinleri (hep görünür sahne 3 süresince)
    y = tab_y + 70
    info_lines = [
        ("Tab title canlı güncellenir:", ACCENT, True),
        ("  • Agent boştayken: 'hazır'", DIM, False),
        ("  • LLM düşünürken: 'düşünüyor…'", DIM, False),
        ("  • Bash çalışırken: 'komut çalıştırıyor'", DIM, False),
        ("  • Read sırasında: 'dosya okuyor'", DIM, False),
        ("", FG, False),
        ("30s+ süren tool'lar bitince:", ACCENT, True),
        ("  🔔 Masaüstü bildirim (OSC 9)", YELLOW, False),
    ]
    for line_text, color, bold in info_lines:
        if line_text:
            w = "bold" if bold else ""
            elems.append(t(40, y, line_text, fill=color, weight=w))
        y += LINE_H

    # Toast bildirim — sahnenin son %20'sinde
    keyframes.append(sub_keyframe("toast-3", 0.80, 2))
    toast_x = 540
    toast_y = 400
    elems.append(f'''<g style="animation: toast-3 {TOTAL}s infinite; opacity:0;">
        <rect x="{toast_x}" y="{toast_y}" width="320" height="80" rx="8" fill="#313244" stroke="{YELLOW}" stroke-width="2"/>
        {t(toast_x + 20, toast_y + 30, "🔔 kanka", fill=YELLOW, weight="bold")}
        {t(toast_x + 20, toast_y + 55, "cevabım hazır (32s)", fill=FG)}
    </g>''')

    return "\n".join(keyframes), f'<g class="scene-3">{"".join(elems)}</g>'


# ===== SAHNE 4: GÜNCELLEME =====
def scene4():
    elems = []
    elems.append(t(40, 60, "🔄 Otomatik güncelleme bildirimi — hep güncel kal", fill=ACCENT, weight="bold", size=17))

    y = 110
    logo_lines = [
        "  ╦╔═╔═╗╔╗╔╦╔═╔═╗",
        "  ╠╩╗╠═╣║║║╠╩╗╠═╣",
        "  ╩ ╩╩ ╩╝╚╝╩ ╩╩ ╩",
    ]
    for line in logo_lines:
        elems.append(t(40, y, line, fill=PURPLE, weight="bold"))
        y += LINE_H

    y += 5
    elems.append(t(40, y, "kanka v0.4.0  ·  Türkçe konuşan terminal kodlama asistanı", fill=FG))
    y += LINE_H
    elems.append(t(40, y, "/yardım komutlar  ·  /ekip subagent'lar  ·  /bilgi durum", fill=DIM, size=13))
    y += LINE_H + 10

    keyframes = []
    # Notice — sahne 4'ün %25'inde belirir
    keyframes.append(sub_keyframe("notice-4", 0.25, 3))
    elems.append(f'<g style="animation: notice-4 {TOTAL}s infinite; opacity:0;">{t(40, y, "📦 Yeni sürüm var: 0.4.0 → 0.5.0  ·  Güncellemek için: /güncelle", fill=YELLOW, weight="bold")}</g>')
    y += LINE_H + 15

    # Komut bloğu — %55
    keyframes.append(sub_keyframe("cmd-4", 0.55, 3))
    elems.append(f'''<g style="animation: cmd-4 {TOTAL}s infinite; opacity:0;">
        {t(40, y, "$ kanka update", fill=GREEN, weight="bold")}
        {t(40, y + LINE_H, "📡 npm registry kontrol ediliyor...", fill=BLUE)}
        {t(40, y + LINE_H * 2, "📦 Yeni sürüm var: 0.4.0 → 0.5.0", fill=YELLOW)}
        {t(40, y + LINE_H * 3, "📥 npm install -g @thorrangonak/kanka@0.5.0...", fill=DIM)}
        {t(40, y + LINE_H * 4, "✓ Tamamdır kanka! kanka@0.5.0 yüklendi.", fill=GREEN, weight="bold")}
    </g>''')

    return "\n".join(keyframes), f'<g class="scene-4">{"".join(elems)}</g>'


def progress_indicator():
    bar_y = H - 30
    items = []
    items.append(f'<line x1="40" y1="{bar_y - 22}" x2="{W - 40}" y2="{bar_y - 22}" stroke="{DIM}" stroke-width="1" opacity="0.3"/>')
    labels = ["🎭 Persona", "📓 Günlük", "🔔 Terminal", "🔄 Update", "🤝 Ekip", "🔗 Chain", "💰 Token", "🔌 Multi-LLM"]
    bar_x_start = 30
    bar_x_step = 110
    for i, label in enumerate(labels):
        x = bar_x_start + i * bar_x_step
        items.append(f'<text x="{x}" y="{bar_y}" font-size="11" class="nav-{i+1}">{label}</text>')
    return "".join(items)


# ===== SAHNE 5: SUBAGENT EKİBİ =====
def scene5():
    elems = []
    elems.append(t(40, 60, "🤝 9 uzman subagent ekibi — hepsi Türkçe konuşur", fill=ACCENT, weight="bold", size=17))
    elems.append(t(40, 92, "Her agent izole context'te çalışır, kendi uzmanlık alanında özelleşmiştir.", fill=DIM, size=13))

    # 9 agent — 3x3 grid, her biri kart şeklinde
    agents = [
        ("🔍 kasif",      "Kod keşif, hızlı recon",       CYAN,   GREEN),
        ("📋 planlayici", "Uygulama planı çıkarır",          BLUE,   YELLOW),
        ("⚙️  isci",       "Genel amaçlı uygulamacı",        PURPLE, PURPLE),
        ("🔎 gozden-geciren", "Code review, güvenlik",      ORANGE, RED),
        ("🏛️  mimar",       "Sistem mimarisi, trade-off", PINK,   PINK),
        ("🐛 hata-avcisi",  "Bug analizi, root cause",      RED,    ORANGE),
        ("🧪 test-yazari", "Test senaryo + test kodu",      GREEN,  GREEN),
        ("♻️  refactorcu",   "Davranış koruyarak refactor", YELLOW, YELLOW),
        ("📖 docs-yazari", "README, JSDoc, Mermaid",        BLUE,   BLUE),
    ]

    keyframes = []
    card_w = 260
    card_h = 75
    gap = 15
    grid_start_x = 40
    grid_start_y = 125

    for i, (isim, aciklama, border_color, accent_color) in enumerate(agents):
        row = i // 3
        col = i % 3
        x = grid_start_x + col * (card_w + gap)
        y = grid_start_y + row * (card_h + gap)

        # Her kart sırayla beliriyor — sahne başından itibaren
        t_appear = (i / len(agents)) * 0.6  # İlk %60'da hepsi belirsin
        anim_name = f"agent-{i}"
        keyframes.append(sub_keyframe(anim_name, t_appear, 4))

        elems.append(f'''<g style="animation: {anim_name} {TOTAL}s infinite; opacity:0;">
            <rect x="{x}" y="{y}" width="{card_w}" height="{card_h}" rx="8" fill="#313244" stroke="{border_color}" stroke-width="1.5" opacity="0.9"/>
            {t(x + 12, y + 25, isim, fill=accent_color, weight="bold", size=14)}
            {t(x + 12, y + 50, aciklama, fill=FG, size=12)}
            {t(x + 12, y + 65, "izole context · Türkçe", fill=DIM, size=10)}
        </g>''')

    # Alt yazı — tüm agentlar beliridikten sonra
    keyframes.append(sub_keyframe("agents-summary", 0.72, 4))
    elems.append(f'''<g style="animation: agents-summary {TOTAL}s infinite; opacity:0;">
        {t(40, 460, "Çağırmak için: `delege` tool veya /yap, /plan-yap, /yap-ve-incele zincirleri →", fill=YELLOW, weight="bold", size=14)}
    </g>''')

    return "\n".join(keyframes), f'<g class="scene-5">{"".join(elems)}</g>'


# ===== SAHNE 6: CHAIN + ASYNC =====
def scene6():
    elems = []
    elems.append(t(40, 60, "🔗 Chain pipeline + paralel async — tek komutla tam akış", fill=ACCENT, weight="bold", size=17))

    # Komut yazılıyor
    elems.append(t(40, 100, "> /yap kullanıcı kayıt formu ekle, validation + test", fill=YELLOW, weight="bold"))
    elems.append(t(40, 122, "↞ Chain başlatıldı: kasif → planlayici → isci", fill=DIM, size=13))

    # 3 aşamalı chain görseli — kartlar yatay sıralanmış, sağa doğru yıldızılı ok
    keyframes = []
    chain_y = 170
    card_w = 200
    card_h = 90
    gap = 50
    chain_start_x = 50

    chain_steps = [
        ("🔍 kasif",       "Kod keşif",         "✓ 4 dosya analiz edildi",       CYAN,   GREEN, 0.05),
        ("📋 planlayici", "Plan çıkar",         "✓ 3 adımlı plan hazır",       BLUE,   YELLOW, 0.25),
        ("⚙️ isci",         "Uygula",             "✓ 5 dosya yazıldı",            PURPLE, PURPLE, 0.45),
    ]

    for i, (isim, durum, sonuc, border, accent, t_appear) in enumerate(chain_steps):
        x = chain_start_x + i * (card_w + gap)
        anim_name = f"chain-{i}"
        keyframes.append(sub_keyframe(anim_name, t_appear, 5))

        # Kart
        elems.append(f'''<g style="animation: {anim_name} {TOTAL}s infinite; opacity:0;">
            <rect x="{x}" y="{chain_y}" width="{card_w}" height="{card_h}" rx="10" fill="#313244" stroke="{border}" stroke-width="2"/>
            {t(x + 15, chain_y + 28, isim, fill=accent, weight="bold", size=15)}
            {t(x + 15, chain_y + 52, durum + "...", fill=FG, size=12)}
            {t(x + 15, chain_y + 75, sonuc, fill=GREEN, size=11)}
        </g>''')

        # Ok işareti — sonraki karta
        if i < len(chain_steps) - 1:
            arrow_x = x + card_w + 5
            arrow_anim = f"arrow-{i}"
            keyframes.append(sub_keyframe(arrow_anim, t_appear + 0.10, 5))
            elems.append(f'''<g style="animation: {arrow_anim} {TOTAL}s infinite; opacity:0;">
                {t(arrow_x, chain_y + 55, "→", fill=ACCENT, weight="bold", size=22)}
            </g>''')

    # Sahne ortasında async/paralel örneği
    async_y = 305
    keyframes.append(sub_keyframe("async-title", 0.60, 5))
    elems.append(f'''<g style="animation: async-title {TOTAL}s infinite; opacity:0;">
        {t(40, async_y, "⚡ Veya 3 agent paralel async çalışsın:", fill=YELLOW, weight="bold", size=15)}
    </g>''')

    # Paralel çalışan 3 agent — yatay barlar
    async_bars = [
        ("🔍 kasif",      "frontend keşif",   CYAN,   0.62, 0.85),
        ("🧪 test-yazari", "backend test'leri", GREEN,  0.65, 0.88),
        ("🔎 gozden-geciren", "PR review",     ORANGE, 0.68, 0.92),
    ]
    bar_y_start = async_y + 35
    for i, (isim, gorev, color, appear, complete) in enumerate(async_bars):
        bar_y = bar_y_start + i * 35
        anim_name = f"async-{i}"
        keyframes.append(sub_keyframe(anim_name, appear, 5))

        # Loading bar — bar genişlediği için shimmer effect
        elems.append(f'''<g style="animation: {anim_name} {TOTAL}s infinite; opacity:0;">
            {t(50, bar_y + 15, isim, fill=color, weight="bold", size=13)}
            {t(220, bar_y + 15, gorev, fill=FG, size=12)}
            <rect x="480" y="{bar_y + 4}" width="380" height="18" rx="4" fill="#45475a" opacity="0.5"/>
        </g>''')

        # Doluyor bar (kompletlenmiş hali)
        complete_anim = f"async-{i}-done"
        keyframes.append(sub_keyframe(complete_anim, complete, 5))
        elems.append(f'''<g style="animation: {complete_anim} {TOTAL}s infinite; opacity:0;">
            <rect x="480" y="{bar_y + 4}" width="380" height="18" rx="4" fill="{color}" opacity="0.6"/>
            {t(865, bar_y + 17, "✓", fill=GREEN, weight="bold", size=14)}
        </g>''')

    return "\n".join(keyframes), f'<g class="scene-6">{"".join(elems)}</g>'


# ===== SAHNE 7: TOKEN TASARRUFU =====
def scene7():
    elems = []
    elems.append(t(40, 60, "💰 Token tasarrufu — daha az maliyet, daha hızlı cevap", fill=ACCENT, weight="bold", size=17))
    elems.append(t(40, 92, "3 katmanlı optimizasyon: cache + izole context + paralel çalışma", fill=DIM, size=13))

    keyframes = []

    # 3 büyük kısaltma kartı
    cards = [
        ("💾 Prompt Cache",     "~70%",  "Anthropic cache hit\nSistem prompt + skill'ler\n5dk TTL",  GREEN,  0.05),
        ("🔒 İzole Context",    "~50%",  "Subagent kendi context'inde\nAna sohbet şişmiyor\nsadece özet dönüyor",   BLUE,   0.20),
        ("⚡ Paralel Async",     "~3x",   "3 agent aynı anda çalışır\nWall-clock hız\nToplam token aynı",        PURPLE, 0.35),
    ]

    card_w = 270
    card_h = 140
    gap = 18
    cards_y = 125

    for i, (baslik, oran, aciklama, color, t_appear) in enumerate(cards):
        x = 40 + i * (card_w + gap)
        anim_name = f"token-{i}"
        keyframes.append(sub_keyframe(anim_name, t_appear, 6))

        # Kart
        lines_split = aciklama.split("\n")
        line_elems = ""
        for li, line in enumerate(lines_split):
            line_elems += t(x + 15, cards_y + 95 + li * 16, "• " + line, fill=FG, size=12)

        elems.append(f'''<g style="animation: {anim_name} {TOTAL}s infinite; opacity:0;">
            <rect x="{x}" y="{cards_y}" width="{card_w}" height="{card_h}" rx="10" fill="#313244" stroke="{color}" stroke-width="2"/>
            {t(x + 15, cards_y + 30, baslik, fill=color, weight="bold", size=15)}
            {t(x + card_w - 80, cards_y + 35, oran, fill=color, weight="bold", size=24)}
            {t(x + card_w - 80, cards_y + 53, "tasarruf", fill=DIM, size=10)}
            {t(x + 15, cards_y + 68, "─" * 28, fill=DIM, size=11)}
            {line_elems}
        </g>''')

    # Örnek senaryo bar grafiği — alt
    chart_y = 305
    keyframes.append(sub_keyframe("chart-title", 0.52, 6))
    elems.append(f'''<g style="animation: chart-title {TOTAL}s infinite; opacity:0;">
        {t(40, chart_y, "Örnek: 5 dosyalık refactor projesi — token karşılaştırması", fill=YELLOW, weight="bold", size=15)}
    </g>''')

    # 2 bar: "Çıplak" vs "kanka"
    bar_y_start = chart_y + 35
    bar_h = 36
    bar_x = 240
    bar_max_w = 600

    # Çıplak (referans)
    keyframes.append(sub_keyframe("bar-cıplak", 0.58, 6))
    elems.append(f'''<g style="animation: bar-cıplak {TOTAL}s infinite; opacity:0;">
        {t(50, bar_y_start + 24, "Çıplak LLM", fill=FG, weight="bold", size=14)}
        {t(50, bar_y_start + 40, "(cache yok)", fill=DIM, size=11)}
        <rect x="{bar_x}" y="{bar_y_start + 8}" width="{bar_max_w}" height="{bar_h}" rx="5" fill="{RED}" opacity="0.7"/>
        {t(bar_x + bar_max_w - 130, bar_y_start + 33, "~180,000 token · $1.80", fill=BG, weight="bold", size=13)}
    </g>''')

    # Kanka (optimize)
    bar_y2 = bar_y_start + bar_h + 25
    keyframes.append(sub_keyframe("bar-kanka", 0.68, 6))
    elems.append(f'''<g style="animation: bar-kanka {TOTAL}s infinite; opacity:0;">
        {t(50, bar_y2 + 24, "🔥 kanka", fill=ACCENT, weight="bold", size=14)}
        {t(50, bar_y2 + 40, "(opt. aktif)", fill=DIM, size=11)}
        <rect x="{bar_x}" y="{bar_y2 + 8}" width="{bar_max_w * 0.30}" height="{bar_h}" rx="5" fill="{GREEN}" opacity="0.85"/>
        {t(bar_x + bar_max_w * 0.30 + 10, bar_y2 + 33, "~54,000 token · $0.45  →  -70%", fill=GREEN, weight="bold", size=13)}
    </g>''')

    return "\n".join(keyframes), f'<g class="scene-7">{"".join(elems)}</g>'


# ===== SAHNE 8: MULTI-MODEL =====
def scene8():
    elems = []
    elems.append(t(40, 60, "🔌 İstediğin LLM'i bağla — tek paket, 10+ provider native", fill=ACCENT, weight="bold", size=17))
    elems.append(t(40, 92, "Claude, GPT, Gemini, GLM, Grok, Llama, Trendyol... API key koy, kullan", fill=DIM, size=13))

    keyframes = []

    # Üst kısım: 10 provider logosu — grid halinde sirayla beliriyor
    providers = [
        ("Claude",       "Anthropic",     "Opus 4.7 / Sonnet", "#d97757"),  # turuncu
        ("GPT",          "OpenAI",        "GPT-5 / o4",        "#10a37f"),  # yeşil
        ("Gemini",       "Google",        "2.5 Pro / Flash",   "#4285f4"),  # mavi
        ("GLM",          "Z.AI",          "GLM-5.1 / 4.6",     "#7c3aed"),  # mor
        ("Grok",         "xAI",           "Grok 4 / Fast",     "#1da1f2"),  # cyan
        ("Llama",        "Meta",          "3.3 / 4 (lokal)",   "#0668e1"),  # mavi
        ("DeepSeek",     "DeepSeek",      "V3 / R1",           "#6366f1"),  # indigo
        ("Trendyol",     "🇹🇷 yerel",     "Trendyol-LLM (TR)",   "#fa6b3a"),  # turuncu
        ("MiniMax",      "MiniMax",       "abab6.5",           "#ec4899"),  # pembe
        ("Ollama",       "lokal",         "şey çalıştır local",  "#52525b"),  # gri
    ]

    card_w = 165
    card_h = 75
    gap_x = 10
    gap_y = 10
    grid_y = 125
    cols = 5

    for i, (isim, saglayici, model, color) in enumerate(providers):
        row = i // cols
        col = i % cols
        x = 40 + col * (card_w + gap_x)
        y = grid_y + row * (card_h + gap_y)

        t_appear = (i / len(providers)) * 0.40  # İlk %40'ta tamamlansın
        anim_name = f"prov-{i}"
        keyframes.append(sub_keyframe(anim_name, t_appear, 7))

        # Türk ürünü Trendyol'a özel vurgu — daha kalın border
        border_width = "3" if "yerel" in saglayici else "1.5"

        elems.append(f'''<g style="animation: {anim_name} {TOTAL}s infinite; opacity:0;">
            <rect x="{x}" y="{y}" width="{card_w}" height="{card_h}" rx="8" fill="#313244" stroke="{color}" stroke-width="{border_width}" opacity="0.95"/>
            <circle cx="{x + 16}" cy="{y + 22}" r="8" fill="{color}"/>
            {t(x + 32, y + 27, isim, fill=color, weight="bold", size=14)}
            {t(x + 12, y + 47, saglayici, fill=DIM, size=11)}
            {t(x + 12, y + 64, model, fill=FG, size=10)}
        </g>''')

    # Komut bloğu — alt
    cmd_y = 320
    keyframes.append(sub_keyframe("login-title", 0.46, 7))
    elems.append(f'''<g style="animation: login-title {TOTAL}s infinite; opacity:0;">
        {t(40, cmd_y, "Tek komutla giriş:", fill=YELLOW, weight="bold", size=15)}
    </g>''')

    cmd_lines = [
        ("$ kanka",                                         GREEN,  0.50),
        ("> /giriş                                          # provider listesi açılır",          YELLOW, 0.55),
        ("> /model                                          # canlı model değiştir (Ctrl+P ile cycle)",  YELLOW, 0.65),
        ("",                                                FG,     0.70),
        ("# Veya .env'e koy, kanka otomatik bulur:",         DIM,    0.72),
        ("ANTHROPIC_API_KEY=sk-ant-...",                     FG,     0.75),
        ("OPENAI_API_KEY=sk-proj-...",                       FG,     0.78),
        ("GEMINI_API_KEY=AIza...",                           FG,     0.81),
        ("",                                                FG,     0.84),
        ("✨ OAuth da var: Claude Pro/Max ile $0 marginal cost", ACCENT, 0.87),
    ]

    y_cmd = cmd_y + 30
    for idx, (line, color, t_app) in enumerate(cmd_lines):
        if line:
            anim_name = f"loginline-{idx}"
            keyframes.append(sub_keyframe(anim_name, t_app, 7))
            elems.append(f'<g style="animation: {anim_name} {TOTAL}s infinite; opacity:0;">{t(50, y_cmd, line, fill=color, size=13)}</g>')
        y_cmd += 18

    return "\n".join(keyframes), f'<g class="scene-8">{"".join(elems)}</g>'


def build():
    s1_css, s1_g = scene1()
    s2_css, s2_g = scene2()
    s3_css, s3_g = scene3()
    s4_css, s4_g = scene4()
    s5_css, s5_g = scene5()
    s6_css, s6_g = scene6()
    s7_css, s7_g = scene7()
    s8_css, s8_g = scene8()

    css = (make_css() + "\n" + s1_css + "\n" + s2_css + "\n" + s3_css + "\n" +
           s4_css + "\n" + s5_css + "\n" + s6_css + "\n" + s7_css + "\n" + s8_css)

    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" font-family="Cascadia Code, Consolas, monospace">
  <defs>
    <style><![CDATA[
{css}
    ]]></style>
  </defs>

  <rect width="{W}" height="{H}" fill="{BG}" rx="12"/>

  <!-- macOS window butonları -->
  <circle cx="22" cy="22" r="6" fill="#FF5A54"/>
  <circle cx="42" cy="22" r="6" fill="#E6BF29"/>
  <circle cx="62" cy="22" r="6" fill="#52C12B"/>

  <text x="{W - 40}" y="27" fill="{DIM}" font-size="12" text-anchor="end">kanka v0.4.0  ·  github.com/thorrangonak/kanka</text>

  {s1_g}
  {s2_g}
  {s3_g}
  {s4_g}
  {s5_g}
  {s6_g}
  {s7_g}
  {s8_g}

  {progress_indicator()}
</svg>
'''


if __name__ == "__main__":
    import sys
    output = sys.argv[1] if len(sys.argv) > 1 else "../assets/hero.svg"
    svg = build()
    with open(output, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"✓ {output} yazıldı ({len(svg)} bayt)")
