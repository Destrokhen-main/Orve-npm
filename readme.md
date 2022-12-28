<p align="center"><img src="https://i.ibb.co/5cYvr0k/logo.png" alt="orve logo"></p>
<h1 align="center">orve (npm package) / Simple-reactive</h1>

Library for creating reactive SPA applications. Trying to take the best from react and vue

```
npm i orve
```

<a href="https://github.com/Destrokhen-main/simple-reactive-cli" target="_blank">Webpack project</a>

<a href="https://github.com/Destrokhen-main/Simple-Reactive-doc" target="_blank">Documentation</a> OR <a href="https://destrokhen-main.github.io" target="_blank">Site (written with orve)</a>

If you contribute something to the project, I will be very grateful to you.))

## Mini example

`this library will help you out of this`

```
function() {
    return {
        tag: "div",
        props: {
            id: "key",
            class: "comp"
        },
        child: [
            {
                tag: "p",
                child: "This is ORVE"
            },
            "<p>object-reactive library</p>"
        ]
    }
}
```

or this (jsx)
```
function() {
    return (
        <div id="key" class="comp">
            <p>This is ORVE</p>
            <p>object-reactive library</p>
        </div>
    )
}
```

`do this`

```
<div id="key" class="comp">
    <p>This is ORVE</p>
    <p>object-reactive library</p>
</div>
```

### that's not all, to learn more, read the documentation
