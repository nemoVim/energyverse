# Energyverse Project 2.0

에너지버스 프로젝트 2.0은 2023학년도 KENTECH 신입생 오티 때 진행된 프로그램의 일환으로, 앞으로 KENTECH에서 배우게 될 에너지 기술들을 미리 접해보는 것을 목적으로 제작된 보드게임 입니다. 이 웹은 에너지버스 2.0을 더 원활하게 진행하기 위한 인터페이스를 제공합니다.

## 구성

본 웹사이트는 [SvelteKit](https://kit.svelte.dev/)을 기반으로 만들어졌으며, 데이터베이스는 [MongoDB](https://mongodb.com/)를 사용하며, 호스팅에는 [Vercel](https://vercel.com/)을 사용하였습니다.

## 세팅

[테스트용 웹사이트](https://energyverse.vercel.app/)가 작동하지 않을 경우 아래와 같은 방법으로 서버를 구축할 수 있습니다.

1. [MongoDB](https://mongodb.com/)에서 새 데이터베이스를 생성합니다.
1. [Github](https://github.com/)에서 이 저장소를 Fork합니다.
1. [Vercel](https://vercel.com/)에서 새 프로젝트를 생성합니다.
1. Fork한 깃 저장소를 선택합니다.
1. 프레임워크로 SvelteKit을 선택합니다.
1. 루트 디렉토리로 ver-2.0을 선택합니다.
1. 환경변수에 아래 값들을 추가합니다.
	* MONGO_URL: 자신의 MongoDB 접속 URL
	* DEALER_PW: 딜러 페이지 비밀번호로 사용할 값
	* SESSION_VALUE: 적당한 아무 값
1. 배포 후 생성된 URL을 통해 정상적으로 작동하는지 확인합니다.
