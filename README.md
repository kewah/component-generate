# component-generate [![Build Status](https://travis-ci.org/kewah/component-generate.png?branch=master)](https://travis-ci.org/kewah/component-generate)

Create a file based on a template and add it to `component.json`.

## Install

```
npm install -g component-generate
```

## Usage

```
$ component generate foo.js
```

It creates the file `foo.js` based on the JavaScript [default](https://github.com/kewah/component-generate/blob/master/template/js/default.tpl) template. It also add the reference to the `component.json` file.

```
{
  ...
  "scripts": [
    "foo.js"
  ]
}
```

## Options

### Template

`-t` or `--template`  
You can specify the template you want to use. The templates list is available [here](https://github.com/kewah/component-generate/tree/master/template).  

```
$ component generate index.js -t templateName
```

If you want to add a new template, you can add it in `template/[extension]/[templateName].tpl` and make a PR. Templates are rendered using [underscore](http://underscorejs.org/#template).  
In a future version, we will be able to use local templates. We need to find the simplest way to do it (see [issue](https://github.com/kewah/component-generate/issues/1)).

### Parameters

`-p` or `--params`  
Parameters that will be used by the template.

```
$ component generate index.js -t exports -p name:HomePage
```

Will render

```
'use strict';

module.exports = HomePage;

function HomePage() {

}
```

## License

Released under the MIT license
