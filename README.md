# W20 Material Theme

## Installation

```
bower install w20-material-theme
```

## Configuration

In `#/modules/main/theme`, `primaryPalette` and `accentPalette` properties MUST be defined. Each defined `*Palette` property MUST have at least their `name` properties defined. The `hues` property follows [Material Angular color intentions syntax](https://material.angularjs.org/latest/Theming/03_configuring_a_theme#specifying-custom-hues-for-color-intentions)

```javascript
"bower_components/w20-material-theme/w20-material-theme.w20.json": {
  "modules": {
    "sidenav": {
      "logoUrl": "/home",
      "logoImg": "/images/logo.png",
      "backgroundImg": "/images/header-background.jpg"
    },
    "main": {
      "theme": {
        "primaryPalette": {
          "name": "indigo",
          "hues": {
            "default": "",
            "hue-1": "",
            "hue-3": ""
          }
        },
        "accentPalette": {
          "name": "amber"
        },
        "warnPalette": {
          "name": "red",
          "hues": {
            "default": "",
            "hue-2": ""
          }
        },
        "backgroundPalette": {
          "name": "blue-grey"
        },
        "dark": true // Defaults to false
      }
    }
  }
}
```

## Usage

A simple usage would be:

```html
<!DOCTYPE html>
<html data-w20-app>
<head>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta charset="utf-8">
  <title>W20 Material Theme Test</title>
  <script type="text/javascript" data-main="bower_components/w20/modules/w20" src="bower_components/requirejs/require.js"></script>
</head>
<body layout ng-cloak md-swipe-left="$emit('w20.material.sidenav.open', false)" md-swipe-right="$emit('w20.material.sidenav.open', true)">
  <div id="w20-loading-cloak">
    <div class="w20-loading-indicator"></div>
  </div>
  <nav w20-material-sidenav component-name="w20.material.sidenav"></nav>
  <main class="app-main" layout="column" flex>
    <md-toolbar class="app-topbar md-whiteframe-z2" ng-style="search.style" w20-material-topbar></md-toolbar>
    <md-content class="app-content" ng-view layout="column" layout-align="start center" flex></md-content>
  </main>
  <div data-w20-error-report></div>
</body>
</html>
```