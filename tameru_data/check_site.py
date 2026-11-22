"""Consistency checks for the website pack (no model, no data: text and files only).

    python check_site.py      # exits 1 if a check fails; prints v1-leftover hits for review

1. site_data.json parses and ids are unique.
2. Every [key] in copy.md exists and the number right before it equals the site_data value.
3. Every key in pitch_numbers.md exists and the numbers of its row equal the site_data values.
4. Every figure referenced by PROJECT_REPORT.md, MODEL_REPORT.md and figures/INDEX.md exists in
   deliverables/website/figures/ (PNG and SVG).
5. v1-leftover strings in deliverables/, results/MODEL_REPORT.*, index.html, README files (archive/ and docs/ are
   never scanned): listed for review (a deliberate, explained mention is allowed).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "deliverables" / "website"
NUM = r"-?\d[\d,]*(?:\.\d+)?"
LEFTOVERS = ["17–20", "17-20", "17:00–20:00", "1,285", "1 285", "975 kW", "1,363", "1,051", "75.2", "70 % adoption",
             "18 %", "21 July", "2026-07-21", "12,955", "117 kWh", "14.75", "763", "1,382", "96.4", "619"]


def num(x):
    return float(str(x).replace(",", "").replace("−", "-"))


def same(text_val, v):
    if isinstance(v, (int, float)):
        try:
            return abs(abs(num(text_val)) - abs(float(v))) < 1e-6
        except ValueError:
            return False
    return str(v) == text_val.strip()


def main():
    errors = []
    items = json.loads((WEB / "site_data.json").read_text(encoding="utf-8"))["items"]
    ids = [i["id"] for i in items]
    if len(ids) != len(set(ids)):
        errors.append("duplicate ids in site_data.json")
    v = {i["id"]: i.get("value", i.get("values")) for i in items}

    copy = (WEB / "copy.md").read_text(encoding="utf-8")
    n_copy = 0
    for m in re.finditer(r"\[([A-Za-z0-9_]+)]", copy):
        key = m.group(1)
        n_copy += 1
        if key not in v:
            errors.append(f"copy.md: unknown key [{key}]")
            continue
        before = copy[max(0, m.start() - 60):m.start()]
        nums = re.findall(r"\d\d:\d\d-\d\d:\d\d|\d+ of \d+|" + NUM, before)
        if not nums or not same(nums[-1], v[key]):
            errors.append(f"copy.md: [{key}] = {v[key]!r} but text says {nums[-1] if nums else None!r}")

    pitch = (ROOT / "deliverables" / "pitch_numbers.md").read_text(encoding="utf-8")
    n_pitch = 0
    for line in pitch.splitlines():
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 7 or not cells[0].isdigit():
            continue
        keys = re.findall(r"`([A-Za-z0-9_]+)`", cells[5])
        if re.fullmatch(r"\d+ of \d+|\d\d:\d\d-\d\d:\d\d", cells[1]):
            vals = [cells[1]]
        else:
            vals = re.findall(NUM, cells[1].replace(" ", ""))
        for k, t in zip(keys, vals):
            n_pitch += 1
            if k not in v:
                errors.append(f"pitch_numbers.md: unknown key {k}")
            elif not same(t, v[k]):
                errors.append(f"pitch_numbers.md: {k} = {v[k]!r} but table says {t!r}")

    figs = set()
    for f in (WEB / "PROJECT_REPORT.md", WEB / "figures" / "INDEX.md"):
        figs |= set(re.findall(r"figure `([a-z_]+)`|`([a-z_]+)\.png`", f.read_text(encoding="utf-8")) and
                    [a or b for a, b in re.findall(r"figures? `([a-z_]+)`|`([a-z_]+)\.png`", f.read_text(encoding="utf-8"))])
    figs |= set(re.findall(r"deliverables/website/figures/([a-z_]+)\.png", (ROOT / "results" / "MODEL_REPORT.md").read_text(encoding="utf-8")))
    for f in sorted(figs):
        for ext in ("png", "svg"):
            if not (WEB / "figures" / f"{f}.{ext}").exists():
                errors.append(f"missing figure {f}.{ext}")

    scan = [p for p in (ROOT / "deliverables").rglob("*") if p.suffix in (".md", ".json", ".html", ".txt")
            and "brand" not in p.parts]
    scan += [ROOT / "results" / "MODEL_REPORT.md", ROOT / "results" / "MODEL_REPORT.html", ROOT / "index.html",
             ROOT / "archive" / "README.md"]
    hits = []
    for p in scan:
        t = p.read_text(encoding="utf-8")
        for s in LEFTOVERS:
            for m in re.finditer(re.escape(s), t):
                ctx = t[max(0, m.start() - 50):m.end() + 30].replace("\n", " ")
                hits.append(f"{p.relative_to(ROOT)}: {s!r}: ...{ctx}...")

    print(f"site_data: {len(ids)} ids; copy.md: {n_copy} keys; pitch_numbers.md: {n_pitch} values; "
          f"figures referenced: {len(figs)}")
    print(f"v1-leftover hits to review: {len(hits)}")
    for h in hits:
        print("  " + h)
    for e in errors:
        print("FAIL " + e)
    if errors:
        sys.exit(1)
    print("all checks passed")


if __name__ == "__main__":
    main()
