# Testing a unity-style component system

A simple Unity-style component system for making games. Will try to use it to implement a FallOut Shelter mobile kinda game. Should be able to describe the entire game in JSON (see `GameData.js`).

* `npm install`
* `npm start`

Browse at http://localhost:9966

## To create a component

* add to components/
* add to components/index
* give propTypes if takes params (used for serializing)

## Component strucutre:

* see components/Component.js

Get any references to other entities in `Start` with `theGame.getEntityByName(targetName)`.

## To make an Entity

```js
  Entities.make({
    args: ["entityName", posX, posY],
    comps: [
      ["State", "BORN"],
      ["Health", 100, 20],
      ["PlayerActor"],
      ["Wander", 2],
      ["MoveTowards", "e2"],
      ["HealthRenderer"],
      ["ColorUp"],
    ]
  });
```


### To figure out

* How to spawn prefabs without requiring an instance