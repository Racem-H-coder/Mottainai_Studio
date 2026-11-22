# Tameru box: IoT contract

The Tameru box is a small controller (ESP32 class) on each farm. It switches the pump through a relay, reads the
tank level, and talks to the Tameru server over MQTT. This page is the contract the hardware is built to. The
ESP32 firmware is not in this repository.

## Required topics

| Topic | Direction | Payload (JSON) |
|---|---|---|
| `tameru/farm/{id}/telemetry` | box → server | `{"level_pct": 62.5, "pump_on": true, "power_w": 4100}` |
| `tameru/farm/{id}/cmd` | server → box | `{"pump": "on", "until": "2026-07-22T04:30:00+01:00", "reason": "prefill"}` |

- `{id}` is the farm id used by the server (for example `41`).
- `level_pct`: tank level, 0–100 % of the usable volume. `pump_on`: relay state. `power_w`: measured pump power
  in watts (0 when off).
- `pump`: `"on"` or `"off"`. `until`: ISO 8601 time when the command expires. `reason`: one of the reason codes
  in [`deliverables/dashboard_contract.md`](../deliverables/dashboard_contract.md) (`prefill`, `peak_shaving`,
  `reserve_topup`, `grid_safety_rule`, `fault_stop`, `budget_cap`, ...), shown to the farmer.
- The payload values above are examples.

## Rules that stay on the box

These run locally, whatever the server says:

1. **Float switch**: the pump stops when the tank is full.
2. **Reserve rule**: the pump runs if the tank would fall below its reserve (15 % of volume).
3. **Failsafe**: if no command arrives for **60 s**, the box ignores the old plan and keeps the tank between
   **30 % and 90 %** on its own (pump on below 30 %, off at 90 %). Irrigation never depends on the link.

The farmer can always take manual control (`farmer_override` in the simulation).

## Optional extensions

- `tameru/farm/{id}/schedule` (retained): the day's 48 half-hour slots, so the box can follow the plan offline.
- `tameru/farm/{id}/ack`: the box confirms each command.
- `tameru/farm/{id}/status`: `online` / `offline` as an MQTT last-will message.
- `tameru/farm/{id}/event`: float switch trips, overrides, sensor errors.

## How the simulation uses it

The backtest (`tameru_data/optimizer.py`, `simulate()`) applies the same rules every 15 minutes: float switch,
reserve rule, the 60 s failsafe during communication loss, farmer overrides, and anomaly checks on telemetry
only (measured level and power). All results that come from it are **simulated**.
