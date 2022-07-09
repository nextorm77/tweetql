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

# 4.10 Documentation

## 각각의 요소에 주석 달기

요소 상단에 아래와 같이 주석을 쓰면 apolo studio "Schema" 메뉴, graphql 클라이언트(altair)를 통해 해당 주석을 확인 가능

- graphql 클라이언트(altair): [https://altair.sirmuel.design/] 하단 Web 방식으로 쉽게 테스트 가능

- 1. "POST" 입력란에 apolo 서버 주소 입력하고 "Send Request", 2. "Docs" 클릭

```javascript
  ...

  """
  Tweet object represents a resource for a tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  ...
```

# 4.11 Migrating from REST to Graphsql

## 요지

REST API 로 데이터를 몽땅 메모리로 불러서 해당 resolver에 연결

### REST API 변환 대상 구조(필드명) 복사 => 노가다

- 대상: [https://yts.mx/api/v2/list_movies.json], [https://yts.mx/api/v2/movie_details.json?movie_id=10]

- 브라우저 화면에 표시된 배열의 요소 하나(객체)를 복사하고 브라우저 콘솔에서 다음과 같이 필드명만 추출

```javascript
const movie = {복사된 객체 정보};
Object.keys(movie);
```

### 필드명만 남기기 위해 불필요 문자 제거 => 노가다

### 테스트를 단순화하기 위해 "torrents" 필드 등 제거

- 테스트 용도이므로 솔직히 필드명 중 몇 개만 사용해도 됨, 실자료의 DB 필드와 불일치(갯수, 필드명)해도 정상 동작

- 실 DB에 없는 필드명 사용시 nullable 필드로 변경

### 실행하면 "fetch is not defined" 에러 발생 => 아래와 같이 조치(fetch 함수 패키지 필요)

```bash
npm i node-fetch
```

### REST API가 달라서 필드 구조가 완벽하게 일치하지 않아도 "!"를 제거하여 nullable 필드로 변경하고 임시 처리

### graphql 클라이언트(altair) 와 apolo 서버를 사용하여 상호 테스트
