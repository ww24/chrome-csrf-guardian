Chrome CSRF Guardian
====================

CSRF 脆弱性を利用した攻撃から、あなたの Chrome を守ります。

## Outline
CSRF とは利用者の意図に反して外部へリクエストを送信させ、副作用を発生させる攻撃のことです。

副作用には

* 意図せず商品を購入させられる
* 意図せずメッセージを送信させられる
* 意図せずデータを削除させられる

等が含まれます。

CSRF 脆弱性はサーバ側の問題なので、利用者にできる対処方法はほとんどありません。
そこで、 CSRF 攻撃を未然クライアントサイドで防ぐための拡張機能を考案しました。

ただし、全ての CSRF 攻撃を防ぐことはできません。
この拡張機能で防ぐことができるのは、 `Form` 要素を使った攻撃と、 `XMLHttpRequest` (XHR) を使った攻撃の 2 種類です。

例えば、次の例では無力です。

* `img` タグの `href`
* `script` タグの `src`
* `link` タグの `href`
* CSS の `@import url()`

対応していないこれらの手法は全て GET メソッドによる通信になります。

ブラウザ上から POST メソッドで通信するためには、必ず Form または XHR を使う必要があるため、この拡張機能でブロックできます。

## 実装予定
* ホワイトリスト、ブラックリスト
* チュートリアル

意図せず外部のサイトと通信しようとするとダイアログが表示されます。

## Update
### v0.1.0 - 2013/02/03
* first release