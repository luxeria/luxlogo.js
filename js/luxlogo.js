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

    createGroup(id, ...objects) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("id", id);
        objects.forEach(object => {
            group.appendChild(object);
        });
        return group;
    }

    createClipPath(id, ...hrefs) {
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

    createMask(id, ...hrefs) {
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

class LuxLogo {
    constructor() {
        // Constructor with intial values
        this.svg = new SVGHelper("luxlogo_svg");
        this.size = 512;
        this.color1 = "#000000";
        this.rotation = 0;
        this.center = this.size / 2;
        this.numArrows = 3;
        this.relBorderThickness = 0;
        this.relSpacing = 8;
        this.relInnerCircleDiameter = 24;
        this.relOuterCircleDiameter = 85;
        this.relOuterCircleThickness = 12;
        this.relArrowTipWidth = 25;
        this.relArrowTipStart = 20;
        this.relArrowTipEnd = 50;
        this.relArrowNotchOffset = 6;
        this.relArrowBaseWidth = 12;

        // Calculate absolute values from relative values
        this.absCalc();
    }

    absCalc() {
        this.center = this.size / 2;
        this.spacing = this.size * this.relSpacing / 100;
        this.borderThickness = this.size * this.relBorderThickness / 100;

        this.innerCircleDiameter = this.size * this.relInnerCircleDiameter / 100;
        this.innerCircleRadius = this.innerCircleDiameter / 2;
        this.outerCircleDiameter = this.size * this.relOuterCircleDiameter / 100;
        this.outerCircleRadius = this.outerCircleDiameter / 2;
        this.outerCircleThickness = this.size * this.relOuterCircleThickness / 100;

        // Arrow Calculations
        this.arrowTipWidth = this.size * this.relArrowTipWidth / 100;
        this.arrowTipStart = this.center - this.size * this.relArrowTipStart / 100;
        this.arrowTipEnd = this.center - this.size * this.relArrowTipEnd / 100;
        this.arrowNotchOffset = this.size * this.relArrowNotchOffset / 100;
        this.arrowBaseWidth = this.size * this.relArrowBaseWidth / 100;
        this.arrowBaseX = this.center - this.arrowBaseWidth / 2;
        const circleSegmentRadius = this.innerCircleDiameter / 2 + this.spacing;
        const circleSegmentLength = this.arrowBaseWidth;
        const theta = 2 * Math.asin(circleSegmentLength / (2 * circleSegmentRadius));
        this.arrowBaseOffsetCircleSegment = circleSegmentRadius - Math.sqrt(circleSegmentRadius ** 2 - (circleSegmentLength / 2) ** 2);
        this.arrowBaseY = this.center - this.innerCircleDiameter / 2 - this.spacing + this.arrowBaseOffsetCircleSegment ;

        // Outer Ring Part Calculations

    }

    createArrow(id) {
        // Create path for arrow
        const arrow = this.svg.createPath("arrow", `
            M ${this.center - this.arrowTipWidth / 2} ${this.arrowTipStart}
            L ${this.center} ${this.arrowTipEnd}
            L ${this.center + this.arrowTipWidth / 2} ${this.arrowTipStart}
            L ${this.center + this.arrowBaseWidth / 2} ${this.arrowTipStart - this.arrowNotchOffset}
            L ${this.center + this.arrowBaseWidth / 2} ${this.arrowBaseY}
            A ${this.innerCircleRadius} ${this.innerCircleRadius} 0 0 0 ${this.center - this.arrowBaseWidth / 2} ${this.arrowBaseY}
            L ${this.center - this.arrowBaseWidth / 2} ${this.arrowTipStart - this.arrowNotchOffset}
            L ${this.center - this.arrowTipWidth / 2} ${this.arrowTipStart}
            Z
        `);
        arrow.setAttribute("id", id);

        return arrow;
    }

    arrangeArrows() {
        const arrows = this.svg.createGroup("arrows");
        for (let i = 0; i < this.numArrows; i++) {
            const angle = (360 / this.numArrows) * i + this.rotation;
            const arrow = this.createArrow("arrow-" + (i+1));
            arrow.setAttribute("transform", `rotate(${angle} ${this.center} ${this.center})`);
            arrows.appendChild(arrow);
        }
        return arrows;
    }

    createOuterRingPart(id) {
        const outerRingPart = this.svg.createPath("outerRingPart", `
            M ${this.center - this.outerCircleRadius} ${this.center}
            A ${this.outerCircleRadius} ${this.outerCircleRadius} 0 0 0 ${this.center + this.outerCircleRadius} ${this.center}
            A ${this.outerCircleRadius} ${this.outerCircleRadius} 0 0 0 ${this.center - this.outerCircleRadius} ${this.center}
            Z
        `);
        outerRingPart.setAttribute("id", id);
        return outerRingPart;
    }

    generate() {

        // Calculate new absolute values
        this.absCalc();

        console.log('LuxLogo.generate() called');

        // Clear existing SVG contents
        this.svg.xml.innerHTML = "";

        // Set the new SVG viewBox size
        this.svg.xml.setAttribute("viewBox", `0 0 ${this.size} ${this.size}`);

        // Add the inner circle
        const innerCircle = this.svg.createCircle("innerCircle", this.center, this.center, this.innerCircleDiameter);

        // Add arrow group
        const arrows = this.arrangeArrows();

        // Add outer ring
        const outerRingPart = this.createOuterRingPart("outerRingPart");

        // Add arrows
        //this.svg.appendChild(this.createArrowMask("arrowMask"));
        //const arrows = this.arrangeArrows();
        //this.svg.appendChild(arrows);

        // Add outer ring
        //this.svg.appendChild(this.createOuterRingMask("outerRingMask"));
        //const outerRing = this.createCircle(this.center, this.center, this.outerCircleDiameter);
        //outerRing.setAttribute("mask", "url(#outerRingMask)");
        //this.svg.appendChild(outerRing);

        // Colorize it
        //this.svg.xml.setAttribute("fill", this.color1);
        //this.svg.setAttribute("stroke", "black");
        //this.svg.setAttribute("stroke-width", this.borderThickness);

        // Append elements to the SVG
        this.svg.xml.appendChild(innerCircle);
        //this.svg.xml.appendChild(arrows);
        this.svg.xml.appendChild(outerRingPart);

        // Colorize it
        this.svg.xml.setAttribute("fill", this.color1);
        this.svg.xml.setAttribute("stroke", "red");
        this.svg.xml.setAttribute("stroke-width", this.borderThickness);

        // Return the SVG as a string
        return this.svg.xml.outerHTML;

    }

}