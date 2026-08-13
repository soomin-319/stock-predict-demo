"use strict";

const DATA_URL = "data/sample_app_data.json";
const SIGNAL_LABELS = { BUY: "매수 관찰", HOLD: "관망", SELL: "매도 관찰" };

const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

const percent = (value) => `${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`;
const direction = (value) => (value > 0 ? "positive" : value < 0 ? "negative" : "neutral");

function renderMarket(items) {
  const container = document.querySelector("#market-cards");
  for (const item of items) {
    const card = node("article", "card");
    card.append(
      node("div", "card-name", item.name),
      node("div", "card-value", item.level.toLocaleString("ko-KR")),
      node("div", direction(item.change_rate), percent(item.change_rate)),
    );
    container.append(card);
  }
}

function renderPredictions(items) {
  const body = document.querySelector("#prediction-rows");
  for (const item of items) {
    const row = node("tr");
    const signal = node("span", `signal ${item.recommendation.toLowerCase()}`, SIGNAL_LABELS[item.recommendation]);
    for (const [value, className] of [
      [item.name, ""],
      [percent(item.predicted_return), direction(item.predicted_return)],
      [percent(item.predicted_return_model), direction(item.predicted_return_model)],
      [percent(item.news_adjustment), direction(item.news_adjustment)],
    ]) {
      row.append(node("td", className, value));
    }
    const signalCell = node("td");
    signalCell.append(signal);
    row.append(signalCell);
    body.append(row);
  }
}

function renderContext(items) {
  const list = document.querySelector("#context-list");
  for (const item of items) {
    const entry = node("li");
    entry.append(
      node("span", "context-meta", `${item.symbol} · ${item.source}`),
      node("strong", "", item.title),
    );
    list.append(entry);
  }
}

async function loadDemo() {
  const status = document.querySelector("#load-status");
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.meta.synthetic !== true) throw new Error("synthetic marker missing");

    renderMarket(data.market);
    renderPredictions(data.predictions);
    renderContext(data.news_context);

    document.querySelector("#generated-at").textContent = new Date(data.meta.generated_at).toLocaleString("ko-KR");
    document.querySelector("#policy-summary").textContent = `BUY ≥ ${percent(data.policy.buy_threshold)} · SELL ≤ ${percent(data.policy.sell_threshold)}`;
    status.textContent = "합성 데이터 로드 완료";
    status.className = "status ready";
  } catch (error) {
    status.textContent = `로드 실패: ${error.message}`;
    status.className = "status error";
  }
}

loadDemo();
