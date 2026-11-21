/**
 * Right-column contents of the Overview: the three live numbers, one farm's day, and Money.
 * Every number comes from the OverviewSource (pipeline export or src/config).
 */
import { fmt } from "../lib/format";
import { FarmStrip, TariffBlocks } from "./charts";
import { dayLong, farmerSms, pctText, type Figure, type FigureGroup } from "./model";
import type { Adoption, FarmDayView, MoneyView, OverviewSource } from "./source";

export function FigureView({ f, big = true }: { f: Figure; big?: boolean }) {
  return (
    <div className="ov-fig">
      <div className={`ov-fig-v t-${f.tone}`}>
        {f.from && <span className="ov-fig-from">{f.from}</span>}
        <span className={big ? "ov-fig-big" : "ov-fig-mid"}>{f.value}</span><span className="ov-fig-unit">{f.unit}</span>
      </div>
      <div className="ov-fig-l">{f.label}</div>
    </div>
  );
}

export function Figures({ groups }: { groups: FigureGroup[] }) {
  return (
    <div className="ov-figs">
      {groups.map((g) => (
        <section className="ov-fig-g" key={g.heading} aria-label={g.heading}>
          <h2 className="ov-fig-h">{g.heading}</h2>
          {g.items.map((f) => <FigureView key={f.label + f.unit} f={f} />)}
        </section>
      ))}
    </div>
  );
}

function PanelHead({ title, sub, onClose, closeLabel }: { title: string; sub?: string; onClose: () => void; closeLabel: string }) {
  return (
    <div className="ov-ph">
      <h2 className="ov-ph-t">{title}{sub && <span className="ov-ph-s">{sub}</span>}</h2>
      <button className="ov-close" onClick={onClose} aria-label={closeLabel}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
      </button>
    </div>
  );
}

const listDays = (ds: readonly string[]) => {
  const xs = [...ds].sort().map(dayLong);
  return xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
};

export function FarmPanel({ f, tameru, adoption, date, src, cursor, onClose }: {
  f: FarmDayView; tameru: boolean; adoption: Adoption; date: string; src: OverviewSource; cursor: number; onClose: () => void;
}) {
  const sms = tameru ? farmerSms(f) : null;
  const compare = tameru && f.equipped && adoption > 0;
  const moved = tameru && f.equipped && f.kwhOutOfPeak !== null && f.kwhOutOfPeak > 0.05 ? f.kwhOutOfPeak : null;
  return (
    <div className="ov-panel ov-farm" data-farm={f.id}>
      <PanelHead title={`Farm ${f.id}`} sub={f.equipped ? "Equipped" : "Not equipped"} onClose={onClose} closeLabel={`Close farm ${f.id}`} />
      {f.strip ? (
        <FarmStrip irrigating={f.strip.irrigating} pumpWithout={f.strip.pumpWithout} pumpWith={f.strip.pumpWith} level={f.strip.level}
          peak={src.peakWindow} compare={compare} cursor={cursor} />
      ) : (
        <div className="ov-farm-day">
          {f.pumpedM3 !== null && <FigureView big={false} f={{ value: fmt(f.pumpedM3), unit: "m³", label: `pumped on ${dayLong(date)}`, tone: "ink" }} />}
          {moved !== null && <FigureView big={false} f={{ value: fmt(moved), unit: "kWh", label: "moved out of the evening peak", tone: "with" }} />}
          <p className="ov-note">
            Hour by hour: {listDays(src.farmDetail.days)}, {src.farmDetail.adoptions.filter((a) => a > 0).map(pctText).join(", ")} equipped.
          </p>
        </div>
      )}
      {sms ? (
        <figure className="ov-sms" aria-label="Text message to the farmer">
          <figcaption className="ov-sms-h">SMS</figcaption>
          <p className="ov-sms-ar" lang="ar" dir="rtl">{sms.ar}</p>
          <p className="ov-sms-en">{sms.en}</p>
        </figure>
      ) : (
        f.strip && !compare && <p className="ov-note">{f.equipped ? "Tameru is off: the pump runs at the usual time." : "No box: the pump runs at the usual time."}</p>
      )}
    </div>
  );
}

export function MoneyPanel({ m, date, adoption }: { m: MoneyView; date: string; adoption: Adoption }) {
  const peak = m.pricePeak ? `${m.pricePeak.from.slice(0, 2)}–${m.pricePeak.to.slice(0, 2)} h` : null;
  return (
    <div className="ov-panel ov-money">
      <TariffBlocks periods={m.periods} caption="STEG price, millimes/kWh" />
      <div className="ov-money-figs">
        {m.kwhOutOfPricePeak !== null && peak && (
          <FigureView f={{ value: fmt(Math.max(0, m.kwhOutOfPricePeak)), unit: "kWh", label: `moved out of ${peak} on ${dayLong(date)}`, tone: "with" }} />
        )}
        {m.bill && (
          <FigureView big={false} f={{ value: fmt(m.bill.medianTnd), unit: "TND", label: `median saving per equipped farm over ${m.bill.days} days`, tone: "with" }} />
        )}
      </div>
      {m.bill && <p className="ov-note">Modest: before tax, water budget on{adoption === m.bill.adoption ? "" : `, ${pctText(m.bill.adoption)} equipped`}.</p>}
    </div>
  );
}
