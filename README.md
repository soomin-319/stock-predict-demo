# Stock Predict Demo

[![Validate public demo](https://github.com/soomin-319/stock-predict-demo/actions/workflows/validate.yml/badge.svg)](https://github.com/soomin-319/stock-predict-demo/actions/workflows/validate.yml)

주가 예측 연구 프로젝트의 **공개 데모 저장소**입니다. 예측 모델, 학습 파이프라인, 운영 설정은 비공개 저장소에 유지하며, 이 저장소는 합성 데이터 기반 화면과 공개 데이터 계약만 제공합니다.

> 이 프로젝트의 출력은 연구·운영 지원용입니다. 투자 조언이나 자동매매 신호가 아닙니다.

## 바로 실행

빌드와 패키지 설치가 필요 없습니다.

```bash
python -m http.server 8000
```

브라우저에서 <http://localhost:8000>을 엽니다. `file://`로 직접 열면 브라우저의 `fetch` 제한 때문에 데이터가 로드되지 않을 수 있습니다.

## 공개 범위

포함:

- 정적 웹 데모: `index.html`, `styles.css`, `app.js`
- 합성 샘플 데이터: `data/sample_app_data.json`
- 공개 데이터 계약: `schema/app_data.schema.json`
- 의존성 없는 검증 스크립트와 CI

제외:

- 모델 학습·추론 및 feature engineering 코드
- 실제 OHLCV, 뉴스, 공시, 예측 결과
- API 키, 계정 ID, endpoint 등 운영 설정
- R2 publisher, scheduler, 배포 자동화
- 내부 prompt, 평가 결과, run log

## 수익률 흐름

```text
model output
  -> predicted_return_model
  -> optional deterministic news/disclosure adjustment
  -> predicted_return
  -> recommendation policy
```

연구 신호는 최종 `predicted_return`에 의해 결정됩니다. 뉴스·공시 문맥은 모델 feature matrix에 직접 들어가지 않습니다. 비공개 시스템에서 명시적으로 활성화한 경우에만 post-model adjustment에 사용되며, 원래 모델 값은 `predicted_return_model`로 보존됩니다. 이 공개 데모는 예측을 계산하지 않고 해당 출력 계약만 시각화합니다.

## 검증

```bash
python scripts/validate_public_data.py
node --check app.js
```

검증기는 샘플이 합성 데이터인지, `predicted_return`과 연구 신호가 정책에 맞는지, 조정값이 공개 cap 안인지 확인합니다.

## 데이터 주의

`DEMO-*` symbol과 모든 수치·뉴스는 허구입니다. 실제 종목이나 시장 상태로 해석하지 마세요. 실제 시장·뉴스 데이터의 재배포 권리는 이 저장소 범위에 포함되지 않습니다.

## 기여와 보안

- 기여 절차: [CONTRIBUTING.md](CONTRIBUTING.md)
- 취약점 신고: [SECURITY.md](SECURITY.md)
- 라이선스: [MIT](LICENSE)
