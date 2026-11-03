#!/usr/bin/env python3
"""
sc04-prices.py — the two real stocks of VI04 SC04 (Simon's new SC04 lines, 3 Nov 2026: "Kalau membeli BBRI pada akhir
2019 di harga sekitar Rp4.400 … UNVR … Rp8.400"), as the daily closes from the last trading day of 2019 to the last
of March 2024, in the prices people saw then — the ones the VO says.

  ~/.venvs/tuntun/bin/python -I scripts/vi/sc04-prices.py

Reads Yahoo Finance's public chart data (src/episodes/vi04-investasi-yang-cocok/data/yahoo/*.JK.json — fetched
3 Nov 2026 from query1.finance.yahoo.com/v8/finance/chart/<ticker>.JK, interval 1d, no login) and writes
data/sc04-prices.json: per stock, each day's place across the chart (t, 0 → 1 over the period) and its close.
  · BBRI's closes before its rights issue (ex-date 8 Sep 2021) come back adjusted by Yahoo (×0.909075); they are
    divided back, so 30 Dec 2019 reads 4.400 and the 18 May 2020 low 2.170, as the VO says. 28 Mar 2024: 6.050.
  · UNVR's are on the 5:1 split of 2 Jan 2020, as the VO's 8.400 is: 30 Dec 2019 8.400, 28 Mar 2024 2.700.
The script asserts those figures, so a different download can't slip in unnoticed.
"""
import datetime as dt
import json
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../.."))
EP = os.path.join(ROOT, "src/episodes/vi04-investasi-yang-cocok/data")
START, END = dt.date(2019, 12, 30), dt.date(2024, 3, 28)
BBRI_EX, BBRI_FACTOR = dt.date(2021, 9, 8), 0.9090752064098011
CHECK = {"BBRI": {START: 4400, dt.date(2020, 5, 18): 2170, END: 6050}, "UNVR": {START: 8400, END: 2700}}


def closes(ticker):
    r = json.load(open(os.path.join(EP, f"yahoo/{ticker}.JK.json")))["chart"]["result"][0]
    tz = r["meta"]["gmtoffset"]
    rows = []
    for ts, c in zip(r["timestamp"], r["indicators"]["quote"][0]["close"]):
        d = dt.datetime.fromtimestamp(ts + tz, dt.timezone.utc).date()
        if c is None or not START <= d <= END:
            continue
        if ticker == "BBRI" and d < BBRI_EX:
            c /= BBRI_FACTOR
        rows.append((d, round(c)))
    for d, v in CHECK[ticker].items():
        got = dict(rows)[d]
        assert got == v, f"{ticker} {d}: {got}, expected {v}"
    return rows


def main():
    span = (END - START).days
    out = {"_": "Written by scripts/vi/sc04-prices.py — daily closes (IDR), 30 Dec 2019 – 28 Mar 2024, from Yahoo Finance's public chart data; BBRI before 8 Sep 2021 un-adjusted for its rights issue.", "from": str(START), "to": str(END)}
    for t in ("BBRI", "UNVR"):
        rows = closes(t)
        low = min(rows, key=lambda r: r[1])
        out[t] = {"t": [round((d - START).days / span, 5) for d, _ in rows], "close": [v for _, v in rows], "low": {"t": round((low[0] - START).days / span, 5), "close": low[1], "date": str(low[0])}}
        print(f"{t}: {len(rows)} days, {rows[0]} → {rows[-1]}, low {low}, high {max(rows, key=lambda r: r[1])}")
    json.dump(out, open(os.path.join(EP, "sc04-prices.json"), "w"))


if __name__ == "__main__":
    main()
