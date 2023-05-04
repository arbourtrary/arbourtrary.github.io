export function paintBackground(canvas, context, element, opacity) {
    if (element) {
        let mode = "contain";
        let percent = 0.5;

        // Background width and height
        let bw = element.width;
        let bh = element.height;

        if(element.nodeName == "VIDEO") {
            bw = element.videoWidth;
            bh = element.videoHeight;
        }

        // Canvas width and height
        let cw = canvas.width;
        let ch = canvas.height;

        // Horizontal and vertical ratios of canvas to image
        let hr = cw / bw;
        let vr = ch / bh;

        // Figure out the draw ratio
        let dr;
        switch(mode) {
            case "horizontal":
                dr = vr;
                break;
            case "vertical":
                dr = hr;
                break;
            case "cover":
            dr = Math.max(hr, vr);
                percent = .5;
                break;
            case "contain":
                dr = Math.min(hr, vr);
                percent = .5;
            break;
        }

        // Scale the image by the draw ratio
        let dw = bw * dr;
        let dh = bh * dr;

        // Figure out the x and y for the image
        let dx = (cw - dw) * percent;
        let dy = (ch - dh) * percent;

        // Draw the image
        context.globalAlpha = opacity;
        context.drawImage(element, 0,0, bw, bh, dx, dy, dw, dh);  
        context.globalCompositeOperation = "saturation";
        context.fillStyle = "hsl(0,200%,50%)";  // saturation at 100%
    }
}

export function paintImage(canvas, context, filename, opacity) {
    let image = new Image();
    image.src = filename;
    image.onload = function(){
        paintBackground(canvas, context, image, opacity)
    }
    return image
}