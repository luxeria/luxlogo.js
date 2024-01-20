# luxlogo.js

A javascript library to generate (per-) versions of the [Luxeria](https://luxeria.ch/) logo as scalable vector graphics. The library (luxlogo.js) generates SVG/XML, which can be used in HTML files. The XML output can be serialized and exported to a file to get a printable/cuttable .svg-file.

The library is written in pure javascript and does not require any external libraries other than libraries available in modern browsers. The idea originated from the challenge to implement the Luxeria logo in [OpenSCAD](https://github.com/n0ctu/OpenSCAD-Models/tree/main/Luxeria%20Logo).

## Demo

A demo site utilizing all parameters of the library can be found [here](https://luxeria.ch/luxlogo.js/luxlogo.html).

## Usage in your project

Include the luxlogo.js file in your HTML page:

```html
<script src="luxlogo.js"></script>
```

Then instantiate the LuxLogo class and manipulate the variables. Finally call the generate() method which returns SVG/XML.

```javascript
const logo = new LuxLogo();
logo.rotation = 45;
logo.color1 = "#ff0000";
logo.numArrows = 3;

document.getElementById("logo").innerHTML = logo.generate();
```

## Variables / Parameters

All `rel`-variables are relative to the `size`-variable.

| Variable                 | Description                                | Default     |
| ------------------------ | ------------------------------------------ | ----------- |
| size                     | Size of the logo in pixels                 | 512         |
| color1                   | Primary color of the logo                  | "#000000"   |
| rotation                 | Rotation angle in degrees                  | 0           |
| numArrows                | Number of arrows in the logo               | 3           |
| relBorderThickness       | Relative border thickness                  | 0           |
| relSpacing               | Relative spacing between arrows            | 8           |
| relInnerCircleDiameter   | Relative diameter of the inner circle      | 24          |
| relOuterCircleDiameter   | Relative diameter of the outer circle      | 84          |
| relOuterCircleThickness  | Relative thickness of the outer circle     | 12          |
| relArrowTipWidth         | Relative width of the arrow tip            | 24          |
| relArrowTipStart         | Relative start of the arrow tip from center| 20          |
| relArrowTipEnd           | Relative end of the arrow tip from center  | 50          |
| relArrowNotchOffset      | Relative offset of the arrow notch         | 6           |
| relArrowBaseWidth        | Relative width of the arrow base           | 12          |

## To-Do

- [x] Fix sizing issues, display size, viewport and size of the serialized SVG file (fixed by adding a viewBox)
- [ ] Fix masking/grouping to allow for proper borders
- [ ] Add support for different colors for each part (gradient support maybe?)
- [ ] **Let's find new defaults!** As in: How do you want our logo to look like on the website and in print?
