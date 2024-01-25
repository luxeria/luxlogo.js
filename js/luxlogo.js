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

class LuxLogo {
    constructor() {
        // Constructor with intial values
        this.svg = new SVGHelper("luxlogo_svg");
        this.size = 512;
        this.color1 = "#000000";
        this.color2 = "#ffffff";
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
        //ToDo: Check if we can delete this:
        //this.absCalc(); // Does not seem to be necessary
    }

    absCalc() {
        this.center = this.size / 2;
        this.spacing = this.size * this.relSpacing / 1000;
        this.borderThickness = this.size * this.relBorderThickness / 1000;

        this.innerCircleDiameter = this.size * this.relInnerCircleDiameter / 100;
        this.innerCircleRadius = this.innerCircleDiameter / 2;
        this.outerCircleDiameter = this.size * this.relOuterCircleDiameter / 100;
        this.outerCircleRadius = this.outerCircleDiameter / 2;
        this.outerCircleThickness = this.size * this.relOuterCircleThickness / 100;

        // Arrow Calculations
        this.arrowTipWidth = this.size * this.relArrowTipWidth / 100;
        this.arrowTipStart = this.center - this.size * this.relArrowTipStart / 100;
        this.arrowTipEnd = this.center - this.size * this.relArrowTipEnd / 100;
        this.arrowNotchOffset = this.size * this.relArrowNotchOffset / 1000;
        this.arrowBaseWidth = this.size * this.relArrowBaseWidth / 100;
        this.arrowBaseX = this.center - this.arrowBaseWidth / 2;
        const circleSegmentRadius = this.innerCircleDiameter / 2 + this.spacing;
        const circleSegmentLength = this.arrowBaseWidth;
        const theta = 2 * Math.asin(circleSegmentLength / (2 * circleSegmentRadius));
        this.arrowBaseOffsetCircleSegment = circleSegmentRadius - Math.sqrt(circleSegmentRadius ** 2 - (circleSegmentLength / 2) ** 2);
        this.arrowBaseY = this.center - this.innerCircleDiameter / 2 - this.spacing + this.arrowBaseOffsetCircleSegment ;

        // Outer Ring Part Calculations
        
        this.angle = 2*Math.PI / this.numArrows;

        // Step 1: Calculate a parallel line to the side of the arrow, with distance "spacing"
        // Idea: Create a nomalized vector, perpendicular to the arrow-side. Use it to offset the starting and endpoint
        let arrowStartX = this.center - this.arrowTipWidth / 2;
        let arrowStartY = this.arrowTipStart;
        let arrowEndX = this.center;
        let arrowEndY =  this.arrowTipEnd;

        // Vector along the arrow
        let arrowVectorX = arrowStartX - arrowEndX;
        let arrowVectorY = arrowStartY - arrowEndY;
        // Normalize the vector (i.e. make it's length=1)
        let n = Math.sqrt(arrowVectorX*arrowVectorX + arrowVectorY*arrowVectorY);
        arrowVectorX = arrowVectorX/n;
        arrowVectorY = arrowVectorY/n;
        // rotate it by 90° CCW
        let arrowVectorPX = -arrowVectorY;
        let arrowVectorPY = arrowVectorX;

        // Calculate Parallel line point 1 and point 2
        this.p1X = arrowStartX + arrowVectorPX * this.spacing;
        this.p1Y = arrowStartY + arrowVectorPY * this.spacing;
        this.p2X = arrowEndX + arrowVectorPX * this.spacing;
        this.p2Y = arrowEndY + arrowVectorPY * this.spacing;

        let pc1X = this.p1X - this.center;
        let pc1Y = this.p1Y - this.center;
        let pc2X = this.p2X - this.center;
        let pc2Y = this.p2Y - this.center;

        // Step 2: Calculate starting and endpoints for the arcs of the ringpart
        // Idea: Intersect the parallel line with the outer circle and the inner circle

        
        // calculate intersections
        // Source: https://mathworld.wolfram.com/Circle-LineIntersection.html
        let dx = pc2X - pc1X;
        let dy = pc2Y - pc1Y;
        let D = pc1X*pc2Y-pc2X*pc1Y;

        let arcC1X = this.calculateIntersectionX(dx,dy,D,this.outerCircleRadius);
        let arcC1Y = this.calculateIntersectionY(dx,dy,D,this.outerCircleRadius);
        let arcC2X = this.calculateIntersectionX(dx,dy,D,this.outerCircleRadius - this.outerCircleThickness);
        let arcC2Y = this.calculateIntersectionY(dx,dy,D,this.outerCircleRadius - this.outerCircleThickness);

        let arcC3X = Math.cos(this.angle) * arcC1X - Math.sin(this.angle) * arcC1Y;
        let arcC3Y = Math.sin(this.angle) * arcC1X + Math.cos(this.angle) * arcC1Y;
        let arcC4X = Math.cos(this.angle) * arcC2X - Math.sin(this.angle) * arcC2Y;
        let arcC4Y = Math.sin(this.angle) * arcC2X + Math.cos(this.angle) * arcC2Y;

        this.arc1X = arcC1X + this.center;
        this.arc1Y = arcC1Y + this.center;

        this.arc2X = arcC2X + this.center;
        this.arc2Y = arcC2Y + this.center;

        this.arc3X = -arcC3X + this.center;
        this.arc3Y = arcC3Y + this.center;

        this.arc4X = -arcC4X + this.center;
        this.arc4Y = arcC4Y + this.center;
    }

