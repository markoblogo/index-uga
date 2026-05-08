export function computePublishedChange(
  currentValue: number,
  previousValue: number | null,
) {
  if (previousValue === null || previousValue <= 0) {
    return { changeAbs: null, changePct: null };
  }

  const changeAbs = roundToOneDecimal(currentValue - previousValue);
  const changePct = roundToTwoDecimals((changeAbs / previousValue) * 100);

  return { changeAbs, changePct };
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}
