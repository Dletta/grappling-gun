# debug-proxy

[debug](https://github.com/visionmedia/debug), loaded asynchronously using `require.ensure` when 
it's needed on the client. Only load debug when it's being used.

```shell
$ npm i debug-proxy --save
```

Use it like you would debug. 
```js
var debug = require('debug-proxy')('some-namespace');

debug('Starting');
```

To enable debugging, open the console and run
```js
window.localStorage.debug='*'; // Or x:*, etc
window.__enableDebugging();
```

This will asynchronously load debug using `require.ensure`. Debugging events will appear in your console immediately.

To disable debugging, run
```js
window.__disableDebugging();
```

## Licence
MIT