    calculateIntersectionX(dx,dy,D,r){
        // Source: https://mathworld.wolfram.com/Circle-LineIntersection.html
        let dr = Math.sqrt(dx*dx+dy*dy);
        let x = (D*dy - Math.sign(dy)*dx*Math.sqrt(r*r*dr*dr-D*D))/ (dr*dr);
        return x;
    }
    calculateIntersectionY(dx,dy,D,r){
        // Source: https://mathworld.wolfram.com/Circle-LineIntersection.html
        let dr = Math.sqrt(dx*dx+dy*dy);
        let y = (-D*dx - Math.abs(dy)*Math.sqrt(r*r*dr*dr-D*D))/ (dr*dr);
        return y;
    }

    // This would be a better way to create the outer ring part to make it compatible with Vector Graphics
    // editors like Inkscape, but it is not working yet... Each point needs to be calculated separately...
    createOuterRingPart(id) {
        const outerRingPart = this.svg.createPath("outerRingPart", `
            M ${this.arc3X} ${this.arc3Y}
            A ${this.outerCircleRadius} ${this.outerCircleRadius} 0 0 1 ${this.arc1X} ${this.arc1Y}
            L  ${this.arc2X} ${this.arc2Y}
            A ${this.outerCircleRadius - this.outerCircleThickness} ${this.outerCircleRadius - this.outerCircleThickness} 0 0 0 ${this.arc4X} ${this.arc4Y}
            Z
        `);
        outerRingPart.setAttribute("id", id);
        return outerRingPart;
    }
    arrangeOuterRingParts(id) {
        const ringParts = this.svg.createGroup(id);
        for (let i = 0; i < this.numArrows; i++) {
            const angle = (360 / this.numArrows) * i + this.rotation;
            const ringPart = this.createOuterRingPart("arrow-" + (i+1));
            ringPart.setAttribute("transform", `rotate(${angle} ${this.center} ${this.center})`);
            ringParts.appendChild(ringPart);
        }
        return ringParts;
    }



    createArrow(id) {
        const arrow = this.svg.createPath(id, `
            M ${this.center - this.arrowTipWidth / 2} ${this.arrowTipStart}
            L ${this.center} ${this.arrowTipEnd}
            L ${this.center + this.arrowTipWidth / 2} ${this.arrowTipStart}
            L ${this.center + this.arrowBaseWidth / 2} ${this.arrowTipStart - this.arrowNotchOffset}
            L ${this.center + this.arrowBaseWidth / 2} ${this.arrowBaseY}
            A ${this.innerCircleRadius + this.spacing} ${this.innerCircleRadius + this.spacing} 0 0 0 ${this.center - this.arrowBaseWidth / 2} ${this.arrowBaseY}
            L ${this.center - this.arrowBaseWidth / 2} ${this.arrowTipStart - this.arrowNotchOffset}
            L ${this.center - this.arrowTipWidth / 2} ${this.arrowTipStart}
            Z
        `);
        return arrow;
    }

    arrangeArrows(id) {
        const arrows = this.svg.createGroup(id);
        for (let i = 0; i < this.numArrows; i++) {
            const angle = (360 / this.numArrows) * i + this.rotation;
            const arrow = this.createArrow("arrow-" + (i+1));
            arrow.setAttribute("transform", `rotate(${angle} ${this.center} ${this.center})`);
            arrows.appendChild(arrow);
        }
        return arrows;
    }

    generate() {
        // Calculate new absolute values and clear the SVG
        this.absCalc();
        this.svg.xml.innerHTML = "";

        // Set the new SVG viewBox size
        this.svg.xml.setAttribute("viewBox", `0 0 ${this.size} ${this.size}`);

        // Prepare elements
        const innerCircle = this.svg.createCircle("innerCircle", this.center, this.center, this.innerCircleDiameter);
        const arrows = this.arrangeArrows("arrows");
        const outerRing = this.svg.createCircle("outerRing", this.center, this.center, this.outerCircleDiameter);
        outerRing.setAttribute("mask", "url(#outerRingMask)");
        const outerRingParts = this.arrangeOuterRingParts("outerRingPart");

        // Append elements to the SVG
        this.svg.xml.appendChild(innerCircle);
        this.svg.xml.appendChild(arrows);
        this.svg.xml.appendChild(outerRingParts);

        // Colorize it
        this.svg.xml.setAttribute("fill", this.color1);
        this.svg.xml.setAttribute("stroke", this.color2);
        this.svg.xml.setAttribute("stroke-width", this.borderThickness);

        // Return the SVG as a string
        return this.svg.xml.outerHTML;

    }

}