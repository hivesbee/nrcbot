# おすすめ先輩.hk416

ニコニコ動画で面白かった動画をブックマークレットからSlackとTwitterに連携するbot  
Slackでは設定したチャンネルに動画のURLを投稿  
Twitterでは設定したTwitterアカウントがフォローしているユーザ全員に  
リプライ形式で動画のURLを投稿

## 前提

## 準備

1. bookmarklet/postSlack_bookmarklet.min.js のソースコードをブックマークレットとして登録
2. server/src/*.jsをbabelでトランスパイル後、サーバへコピー
3. サーバを起動するユーザで以下の環境変数を設定
    <dl>
        <dt>SLACK_TOKEN</dt>
        <dd>bot のトークン (Slack 側)</dd>
        <dt>TWITTER_CONSUMER_KEY</dt>
        <dd>consumer_key (Twitter 側)</dd>
        <dt>TWITTER_CONSUMER_SECRET</dt>
        <dd>consumer_secret (Twitter 側)</dd>
        <dt>TWITTER_ACCESS_TOKEN</dt>
        <dd>access_token (Twitter 側)</dd>
        <dt>TWITTER_ACCESS_SECRET</dt>
        <dd>access_token_secret (Twitter 側)</dd>
    </dl>
4. サーバで「node nrcbot.js」を起動
5. Slack のチャネルで「 nrcbot woke up. 」と表示されれば起動完了

## 使い方

ニコニコ動画で面白かった動画でブックマークレットを押し、  
ユーザ名を入力、「 OK 」ボタンで投稿

## 設定

slackRoomName で Slack で投稿するチャネルを設定

```js
{
    "const": {
        "niconicoUrlPattern": "http://www.nicovideo.jp/watch/",
        "slackRoomName": "test"
    }
}
```

## 依存パッケージ

* express
* request
* log4js
* corser
* babel-polyfill
* prominence
* linq
* botkit
* twit

## 何故作った？

作ってみたかった