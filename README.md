# luxlogo.js

A javascript library to generate (per-) versions of the [Luxeria](https://luxeria.ch/) logo as a scalable vector graphics. The library (luxlogo.js) generates SVG/XML code, which can be used in HTML files. The XML output can be serialized and exported to a file to get a printable/cuttable .svg-file.

The library is written in pure javascript and does not require any external libraries other than libraries available in modern browsers. The idea originated from the challenge to implement the Luxeria logo in [OpenSCAD](https://github.com/n0ctu/OpenSCAD-Models/tree/main/Luxeria%20Logo).

## Demo

A demo site utilizing all parameters of the library can be found [here](https://luxeria.ch/luxlogo.js/luxlogo.html).

## Usage in your project

Include the luxlogo.js file in your HTML page:

```html
<script src="https://luxeria.ch/luxlogo.js/js/luxlogo.js"></script>
```

Then instantiate the LuxLogo class with the id of the container and manipulate the variables. Finally call the generate() method which fills the SVG/XML code into the container.

```html
<script>
const logo = new LuxLogo("logo-container");
logo.rotation = 20;
logo.color1 = "#ff0000";
logo.numArrows = 3;
logo.generate();
</script>

<div id="logo-container"><!-- SVG goes here --></div>
```

## Variables / Parameters

All `rel`-variables are relative to the `size`-variable.

| Variable                 | Description                                  | Default     |
| ------------------------ | -------------------------------------------- | ----------- |
| size                     | Size of the logo in pixels                   | 512         |
| color1                   | Primary color of the logo                    | "#000000"   |
| color2                   | Primary color of the logo                    | "#ffffff"   |
| rotation                 | Rotation angle in degrees                    | 0           |
| numArrows                | Number of arrows in the logo                 | 3           |
| relBorderThickness       | ‰ Relative border thickness                  | 0           |
| relSpacing               | ‰ Relative spacing between arrows            | 4           |
| relInnerCircleDiameter   | % Relative diameter of the inner circle      | 24          |
| relArcDiameter           | % Relative diameter of the arcs              | 84          |
| relArcThickness          | % Relative thickness of the arcs             | 12          |
| relArrowTipWidth         | % Relative width of the arrow tip            | 24          |
| relArrowTipStart         | % Relative start of the arrow tip from center| 20          |
| relArrowTipEnd           | % Relative end of the arrow tip from center  | 50          |
| relArrowNotchOffset      | ‰ Relative offset of the arrow notch         | 2.4         |
| relArrowBaseWidth        | % Relative width of the arrow base           | 12          |

## To-Do

- [x] Fix sizing issues, display size, viewport and size of the serialized SVG file (fixed by adding a viewBox)
- [x] Fix masking/grouping to allow for proper borders (fixed by turning all shapes into paths)
- [x] Add ID's to all elements
- [x] Change viewBox starting point to size/2 coordinates: all center-calculations can then be removed
- [ ] Add support for less than 2 arrows
- [ ] Add optional href links to all elements
- [ ] Add support for different colors for each part (gradient support maybe?)
- [ ] Add a minified "luxlogo-min.js" version of the library
- [ ] **Let's find new defaults!** As in: How do you want our logo to look like on the website and in print?
