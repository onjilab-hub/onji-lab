---
summary: 스마트폰으로 찍은 제품 사진을 GPT가 분석해 6가지 스튜디오 제품컷 프롬프트를 만들어주는 템플릿.
tools: ChatGPT
---
## STEP 1. 제품 사진 준비

제품을 여러 각도에서 촬영해주세요. 가능하면 아래 각도를 포함하는 것을 추천합니다. 스마트폰 촬영으로도 충분합니다.

- 정면
- 45도
- 측면
- 후면
- 디테일

## STEP 2. GPT에 사진 + 프롬프트 입력

제품 사진을 업로드한 뒤 아래 프롬프트를 입력해주세요.

```txt
첨부한 제품 이미지를 분석하고 아래 조건에 맞춰 스튜디오 제품 사진 프롬프트를 작성해줘.

[제품 분석]

첨부 이미지 속 제품의 주요 소재, 질감 특징, 컬러 특징, 형태 및 구조, 핵심 판매 포인트(USP), 광고 이미지에서 강조해야 할 요소를 분석해줘.

[촬영 설정]

- 제품 유지 : 제품의 형태, 컬러, 비율, 로고, 소재감, 디테일을 그대로 유지해줘. 제품 왜곡, 정보 누락, 임의 변경은 금지해줘.
- 제품 설명 금지 : 제품 분석은 촬영 기획용으로만 활용해줘. 최종 프롬프트에는 제품 종류, 형태, 구조, 소재, 컬러, 기능 등 제품 자체를 설명하는 문장을 작성하지 마.
- 활용 범위 : 제품 분석 결과는 카메라 앵글, 구도, 조명, 그림자, 반사 표현, 클로즈업 포인트, USP 강조 포인트를 결정하는 용도로만 활용해줘.
- 프롬프트 형태 : 최종 프롬프트는 제품 생성이 아닌 업로드된 원본 제품을 촬영하는 사진 촬영 디렉션 형태로 작성해줘.
- 배경 컬러 : [Soft White]
- 공통 촬영 조건 : Premium commercial product photography, Luxury studio product shot, Clean seamless background, Soft studio lighting, Controlled highlights, Soft realistic shadow, Minimal composition, High-end advertising campaign style, Ultra realistic, Hyper detailed, Sharp focus, 8K quality를 모든 프롬프트에 공통 적용해줘.
- 컷 구성 : 제품 분석 결과를 기반으로 각 컷의 앵글, 구도, 조명, USP 강조 포인트를 최적화해줘.
  - CUT 01. 45도 제품컷 (3/4 View)
  - CUT 02. 정면 제품컷 (Front View)
  - CUT 03. 탑뷰 제품컷 (Top View)
  - CUT 04. USP 클로즈업컷 (Feature Close-up)
  - CUT 05. 디테일 클로즈업컷 (Detail Shot)
  - CUT 06. 배너 광고컷 (Banner Shot)

[출력 형식]

1. 제품 분석
2. 추천 배경 컬러 3개
3. 컷 프롬프트

- CUT 01 프롬프트
- CUT 02 프롬프트
- CUT 03 프롬프트
- CUT 04 프롬프트
- CUT 05 프롬프트
- CUT 06 프롬프트

모든 프롬프트는 영문으로 작성하고 코드블록으로 구분해줘.

모든 프롬프트 맨 앞에는 아래 문장을 반드시 포함해줘.

Use the attached product image as the subject.

Preserve the original product exactly as provided.

Keep the original shape, color, proportions, logo, material, and details unchanged.

Do not redesign, reinterpret, or generate a new version of the product.
```

## STEP 3. 생성된 프롬프트 활용

GPT가 제품 특징과 USP를 분석한 뒤 컷별 촬영 프롬프트를 생성해줍니다. 이 단계에서 내 제품의 특징을 좀 더 알려줘도 좋아요.

새 채팅창을 열고 <b>원본 제품 이미지</b>와 <b>생성된 컷 프롬프트</b>를 함께 입력해주세요.

<callout>
제품 특징 분석은 촬영 기획용으로만 활용됩니다. 최종 생성 프롬프트에는 제품 종류, 소재, 컬러, 구조 등의 설명을 넣지 않도록 설계되어 있어 원본 제품이 변형될 가능성을 줄였습니다.
</callout>
