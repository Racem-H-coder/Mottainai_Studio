"""Tariff period boundaries, season switch and bill arithmetic. Run: python test_tariff.py"""
import numpy as np

from tariff import BT_3P, CPP, FLAT, bt_period, bt_prices, cpp_quarters, farm_bills, ttc

# summer (Apr-Sep): day 08-19, peak 19-23, night 23-08
for minute, want in ((7 * 60 + 59, "night"), (8 * 60, "day"), (18 * 60 + 59, "day"), (19 * 60, "peak"),
                     (22 * 60 + 59, "peak"), (23 * 60, "night"), (0, "night")):
    assert bt_period("2026-07-15", minute) == want, (minute, want)
# winter (Oct-Mar): day 06:30-17:30, peak 17:30-21:30, night 21:30-06:30
for minute, want in ((6 * 60 + 29, "night"), (6 * 60 + 30, "day"), (17 * 60 + 29, "day"), (17 * 60 + 30, "peak"),
                     (21 * 60 + 29, "peak"), (21 * 60 + 30, "night")):
    assert bt_period("2026-01-15", minute) == want, (minute, want)
# season switch on 1 Apr and 1 Oct (18:00 is peak in winter, day in summer)
assert bt_period("2026-03-31", 18 * 60) == "peak" and bt_period("2026-04-01", 18 * 60) == "day"
assert bt_period("2026-09-30", 18 * 60) == "day" and bt_period("2026-10-01", 18 * 60) == "peak"
p = bt_prices("2026-07-15")
assert p[75] == BT_3P["day"] and p[76] == BT_3P["peak"] and p[91] == BT_3P["peak"] and p[92] == BT_3P["night"]
# bills: 1 kW all day = 24 kWh
b = farm_bills("2026-07-15", np.ones((1, 96)))
want_bt = (11 * 140 + 4 * 391 + 9 * 116) / 1000
assert abs(b["steg_bt_3p_ht"][0] - want_bt) < 1e-9 and abs(b["legacy_flat_ht"][0] - 24 * FLAT / 1000) < 1e-9
assert abs(ttc(1000, 10) - 1170) < 1e-9
# CPP: adder only in the window on critical days, forced quarters exempt, rebate for shaved kW
c = farm_bills("2026-07-15", np.ones((1, 96)), forced=np.zeros((1, 96), bool), critical=True,
               baseline_kw=2 * np.ones((1, 96)))
win_h = cpp_quarters().sum() / 4                     # total length of the CPP window(s), hours (any width)
assert win_h > 0 and abs(c["proposed_cpp_ht"][0] - (want_bt + (win_h * CPP["adder_mill_per_kwh"]
                                                     - CPP["rebate_mill_per_kw"]) / 1000)) < 1e-9
from optimizer import window_slots
assert np.repeat(window_slots([("22:00", "01:00")]), 2).sum() == 12      # wrap past midnight = 3 h
f = farm_bills("2026-07-15", np.ones((1, 96)), forced=np.ones((1, 96), bool), critical=True)
assert abs(f["proposed_cpp_ht"][0] - want_bt) < 1e-9
print("ok  tariff boundaries, seasons, bills")
