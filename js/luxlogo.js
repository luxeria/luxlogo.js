class SVGHelper {
    constructor(id) {
        this.xml = this._createSVG(id);
    }

    _createSVG(id) {
        // Create the SVG element
        const xml = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        xml.setAttribute("id", id);
        xml.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        xml.setAttribute("version", "1.1");
        xml.setAttribute("preserveAspectRatio", "xMidYMid meet");
        return xml;
    }

    _createDefs() {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        this.xml.appendChild(defs);
    }

    // SVG basic operations for Defs and Uses -> don't use them if possible as they are not compatible with Inkscape
    addDefs(...defsShapes) {
        console.log("SVGHelper.addDefs() called");
        const defs = this.xml.querySelector("defs");
        defsShapes.forEach(shape => {
            defs.appendChild(shape);
        });
    }

    addUses(...href) {
        let i = 0;
        href.forEach(href => {
            const id = href + "-" + i;
            i++;
            const use = this.createUse(id, href);
            this.xml.appendChild(use);
        });
    }

    // SVG basic shapes and containers
    // All create functions return an SVG element, but do not add it to this.xml straight away
    createCircle(id, cx, cy, d) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const r = d / 2;
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("id", id);
        return circle;
    }

    createRectangle(id, x, y, w, h) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        rect.setAttribute("id", id);
        return rect;
    }

    createPolygon(id, points) {
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", points.map(p => p.join(",")).join(" "));
        polygon.setAttribute("id", id);
        return polygon;
    }

    createPath(id, d) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("id", id);
        return path;
    }

    createAnchor(id, href, ...objects) {
        const anchor = document.createElementNS("http://www.w3.org/2000/svg", "a");
        anchor.setAttribute("id", id);
        anchor.setAttribute("xlink:href", href);
        objects.forEach(object => {
            anchor.appendChild(object);
        });
        return anchor;
    }

    createGroup(id, ...objects) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", id);
        objects.forEach(object => {
            group.appendChild(object);
        });
        return group;
    }

    createClipPathRefs(id, ...hrefs) {
        const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        clipPath.setAttribute("id", id);
        let i = 0;
        hrefs.forEach(href => {
            const use = this.createUse(href);
            use.setAttribute("id", id + "-" + i);
            clipPath.appendChild(use);
        });
        return clipPath;
    }

    createMask(id, ...objects) {
        const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
        mask.setAttribute("id", id);
        let i = 0;
        objects.forEach(object => {
            mask.appendChild(object);
            i++;
        });
        return mask;
    }

    createMaskRefs(id, ...hrefs) {
        const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
        mask.setAttribute("id", id);
        let i = 0;
        hrefs.forEach(href => {
            const use = this.createUse(href);
            use.setAttribute("id", id + "-" + i);
            i++;
            mask.appendChild(use);
        });
        return mask;
    }

    createUse(id, href) {
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("id", id);
        use.setAttribute("href", href);
        return use;
    }

}

// Helper class for dispacements (vectors), locations (coordinates) and other geometric calculations
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // String representation
    str(separator = " ") {  return `${this.x}${separator}${this.y}`; }

    // Vector operations
    add(other) {             return new Vector(this.x + other.x, this.y + other.y); }
    subtract(other) {        return new Vector(this.x - other.x, this.y - other.y); }
    scalarMultiply(scalar) { return new Vector(this.x * scalar, this.y * scalar); }
    scalarAdd(scalar) {      return new Vector(this.x + scalar, this.y + scalar); }
    negate() {               return new Vector(-this.x, -this.y); }
    negateX() {              return new Vector(-this.x, this.y);  }
    negateY() {              return new Vector(this.x, -this.y);  }
    perpendicular() {        return new Vector(-this.y, this.x); }
    determinate(other) {     return this.x * other.y - this.y * other.x; }
    magnitude() {            return Math.sqrt(this.x * this.x + this.y * this.y); }

    normalized() {
        let mag = this.magnitude();
        return new Vector(this.x / mag, this.y / mag);
    }
    
    rotate(angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let x = cos * this.x - sin * this.y;
        let y = sin * this.x + cos * this.y;
        return new Vector(-x, y);
    }

    circleIntersections(D,radius){
        // Source: https://mathworld.wolfram.com/Circle-LineIntersection.html
        // D, use determinate() function
        let dr = this.magnitude();

        // Calculate Incidece
        let incidence = radius*radius * dr*dr - D*D;

        let x1 = (D * this.y - Math.sign(this.y) * this.x * Math.sqrt(incidence)) / (dr*dr);
        let y1 = (-D * this.x - Math.abs(this.y) * Math.sqrt(incidence)) / (dr*dr);
        let x2 = (D * this.y + Math.sign(this.y) * this.x*Math.sqrt(incidence)) / (dr*dr);
        let y2 = (-D * this.x + Math.abs(this.y) * Math.sqrt(incidence)) / (dr*dr);

        if(incidence < 0){
            // No intersection
            return [new Vector(0,0), new Vector(0,0)];
        } else if(incidence == 0){
            // One intersection, tangent line
            return [new Vector(x1, y1), new Vector(x1, y1)];
        } else {
            // Two intersections
            return [new Vector(x1, y1), new Vector(x2, y2)];
        }
    }

    // Arc Calculations
    static calcArcHeight(radius, width) {
        return radius - Math.sqrt(radius ** 2 - (width / 2) ** 2);
    }

    static calcArcTheta(radius, width) {
        return 2 * Math.asin(width / (2 * radius));
    }

}


