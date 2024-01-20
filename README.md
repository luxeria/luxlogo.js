# luxlogo.js

A javascript tool to generate (per-) versions of the [Luxeria](https://luxeria.ch/) logo in SVG format. The main part (luxlogo.js) generates SVG XML code, which can be used in HTML files. The XML output can be serialized to a file and create actual printable/cuttable SVG files.

The tool is written in pure javascript and does not require any external libraries other than libraries available in modern browsers. The idea originated from the challenge to implement the logo in [OpenSCAD](https://github.com/n0ctu/OpenSCAD-Models/tree/main/Luxeria%20Logo).

## Demo

A demo of the tool can be found [here](https://luxeria.ch/luxlogo/).

## Usage

Include the luxlogo.js file in your HTML page:

```html
<script src="luxlogo.js"></script>
```

Then instantiate the LuxLogo class and manipulate the variables. Finally call the generate() method which returns the SVG XML code.

```javascript
const logo = new LuxLogo();
logo.rotation = 20;
logo.color1 = "#ff0000";
logo.numArrows = 5;

document.getElementById("logo").innerHTML = logo.generate();
```

## Variables / Parameters

All relative variables are relative to the size variable.

| Variable                 | Description                                | Default     |
| ------------------------ | ------------------------------------------ | ----------- |
| size                     | Size of the logo in pixels                 | 600         |
| color1                   | Primary color of the logo                  | "#000000"   |
| rotation                 | Rotation angle in degrees                  | 0           |
| numArrows                | Number of arrows in the logo               | 3           |
| relBorderThickness       | Relative border thickness                  | 0           |
| relSpacing               | Relative spacing between arrows            | 8           |
| relInnerCircleDiameter   | Relative diameter of the inner circle      | 25          |
| relOuterCircleDiameter   | Relative diameter of the outer circle      | 85          |
| relOuterCircleThickness  | Relative thickness of the outer circle     | 12          |
| relArrowTipWidth         | Relative width of the arrow tip            | 25          |
| relArrowTipStart         | Relative start of the arrow tip from center| 20          |
| relArrowTipEnd           | Relative end of the arrow tip from center  | 50          |
| relArrowNotchOffset      | Relative offset of the arrow notch         | 3           |
| relArrowBaseWidth        | Relative width of the arrow base           | 13          |

## Todo

- [ ] Fix masking/grouping to allow for proper borders
- [ ] Add support for different colors for each part (gradients?)