class LuxLogo {
    constructor() {
        // Constructor with intial values
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        this.svg.setAttribute("version", "1.1");
        this.svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
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
        this.relCalc();
    }

    relCalc() {
        this.center = this.size / 2;
        this.spacing = this.size * this.relSpacing / 100;
        this.borderThickness = this.size * this.relBorderThickness / 100;
        this.innerCircleDiameter = this.size * this.relInnerCircleDiameter / 100;
        this.outerCircleDiameter = this.size * this.relOuterCircleDiameter / 100;
        this.outerCircleThickness = this.size * this.relOuterCircleThickness / 100;
        this.arrowTipWidth = this.size * this.relArrowTipWidth / 100;
        this.arrowTipStart = this.center - this.size * this.relArrowTipStart / 100;
        this.arrowTipEnd = this.center - this.size * this.relArrowTipEnd / 100;
        this.arrowNotchOffset = this.size * this.relArrowNotchOffset / 100;

        // Todo: Implement a better (easier readable) way to calculate the arrow base
        this.arrowBaseWidth = this.size * this.relArrowBaseWidth / 100;
        this.arrowBaseX = this.center - this.arrowBaseWidth / 2;
        const circleSegmentRadius = this.innerCircleDiameter / 2 + this.spacing;
        const circleSegmentLength = this.arrowBaseWidth;
        const theta = 2 * Math.asin(circleSegmentLength / (2 * circleSegmentRadius));
        this.arrowBaseOffsetCircleSegment = circleSegmentRadius - Math.sqrt(circleSegmentRadius ** 2 - (circleSegmentLength / 2) ** 2);
        this.arrowBaseHeight = this.center - this.innerCircleDiameter / 2 - this.arrowTipStart + Math.abs(this.arrowNotchOffset) + this.arrowBaseOffsetCircleSegment + 1; // Add +1 height to make sure the parts overlap
        this.arrowBaseY = this.center - this.arrowBaseHeight - this.innerCircleDiameter / 2 + this.arrowBaseOffsetCircleSegment;
    }

    // Generic SVG functions
    createCircle(cx, cy, d) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const r = d / 2;
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        return circle;
    }

    createRectangle(x, y, w, h) {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        return rect;
    }

    createClipPath(id, clipShape) {
        const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        clipPath.setAttribute("id", id);
        clipPath.appendChild(clipShape);
        return clipPath;
    }

    createMask(id, ...maskShapes) {
        const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
        mask.setAttribute("id", id);
        maskShapes.forEach(shape => {
            mask.appendChild(shape);
        });
        return mask;
    }

    createPolygon(points) {
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", points.map(p => p.join(",")).join(" "));
        return polygon;
    }

    combineShapes(id, ...shapes) {
        const svgNS = "http://www.w3.org/2000/svg";
    
        // Create the rectangle that covers the entire area
        const canvas = this.createRectangle(0, 0, this.size, this.size);
        canvas.setAttribute("fill", "white");
    
        // Group the shapes
        const group = document.createElementNS(svgNS, "g");
        shapes.forEach(shape => {
            group.appendChild(shape);
        });
    
        // Create the clipPath
        const clipPath = document.createElementNS(svgNS, "clipPath");
        clipPath.setAttribute("id", id);
        clipPath.appendChild(group);
    
        // Create a defs element and append the clipPath to it
        const defs = document.createElementNS(svgNS, "defs");
        defs.appendChild(clipPath);
    
        // Apply the clipPath to the canvas
        canvas.setAttribute("clip-path", `url(#${id})`);
    
        // Group the clipped canvas and the original shapes
        const resultGroup = document.createElementNS(svgNS, "g");
        resultGroup.appendChild(canvas);
        resultGroup.appendChild(group.cloneNode(true));

        return resultGroup;
    }

    // Logo specific functions
    createArrow() {
        const polygonPoints = [
            [this.center, this.arrowTipEnd],
            [this.center + this.arrowTipWidth / 2, this.arrowTipStart],
            [this.center, this.arrowTipStart - this.arrowNotchOffset],
            [this.center - this.arrowTipWidth / 2, this.arrowTipStart]
        ];
        const arrowPolygon = this.createPolygon(polygonPoints);
        const arrowBase = this.createRectangle(this.arrowBaseX, this.arrowBaseY, this.arrowBaseWidth, this.arrowBaseHeight);

        const arrowGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        arrowGroup.appendChild(arrowBase);
        arrowGroup.appendChild(arrowPolygon);

        // Add a mask to cut the arrow base
        arrowGroup.setAttribute("mask", "url(#arrowMask)");

        const combinedArrow = this.combineShapes("arrowClip", arrowGroup);

        return combinedArrow;
    }

    arrangeArrows() {
        const arrows = document.createElementNS("http://www.w3.org/2000/svg", "g");
        for (let i = 0; i < this.numArrows; i++) {
            const angle = (360 / this.numArrows) * i + this.rotation;
            const arrow = this.createArrow();
            arrow.setAttribute("transform", `rotate(${angle}, ${this.center}, ${this.center})`);
            arrows.appendChild(arrow);
        }
        return arrows;
    }

    createArrowMask(id) {
        const canvas = this.createRectangle(0, 0, this.size, this.size);
        canvas.setAttribute("fill", "white");

        const circle = this.createCircle(this.center, this.center, this.innerCircleDiameter + this.spacing);
        circle.setAttribute("fill", "black");

        return this.createMask(id, canvas, circle);
    }

    createOuterRingMask(id) {
        const canvas = this.createRectangle(0, 0, this.size, this.size);
        canvas.setAttribute("fill", "white");

        const arrows = this.arrangeArrows();
        arrows.setAttribute("fill", "black");
        arrows.setAttribute("stroke", "black");
        arrows.setAttribute("stroke-width", this.spacing);

        const circle = this.createCircle(this.center, this.center, this.outerCircleDiameter - this.outerCircleThickness * 2);
        circle.setAttribute("fill", "black");

        return this.createMask(id, canvas, arrows, circle);
    }

    generate() {

        // Set the new SVG viewBox size
        this.svg.setAttribute("viewBox", `0 0 ${this.size} ${this.size}`);

        // Clear existing SVG contents
        this.svg.innerHTML = "";

        // Add the inner circle
        const innerCircle = this.createCircle(this.center, this.center, this.innerCircleDiameter);
        this.svg.appendChild(innerCircle);

        // Add arrows
        this.svg.appendChild(this.createArrowMask("arrowMask"));
        const arrows = this.arrangeArrows();
        this.svg.appendChild(arrows);

        // Add outer ring
        this.svg.appendChild(this.createOuterRingMask("outerRingMask"));
        const outerRing = this.createCircle(this.center, this.center, this.outerCircleDiameter);
        outerRing.setAttribute("mask", "url(#outerRingMask)");
        this.svg.appendChild(outerRing);

        // Colorize it
        this.svg.setAttribute("fill", this.color1);
        this.svg.setAttribute("stroke", "black");
        this.svg.setAttribute("stroke-width", this.borderThickness);

        // Return the SVG as a string
        return this.svg.outerHTML;

    }

}