class LuxLogo {
    constructor(id) {
        // Constructor with intial values
        this.idPrefix = id;
        this.container = document.getElementById(id);
        this.svg = new SVGHelper(id + "_svg");
        this.outString = "";
        this.size = 512;
        this.color1 = "#000000";
        this.color2 = "#ffffff";
        this.rotation = 0;
        this.numArrows = 3;
        this.relBorderThickness = 0;
        this.relSpacing = 8;
        this.relInnerCircleDiameter = 24;
        this.relArcDiameter = 85;
        this.relArcThickness = 12;
        this.relArrowTipWidth = 25;
        this.relArrowTipStart = 20;
        this.relArrowTipEnd = 50;
        this.relArrowNotchOffset = 6;
        this.relArrowBaseWidth = 12;
    }

    absCalc() {
        this.center = this.size / 2;
        this.spacing = this.size * this.relSpacing / 100;
        this.borderThickness = this.size * this.relBorderThickness / 100;
        this.angle = 2*Math.PI / this.numArrows;

        this.innerCircleDiameter = this.size * this.relInnerCircleDiameter / 100;
        this.innerCircleRadius = this.innerCircleDiameter / 2;
        this.arcDiameter = this.size * this.relArcDiameter / 100;
        this.arcRadius = this.arcDiameter / 2;
        this.arcThickness = this.size * this.relArcThickness / 100;
        this.arrowTipWidth = this.size * this.relArrowTipWidth / 100;
        this.arrowTipStart = -this.size * this.relArrowTipStart / 100;
        this.arrowTipEnd = -this.size * this.relArrowTipEnd / 100;
        this.arrowNotchOffset = this.size * this.relArrowNotchOffset / 100;
        this.arrowBaseWidth = this.size * this.relArrowBaseWidth / 100;

        // Point Calculations for paths

        // Arrow Part Calculations
        // Idea: Calculate each point relative to the center and taking spacing and the arc (base of the arrow) into account
        this.arrowPointLeft = new Vector(-this.arrowTipWidth / 2, this.arrowTipStart);
        this.arrowPointRight = new Vector(this.arrowTipWidth / 2, this.arrowTipStart);
        this.arrowPointTip = new Vector(0, this.arrowTipEnd);
        this.arrowPointNotchLeft = new Vector(-this.arrowBaseWidth / 2, this.arrowTipStart - this.arrowNotchOffset);
        this.arrowPointNotchRight = new Vector(this.arrowBaseWidth / 2, this.arrowTipStart - this.arrowNotchOffset);
        this.arrowArcRadius = this.innerCircleDiameter / 2 + this.spacing;
        this.arrowArcHeight = Vector.calcArcHeight(this.arrowArcRadius, this.arrowBaseWidth);
        this.arrowPointBaseLeft = new Vector(-this.arrowBaseWidth / 2, -this.innerCircleDiameter / 2 - this.spacing + this.arrowArcHeight);
        this.arrowPointBaseRight = new Vector(this.arrowBaseWidth / 2, -this.innerCircleDiameter / 2 - this.spacing + this.arrowArcHeight);

        // Arc Part Calculations
        // Idea: Create a nomalized vector, perpendicular to the arrow-side. Use it to offset the starting and endpoint
        // then intersect the parallel line with the outer circle and the offset circle

        // Step 1: Calculate a parallel line to the side of the arrow, with distance "spacing"
        let arrowLineStart = this.arrowPointLeft
        let arrowLineEnd = this.arrowPointTip

        // Normalize the vector (i.e. make it's length=1)
        let arrowLineVector = new Vector(arrowLineStart.x - arrowLineEnd.x, arrowLineStart.y - arrowLineEnd.y).normalized();
        let arrowLinePerpendicular = arrowLineVector.perpendicular();

        // Calculate Parallel line point 1 and point 2
        this.parallelP1 = new Vector(arrowLineStart.x + arrowLinePerpendicular.x * this.spacing,
                            arrowLineStart.y + arrowLinePerpendicular.y * this.spacing);
        this.parallelP2 = new Vector(arrowLineEnd.x + arrowLinePerpendicular.x * this.spacing,
                            arrowLineEnd.y + arrowLinePerpendicular.y * this.spacing);
        
        // Step 2: Calculate starting and endpoints for the arcs of the ringpart
        // calculate intersections
        let parallelLineVector = this.parallelP2.subtract(this.parallelP1);
        let D = this.parallelP1.determinate(this.parallelP2);

        let intersections = parallelLineVector.circleIntersections(D, this.arcRadius)
        this.arcPoint1    = intersections[0];
        intersections     = parallelLineVector.circleIntersections(D, this.arcRadius - this.arcThickness)
        this.arcPoint2    = intersections[0];

        // Rotated points
        this.arcPoint3 = this.arcPoint1.rotate(this.angle);
        this.arcPoint4 = this.arcPoint2.rotate(this.angle);

    }

