from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "sample_app_data.json"
SCHEMA_PATH = ROOT / "schema" / "app_data.schema.json"
FORBIDDEN_KEYS = {"api_key", "token", "secret", "account_id", "endpoint"}


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def walk_keys(value: object) -> set[str]:
    if isinstance(value, dict):
        return set(value) | {key for item in value.values() for key in walk_keys(item)}
    if isinstance(value, list):
        return {key for item in value for key in walk_keys(item)}
    return set()


def expected_signal(value: float, buy_threshold: float, sell_threshold: float) -> str:
    if value >= buy_threshold:
        return "BUY"
    if value <= sell_threshold:
        return "SELL"
    return "HOLD"


def validate() -> None:
    data = load_json(DATA_PATH)
    load_json(SCHEMA_PATH)

    assert data["meta"]["synthetic"] is True, "sample must be explicitly synthetic"
    assert not (walk_keys(data) & FORBIDDEN_KEYS), "sample contains an operational key"

    policy = data["policy"]
    buy_threshold = policy["buy_threshold"]
    sell_threshold = policy["sell_threshold"]
    cap = policy["news_impact_return_adjustment_cap"]
    assert sell_threshold < buy_threshold, "threshold ordering is invalid"

    symbols = set()
    for item in data["predictions"]:
        symbol = item["symbol"]
        symbols.add(symbol)
        assert symbol.startswith("DEMO-"), f"non-synthetic symbol: {symbol}"
        assert item["name"].startswith("가상 "), f"non-synthetic name: {item['name']}"
        assert abs(item["news_adjustment"]) <= cap, f"adjustment exceeds cap: {symbol}"
        reconstructed = item["predicted_return_model"] + item["news_adjustment"]
        assert abs(reconstructed - item["predicted_return"]) < 1e-12, f"return mismatch: {symbol}"
        expected = expected_signal(item["predicted_return"], buy_threshold, sell_threshold)
        assert item["recommendation"] == expected, f"signal not anchored to predicted_return: {symbol}"

    for item in data["news_context"]:
        assert item["source"] == "synthetic", "news source must be synthetic"
        assert item["symbol"] in symbols, f"unknown news symbol: {item['symbol']}"

    print(f"validated {len(symbols)} synthetic predictions")


if __name__ == "__main__":
    validate()
