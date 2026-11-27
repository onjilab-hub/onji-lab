---
summary: 사진 한 장에서 지구까지 줌아웃하거나 우주에서 내 사진까지 줌인하는 영상 만들기. Kling·Seedance 세팅과 프롬프트.
tools: ChatGPT, Kling 2.5, Seedance 2.0 Fast
---
사진 한 장으로 시작해 지구까지 줌아웃하거나, 반대로 우주에서 내 사진까지 빠르게 줌인하는 영상을 만들 수 있습니다.

## Step 01 | 이미지 준비

<b>사용 툴</b> ChatGPT

<b>준비물</b>

- ✔ 지구 이미지 1장
- ✔ 줌인/아웃할 사진 1장

<b>지구 이미지 생성 프롬프트</b>

```txt
우주에서 본 지구 이미지 만들어줘.
4:5 사이즈로
```

## Step 02 | 영상 ① Zoom Out 만들기

사진 속 장소에서 시작해 지구 밖 우주까지 빠져나가는 영상

<b>사용 툴</b> Kling 2.5 Turbo

| 설정 | 값 |
|---|---|
| 모델 | Kling 2.5 |
| 해상도 | 1080p |
| Duration | 5초 |

1. Start Frame에 내 사진 업로드
2. End Frame에 지구 이미지 업로드
3. 아래 프롬프트 입력 후 생성

<b>Zoom Out 프롬프트</b> ([CITY], [COUNTRY] 부분만 수정)

```txt
The scene takes place in [CITY], [COUNTRY].

The camera rapidly pulls away from the subject.

The world shrinks beneath the camera until the entire Earth appears in space.

Single continuous zoom-out shot.

Realistic geography, satellite-view transition, cinematic scale, ultra smooth motion.
```

## Step 03 | 영상 ② Zoom In 만들기

우주에서 시작해 원하는 장소까지 빠르게 줌인하는 영상

<b>사용 툴</b> Seedance 2.0 Fast

줌인은 줌아웃보다 생성 난이도가 높습니다. 현재 기준으로는 Kling보다 Seedance가 복잡한 카메라 무빙과 공간 전환을 조금 더 안정적으로 구현하는 편입니다.

| 설정 | 값 |
|---|---|
| 모델 | Seedance 2.0 Fast |
| 해상도 | 1080p |
| Duration | 8~10초 |

1. 순서대로 지구 이미지, 내 사진 업로드
2. 아래 프롬프트 입력 후 생성

<b>Zoom In 프롬프트</b> ([CITY], [COUNTRY] 부분만 수정)

```txt
Extreme continuous zoom-in shot.

The camera starts in outer space and continuously pushes forward toward [CITY], [COUNTRY].

The Earth gradually fills the frame as the camera keeps moving forward without interruption.

The zoom passes through continents, coastlines, city scale, streets, and buildings in one uninterrupted movement.

Maintain visible ground detail throughout the entire zoom.

No teleporting.

No sudden jumps.

No cuts.

The camera never stops and never changes direction.

Continuous forward motion all the way to the exact location shown in the final frame.

Google Earth style extreme zoom-in, realistic geography, seamless one-take shot.
```

## 결과가 잘 안 나올 때

1. <b>Duration을 늘려보세요.</b> 줌인은 5초보다 8~10초에서 성공률이 높습니다.
2. <b>도시명을 넣어본 뒤, 안 나온다면 해당 문장은 빼고 생성해보세요.</b>
3. <b>랜드마크 사진이 더 잘 나옵니다.</b> 배경 정보가 많은 사진일수록 AI가 공간을 이해하기 쉽습니다.
4. <b>여러 번 생성해보세요.</b> 같은 프롬프트라도 결과 차이가 큰 편이라 여러 번 생성해 가장 자연스러운 결과를 고르는 것을 추천합니다.
