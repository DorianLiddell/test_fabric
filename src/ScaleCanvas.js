import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const ScaleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current);

        const base = new fabric.Rect({
            left: 400,
            top: 100,
            width: 10,
            height: 450,
            selectable: false,
            fill: 'black',
            originX: 'center'

        });

        const beam = new fabric.Rect({
            left: 400,
            top: 200,
            width: 500,
            height: 10,
            selectable: false,
            fill: 'black',
            originX: 'center',
            originY: 'center'
        });

        const top = new fabric.Circle({
            left: 400,
            top: 70,
            radius: 30,
            selectable: false,
            fill: 'black',
            originX: 'center',
            originY: 'center'
        });

        const leftPlate = new fabric.Rect({
            left: 150,
            top: 380,
            width: 150,
            height: 10,
            fill: 'black',
            originX: 'center',
            originY: 'center'
        });

        const rightPlate = new fabric.Rect({
            left: 650,
            top: 380,
            width: 150,
            height: 10,
            fill: 'black',
            originX: 'center',
            originY: 'center'
        });

        const leftLine1 = new fabric.Line([150, 200, 125, 380], {
            stroke: 'black',
            selectable: false
        });

        const leftLine2 = new fabric.Line([150, 200, 275, 380], {
            stroke: 'black',
            selectable: false
        });

        const rightLine1 = new fabric.Line([650, 200, 525, 380], {
            stroke: 'black',
            selectable: false
        });

        const rightLine2 = new fabric.Line([650, 200, 675, 380], {
            stroke: 'black',
            selectable: false
        });

        const leftCircle = new fabric.Circle({
            left: 150,
            top: 320,
            radius: 30,
            fill: 'red',
            originX: 'center',
            originY: 'center',
        });

        const rightCircle = new fabric.Circle({
            left: 650,
            top: 320,
            radius: 30,
            fill: 'blue',
            originX: 'center',
            originY: 'center',
        });


        canvas.add(
            top,
            base,
            beam,
            leftLine1,
            leftLine2,
            rightLine1,
            rightLine2,
            leftPlate,
            rightPlate,
            leftCircle,
            rightCircle
        );


        const updateScale = () => {
            const leftArea = Math.PI * Math.pow(leftCircle.radius, 2);
            const rightArea = Math.PI * Math.pow(rightCircle.radius, 2);
            const delta = rightArea - leftArea;

            const maxAngle = 15;
            const angle = maxAngle * (delta / (leftArea + rightArea));

            fabric.util.animate({
                startValue: beam.angle,
                endValue: angle,
                duration: 1000,
                easing: fabric.util.ease.easeOutBounce,
                onChange: (value) => {
                    beam.set('angle', value);

                    const leftPlateNewTop = 380 - (value / maxAngle) * 50; 
                    const rightPlateNewTop = 380 + (value / maxAngle) * 50;

                    leftPlate.set('top', leftPlateNewTop);
                    rightPlate.set('top', rightPlateNewTop);

                    const beamLeftX = beam.left - beam.width / 2;
                    const beamRightX = beam.left + beam.width / 2;

                    leftLine1.set({ x1: beamLeftX, y1: beam.top, x2: leftPlate.left - 75, y2: leftPlateNewTop });
                    leftLine2.set({ x1: beamLeftX, y1: beam.top, x2: leftPlate.left + 75, y2: leftPlateNewTop });

                    rightLine1.set({ x1: beamRightX, y1: beam.top, x2: rightPlate.left - 75, y2: rightPlateNewTop });
                    rightLine2.set({ x1: beamRightX, y1: beam.top, x2: rightPlate.left + 75, y2: rightPlateNewTop });

                    canvas.renderAll();
                }
            });
        };

        canvas.on('object:scaling', function (event) {
            const obj = event.target;
            if (obj === leftCircle || obj === rightCircle) {
                const newRadius = obj.radius * obj.scaleX;
                obj.set({
                    radius: newRadius,
                    scaleX: 1,
                    scaleY: 1
                });
                canvas.renderAll();
                updateScale();
            }
        });

        updateScale();

        return () => {
            canvas.dispose();
        };
    }, []);

    return (
        <canvas ref={canvasRef} width="800" height="600" style={{ border: '1px solid black' }}></canvas>
    );
};

export default ScaleCanvas;