    createArc(id) {
        const arcPart = this.svg.createPath("arcPart", `
            M ${this.arcPoint2.str()}
            A ${this.arcRadius - this.arcThickness} ${this.arcRadius - this.arcThickness} 0 0 0 ${this.arcPoint4.str()}
            L ${this.arcPoint3.str()}
            A ${this.arcRadius} ${this.arcRadius} 0 0 1 ${this.arcPoint1.str()}
            Z
        `);
        arcPart.setAttribute("id", id);
        return arcPart;
    }

    arrangeArcs(id) {
        const ringParts = this.svg.createGroup(id);
        for (let i = 0; i < this.numArrows; i++) {
            const angle = (360 / this.numArrows) * i + this.rotation;
            const ringPart = this.createArc("arc-" + (i+1));
            ringPart.setAttribute("transform", `rotate(${angle} 0 0)`);
            ringParts.appendChild(ringPart);
        }
        return ringParts;
    }



    createArrow(id) {
        const arrow = this.svg.createPath(id, `
            M ${this.arrowPointLeft.str()}
            L ${this.arrowPointTip.str()}
            L ${this.arrowPointRight.str()}
            L ${this.arrowPointNotchRight.str()}
            L ${this.arrowPointBaseRight.str()}
            A ${this.arrowArcRadius} ${this.arrowArcRadius} 0 0 0 ${this.arrowPointBaseLeft.str()}
            L ${this.arrowPointNotchLeft.str()}
            Z
        `);
        return arrow;
    }

    arrangeArrows(id) {
        const arrows = this.svg.createGroup(id);
        for (let i = 0; i < this.numArrows; i++) {
            const angle = (360 / this.numArrows) * i + this.rotation;
            const arrow = this.createArrow("arrow-" + (i+1));
            arrow.setAttribute("transform", `rotate(${angle} 0 0)`);
            arrows.appendChild(arrow);
        }
        return arrows;
    }

    generate() {
        // Calculate new absolute values and clear the SVG
        this.absCalc();
        this.svg.xml.innerHTML = "";

        // Set the new SVG viewBox size
        this.svg.xml.setAttribute("viewBox", `${-this.size/2} ${-this.size/2} ${this.size} ${this.size}`);

        // Prepare elements
        let innerCircle = this.svg.createCircle("innerCircle", 0, 0, this.innerCircleDiameter);
        let arrows = this.arrangeArrows("arrows");
        let arcParts = this.arrangeArcs("arcs");

        // Append elements to the SVG
        let partsGroup = this.svg.createGroup(this.idPrefix + "-group", innerCircle, arrows, arcParts);
        this.svg.xml.appendChild(partsGroup);

        // Colorize it
        this.svg.xml.setAttribute("fill", this.color1);
        this.svg.xml.setAttribute("stroke", this.color2);
        this.svg.xml.setAttribute("stroke-width", this.borderThickness);

        // Return the SVG as a string
        this.outString = this.svg.xml.outerHTML
        this.container.innerHTML = this.outString;
        return true;
    }

}