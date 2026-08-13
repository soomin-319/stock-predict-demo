# Contributing

1. issue로 변경 목적과 공개 가능한 범위를 먼저 설명합니다.
2. 합성 데이터만 사용합니다. 실제 시장 데이터, credential, 내부 endpoint는 제출하지 않습니다.
3. 다음 검증을 실행합니다.

```bash
python scripts/validate_public_data.py
node --check app.js
```

모델·학습·운영 핵심 코드 공개 요청은 이 저장소의 기여 범위가 아닙니다.
