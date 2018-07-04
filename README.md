# upad-parse
This is the parser used for [MicroPad](https://getmicropad.com).

You can find the docs here: <https://getmicropad.com/docs/upad-parse>.

## Install
## JavaScript
`npm install --save upad-parse` or `yarn add upad-parse`
```JavaScript
const Notepad = require('upad-parse').Notepad;

let notepad = new Notepad('Test Notepad');
notepad.toXml().then(xml => console.log(xml));
```

### Typescript
```TypeScript
import { Notepad } from 'upad-parse/dist';

let notepad = new Notepad('Test Notepad');
notepad.toXml().then(xml => console.log(xml));
```

## Browser
```html
<script type="text/javascript" src="https://unpkg.com/upad-parse@^3/dist/upad-parse.browser.js"></script>
<script type="text/javascript">
	let notepad = new NPXParser.Notepad('Test Notepad');
	notepad.toXml().then(xml => console.log(xml));
</script>
```
