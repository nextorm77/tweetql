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

## 아폴로 서버 인수내 'type Query'는 필수, 없으면 서버 기동조차 에러

```javascript
const typeDefs = gql`
  ...
  type Query {
    ...
  }
  ...
`;
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

## Apolo 서버 studio > "operation"

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

# 4.6 Query Resolvers

## Apolo 서버 studio > "operation" 의 테스트 질의어(?)

```javascript
{
  allTweets {
    text
  }
  tweet(id:"1"){
    id
    text
  }
}
```

# 4.7 Mutation Resolvers

## Apolo 서버 studio > "operation" 의 테스트 질의어(?)

```javascript
mutation{
  postTweet(text:"4th one", userId:"1"){
    id
    text
  }
}
```

```javascript
{
  allTweets {
    id
    text
  }
}
```

## studio의 인수 자동 완성 기능

위 질의어 코드를 [Operation]에서 tab하여 자동완성되면 하단의 [Variable]에서 해당 argument(인수) 입력

[Operation]

```javascript
mutation($deleteTweetId: ID!){
  deleteTweet(id: $deleteTweetId)
}
```

[Variables] : null => " " 안에 argument(인수) 입력

```javascript
{
  "deleteTweetId": null
}
```
