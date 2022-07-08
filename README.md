# 4.0 Setup

## 기본 package.json 수정

import ~ from 구문 사용을 위한 설정 추가

```javascript
"type": "module"
```

## 실행 스크립트

```bash
npm run dev
```

# 4.1 Query Type

## 아래 주소에서 서비스 실행 확인

```bash
http://localhost:4000/
```

# 4.2 Scalar and Root Types

## REST API와 비교

```javascript
type Query {
    allTweets: [Tweet] // GET /api/v1/tweets 와 유사
    tweet(id: ID): Tweet // GET /api/v1/tweet/:id 와 유사
}
```

# 4.3 Mutation Type

## Apolo 서버 studio내 "operation" 내

### Query 경우

```javascript
{
  allTweets {
    text
  }
  tweet(id: "1") {
    author {
      username
    }
  }
}
```

또는

```javascript
query {
  allTweets {
    text
  }
  tweet(id: "1") {
    author {
      username
    }
  }
}
```

### Muation 경우

```javascript
mutation{
  postTweet(text: "Hello, first tweet",userId: "1") {
     text
  }
}
```

# 4.4 Non Nullable Fields

## '!' 없는 필드는 Nullable 필드

null을 허용하므로 아래 둘 다 가능

```javascript
{
  tweet(id: "1212") {
    text
  }
}
```

```javascript
{
  tweet {
    text
  }
}
```

## 코드 해석

```javascript
  type Query {
    allTweets: [Tweet]! // [Tweet, null, Tweet]!
    tweet(id: ID!): Tweet
  }
```
