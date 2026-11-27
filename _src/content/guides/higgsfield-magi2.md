---
summary: 클로드에 힉스필드 MCP를 연결해 프롬프트 없이 말로 Magi 2 캐릭터 영상을 만들고 수정하는 4단계. 캐릭터 시트·AI 호스트 스킬 포함.
tools: Claude, Higgsfield (Soul 2, Magi 2)
---
<callout>
<b>MCP 연결 → 마기2로 영상 요청 → 말로 수정</b><br>
클로드에 힉스필드를 연결하면, 영상 프롬프트를 직접 쓰지 않고 말로 시켜서 AI 캐릭터 영상을 만들 수 있어요.
</callout>

## 🔗 힉스필드 MCP 연결 페이지

- 👉 [Higgsfield MCP 바로가기](https://higgsfield.ai/s/higgsfield-black-friday-magi-2-inside-claude-onji-lab-CCnMnz)
- 처음이면 3일 무료 체험, 지금은 블랙프라이데이로 최대 75% 할인 중이에요.

## ✅ 제작 순서 한눈에 보기

| 단계 | 할 일 |
|---|---|
| STEP 1 | 클로드에 힉스필드 MCP 연결하기 |
| STEP 2 | 캐릭터 시트 만들기 (선택) |
| STEP 3 | 마기2로 영상 요청하기 |
| STEP 4 | 말로 영상 수정하기 |

## STEP 1. 클로드에 힉스필드 MCP 연결하기

<image source="@/01.jpg" />

<b>📋 힉스필드 MCP 연결 링크</b>

```txt
https://higgsfield.ai/s/higgsfield-black-friday-magi-2-inside-claude-onji-lab-CCnMnz
```

1. 위 링크에서 <b>Claude에 Higgsfield 추가하기</b> 버튼을 눌러요.
2. Claude와 Higgsfield에 차례로 로그인하고 연결을 허용해요.
3. 새 대화의 <b>+ 버튼 → 플러그인</b>에서 <b>힉스필드</b>를 켜요.

## STEP 2. 캐릭터 시트 만들기

캐릭터 시트는 <b>같은 인물의 전신 3컷(정면·측면·뒷모습)과 얼굴 클로즈업 3컷을 한 장에 모은 이미지</b>예요. 영상을 만들 때마다 이 한 장을 첨부하면 얼굴이 바뀌지 않아요.

1. 힉스필드를 켠 대화에 아래 요청문을 보내요.
2. 클로드가 <b>Soul 2(소울2)</b>로 시트를 만들어 보여줘요.
3. 얼굴이 마음에 안 들면 "다른 얼굴로 다시 뽑아줘"라고 해요.
4. 완성된 시트를 <b>저장</b>해요. 다음 영상에도 같은 시트를 계속 써요.

<callout>
다른 이미지 모델로 만들어도 괜찮아요. 제가 힉스필드 소울2로 뽑는 이유는 전형적인 AI 미인형을 피하고 최대한 자연스러운 얼굴을 뽑을 수 있는 이미지 툴이기 때문이에요. 소울2는 힉스필드 구독자라면 무료 생성 횟수가 넉넉해서 거의 무료로 쓸 수 있어요.
</callout>

<b>📋 캐릭터 시트 예시 요청문</b> — [내 캐릭터] 3줄만 바꿔서 보내주세요

```txt
힉스필드 소울2(Soul 2)로 아래 인물의 캐릭터 시트를 만들어줘.
흰 배경 스튜디오에서 위쪽에는 전신 정면·측면·뒷모습 3컷, 아래쪽에는 얼굴 정면·3/4 각도·측면 클로즈업 3컷을 배치해줘.
세로 2:3 비율의 실사 사진으로 2장 뽑아줘.
[내 캐릭터]
- 20대 후반 한국인 여성
- 검은 긴 생머리, 자연스러운 메이크업
- 흰 민소매에 연청 와이드 데님, 흰 스니커즈
```

## STEP 3. 마기2로 영상 요청하기

1. 대화창에 <b>캐릭터 시트를 첨부</b>해요.
2. <b>모델 이름(마기2), 주제, 비율·길이</b>를 적어 보내요.

<b>📋 제가 실제로 보낸 요청</b>

```txt
힉스필드 마기2로 블프 아우터 세일 영상 만들어줘. 첨부한 캐릭터 시트 얼굴로, 세로 10초
```

3. 클로드가 <b>필요한 크레딧</b>을 알려주면 확인하고 진행해요. 저는 10초에 25크레딧이 들었어요.
4. 영상이 완성되면 <b>장면 구성표</b>도 함께 정리해줘요.

### 🎤 말하는 영상은 스킬로

1. 아래 스킬 내용을 복사해서 Claude에 붙여넣고 "이 스킬 설치해줘"라고 보내요.
2. 힉스필드를 켠 대화에서 이렇게 요청해요.

```txt
/ai-host-reel 스킬로 블프 세일 주제로 8개 영상 만들어줘
```

<b>📋 스킬 내용 (ai-host-reel)</b>

```markdown
---
name: ai-host-reel
description: Create or edit a short video with an ai host from a topic, script, or reference video.
---

# Make a short video with an ai host

A topic is enough to start. Use any host, voice, language, or format the user specifies. For a reel with no size specified, use a vertical frame.

1. **Write the lines.** Start with what the viewer came to learn or see. Use short, spoken sentences. If the user provides a script, use it. If they share a reference, follow the elements they like, such as its pace or framing.
2. **Show what the host means.** Keep the host on screen for the introduction or explanation. When a line mentions a detail, show it as the host speaks. For example, cut to a screen recording when a tutorial names the button to tap.
3. **Make the video.** Use supplied clips or generate the host with the available tools. Keep the host’s look and voice consistent between shots. Before using paid generation, confirm the cost fits the user’s budget.
4. **Check and deliver.** Play the edit once. Check that every word is audible, the lips match the voice, and any captions are easy to read. Export the video in the requested format. Publish only if asked.

If video tools are unavailable, deliver the script with a second column showing what appears on screen for each line.
```

## STEP 4. 말로 영상 수정하기

고치고 싶은 곳을 말로 요청하면 돼요. 다시 만들 때마다 크레딧이 들어요.

<b>📋 수정 요청문</b> — 바꿀 내용 2줄만 바꿔서 보내주세요

```txt
방금 영상에서 얼굴, 헤어, 배경은 그대로 두고 아래만 바꿔서 다시 만들어줘.
- 립 색을 말린 장미색으로
- 귀걸이는 빼줘
```
