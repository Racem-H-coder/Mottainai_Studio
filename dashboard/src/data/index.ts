/**
 * Typed data access. JSON is bundled at build time (no runtime fetch) and parsed once with zod.
 */
import * as S from "./schema";
import metaJ from "./meta.json";
import backtestJ from "./backtest.json";
import siteJ from "./site.json";
import forecastJ from "./forecast.json";
import daysJ from "./days.json";
import districtJ from "./district.json";
import farmsJ from "./farms.json";
import farmDaysJ from "./farm_days.json";
import alertsJ from "./alerts.json";
import farmMetricsJ from "./farm_metrics.json";
import farmTsJ from "./farm_timeseries.json";
import anomaliesJ from "./anomalies.json";
import anomalyMetricsJ from "./anomaly_metrics.json";
import waterBudgetJ from "./water_budget.json";
import billsJ from "./bills.json";

export const meta = S.Meta.parse(metaJ);
export const backtest = S.Backtest.parse(backtestJ);
export const site = S.Site.parse(siteJ);
export const forecast = S.Forecast.parse(forecastJ);
export const days = S.Days.parse(daysJ);
export const district = S.District.parse(districtJ);
export const farmsData = S.Farms.parse(farmsJ);
export const farmDays = S.FarmDays.parse(farmDaysJ);
export const alerts = S.Alerts.parse(alertsJ);
export const farmMetrics = S.FarmMetrics.parse(farmMetricsJ);
export const farmTimeseries = S.FarmTimeseries.parse(farmTsJ);
export const anomalies = S.Anomalies.parse(anomaliesJ);
export const anomalyMetrics = S.AnomalyMetrics.parse(anomalyMetricsJ);
export const waterBudget = S.WaterBudget.parse(waterBudgetJ);
export const bills = S.Bills.parse(billsJ);

export const farms = farmsData.farms;
export const crops = farmsData.crops;
export const farmIndex = new Map(farms.map((f, i) => [f.id, i]));

export function siteItem(id: string): S.SiteItemT {
  const it = site.items.find((x) => x.id === id);
  const ok = S.SiteItem.safeParse(it);
  if (!it || !ok.success) throw new Error(`site_data.json has no numeric item "${id}"`);
  return ok.data;
}
