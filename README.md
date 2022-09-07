# 날씨 정보를 함께 제공하는 비회원 게시글 백엔드 서비스

| 👉 목차                            |                                        |
| ---------------------------------- | -------------------------------------- |
| [1. 요구사항 분석](#요구사항-분석) | 각 요구사항 분석                       |
| [2. API 명세서](#API-명세서)       | swagger url                            |
| [3. 구현 과정](#구현-과정)         | 기술스택, 모델링, 폴더 구조, 역할 분담 |
| [4. 테스트](#테스트)               | 각 서비스 unit test                    |
| [5. 서비스 배포](#서비스-배포)     | service url                            |

회원가입/로그인 없이 사용자가 게시글을 올리고 게시글에 비밀번호를 설정할 수 있는 게시판 백엔드 서비스입니다.  
이 서비스의 특별한 점은 게시글이 생성될 때 [Weather API](https://www.weatherapi.com/)를 사용하여 게시글 생성 시점의 날씨 정보를 함께 제공한다는 점 입니다.

- 사용자는 게시글을 올릴 수 있습니다.

  - 게시글 제목과 본문은 모두 이모지를 포함할 수 있습니다.
  - 사용자가 게시글을 올릴 때 비밀번호를 설정할 수 있습니다.
  - 게시글 수정/삭제시 비밀번호가 필요합니다.

- 사용자는 한 페에지 내에서 게시글을 최신 글 순서로 확인할 수 있습니다.

  - 게시글은 20개 단위로 로드되며, 사용자가 앱이나 웹에서 스크롤을 내릴 때마다 오래된 글들이 추가로 로드됩니다.

- 외부 API를 사용하여, 사용자가 게시글을 업로드한 시점의 날씨 정보가 게시글에 포함됩니다.
  - 게시글 작성 시 자동으로 데이터베이스에 추가되고, 수정은 불가능합니다.

# 요구사항 분석

## 1. 게시글 생성

- 게시글은 `id`, `제목`, `내용`, `비밀번호`, `날씨정보`, `생성시간`, `수정시간`으로 구성된다
- `제목` 과 `내용` 은 이모지를 포함할 수 있다.
- `제목`은 최대 20자로 서버에서 제한해야 한다.
- `내용`은 최대 200자로 서버에서 제한해야 한다.
- `비밀번호`는 6자 이상이어야 하고, 숫자 1개 이상을 반드시 포함한다.
- `비밀번호`는 데이터베이스에 암호화 된 형태로 저장된다.
- `날씨정보`는 사용자가 게시글을 업로드한 시점의 날씨 정보가 게시글에 포함되도록 한다.
- `날씨정보`는 게시글 작성시 자동으로 데이터베이스에 추가되고, 수정은 불가능하도록 한다.

## 2. 게시글 조회

- 사용자는 게시글을 최신 글 순서로 확인할 수 있다.
- 사용자가 웹에서 스크롤을 내릴 때마다 오래된 게시글들이 계속 로드 되는 형태로 API를 작성한다. (Pagenation)
  - 게시글이 중복으로 나타나지 않도록 한다.
  - 추가 로드는 20개 단위로 한다.

## 3. 게시글 수정/삭제

- 게시글 수정/삭제시 게시글에 설정되어 있는 비밀번호를 제출해야 한다.
- 비밀번호가 일치하는 경우에만 게시글에 대한 수정/삭제 작업을 진행할 수 있다.

# API 명세서

swagger를 사용하여 제작한 API Docs

[👉 Swagger Docs 바로가기]() /// 수정 필요

# 구현 과정

## 기술 스택

- Framework: `NestJS`
- Database: `AWS RDS - mysql`
- ORM: `TypeORM`

## 환경 세팅

### 모델링

> 데이터베이스는 AWS RDS - mysql로 생성했습니다.

<img width="790" alt="스크린샷 2022-09-07 오후 12 19 40" src="https://user-images.githubusercontent.com/63445753/188781262-29a75e5a-5177-4c4c-bb07-76eef6c89c49.png">






### 폴더 구조

```
post-with-weather-service/
├─ src/
│  ├─ database/
│  │  ├─ database.module.ts
│  ├─ guard/
│  ├─ interceptors/
│  ├─ posts/
│  ├─ weather/
│  ├─ app.module.ts
│  ├─ app.controller.ts
│  ├─ app.service.ts
│  ├─ main.ts
├─ test/
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ tsconfig.json
```

- posts, weather 폴더를 나누고, DTO 및 Entity를 작성하여 테이블 생성

  - posts 폴더에 module, controller, service 가 정의되어 있음
  - weather 폴더에 module, service가 정의되어 있음

  posts.module에서 weather module을 import 하고, app module에서 posts module을 통합

- guard : 인증/인가 작업을 위한 Guard 파일들을 저장

- interceptors: response data serialization 적용

- test: e2e 테스트

## 작업 내역 🧑‍💻

- 서버 초기 세팅
- 게시글 생성, 조회 API 구현
- 게시글 비밀번호 기능 추가
- 게시글 수정/삭제 기능 구현
- 게시글 비밀번호 Guard 수정
- 게시글 조회 기능 추가 구현
- 게시글에 사용자가 게시글을 업로드한 시점의 날씨 포함
- Swagger Documentation 코드 추가
- 프로젝트 전체 주석 확인 및 보충
- Readme.md 작성
- Weather Service Unit 테스트
- Posts Service Unit 테스트
- e2e 테스트
- 배포 // 작업중

# 테스트

## Unit Test

### 테스트 커버리지

#### Weather service

- 날씨 정보를 Weather API로부터 fetch 하는지 검증 (fetchWeather)
- 날씨 정보를 정상적으로 저장하는지 검증 (saveCurrentWeather)

#### Posts service

- 게시글 생성

  - 게시글 생성 성공 검증 (날씨 정보 포함 확인)
  - 게시글 생성시 비밀번호 암호화 검증
  - 게시글 제목, 내용, 비밀번호 제약사항을 만족하지 않을 경우 생성 실패 검증

- 게시글 조회

  - 게시글 리스트 조회 성공 검증
  - 게시글 조회 성공 검증
  - 존재하지 않는 게시글 id로 조회시 Exception 검증

- 게시글 수정

  - 게시글 수정 성공 검증
  - 존재하지 않는 게시글 id로 수정시 Exception 검증

- 게시글 삭제
  - 게시글 삭제 성공 검증
  - 존재하지 않는 게시글 id로 삭제시 Exception 검증

### 테스트 결과

#### Weather service

<img width="534" alt="스크린샷 2022-09-07 오후 7 14 35" src="https://user-images.githubusercontent.com/63445753/188853738-7496f78c-1662-4bf3-a7fa-ba001976abec.png">

#### Posts Service

<img width="615" alt="스크린샷 2022-09-07 오후 7 15 05" src="https://user-images.githubusercontent.com/63445753/188853775-ee31388a-cbea-41ad-a682-4de0f8c60b3a.png">  


## e2e Test

### 테스트 커버리지

- 게시글 저장

  - title, content에 이모지 저장 검증
  - title 20자 이상일 경우 생성 실패 검증
  - content 200자 이상일 경우 생성 실패 검증
  - 비밀번호 정책 (6자이상 숫자 1개이상 반드시 포함) 위반시 생성 실패 검증

- 게시글 조회

  - 게시글 리스트 조회시 default pagenation option 적용 검증

- 게시글 수정

  - 잘못된 비밀번호로 게시글 수정 요청시 exception 검증

- 게시글 삭제
  - 잘못된 비밀번호로 게시글 삭제 요청시 exception 검증

### 테스트 결과

<img width="795" alt="스크린샷 2022-09-07 오후 7 13 36" src="https://user-images.githubusercontent.com/63445753/188853406-7738688e-b796-4a26-ad48-cecf627fe0a9.png">


# 서비스 배포

> 배포 정보 작성

👉 //url
