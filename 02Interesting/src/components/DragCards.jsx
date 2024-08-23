import React, { useEffect, useRef } from 'react';
import bg from '../assets/bg.jpeg'
import paper from '../assets/paper.webp'
import heart from '../assets/heart.webp'

function DragCards() {
    const paperRefs = useRef([]);
    const holdingPaper = useRef(false);
    const currentPaper = useRef(null);
    const mouseX = useRef(0);
    const mouseY = useRef(0);
    const prevX = useRef(0);
    const prevY = useRef(0);
    const highestZ = useRef(1);

    useEffect(() => {
        const handleMouseDown = (e) => {
            e.preventDefault();
            if (e.button === 0) {
                holdingPaper.current = true;
                currentPaper.current = e.currentTarget;
                currentPaper.current.style.zIndex = highestZ.current++;
                prevX.current = e.clientX;
                prevY.current = e.clientY;
            }
        };

        const handleMouseMove = (e) => {
            if (holdingPaper.current && currentPaper.current) {
                mouseX.current = e.clientX;
                mouseY.current = e.clientY;

                const deltaX = mouseX.current - prevX.current;
                const deltaY = mouseY.current - prevY.current;

                prevX.current = mouseX.current;
                prevY.current = mouseY.current;

                const currentLeft = parseInt(currentPaper.current.style.left || 0, 10);
                const currentTop = parseInt(currentPaper.current.style.top || 0, 10);

                currentPaper.current.style.left = `${currentLeft + deltaX}px`;
                currentPaper.current.style.top = `${currentTop + deltaY}px`;
            }
        };

        const handleMouseUp = () => {
            holdingPaper.current = false;
            currentPaper.current = null;
        };

        paperRefs.current.forEach((paper) => {
            paper.addEventListener('mousedown', handleMouseDown);
            paper.style.position = 'absolute';  // Ensure the paper is absolutely positioned
            paper.style.zIndex = highestZ.current++;
        });

        document.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            paperRefs.current.forEach((paper) => {
                paper.removeEventListener('mousedown', handleMouseDown);
            });
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className='w-full min-h-screen flex items-center justify-center ' style={{backgroundImage : `url(${bg})`,backgroundRepeat:'no-repeat',backgroundSize : 'cover'}}>
            <div
                ref={(el) => (paperRefs.current[3] = el)}
                className="paper absolute mt-10 flex items-center justify-center  h-48 w-72 border-4 border-white border-solid"
                style={{ left: '550px', top: '200px',backgroundImage : `url(${paper})`,backgroundRepeat:'no-repeat',backgroundSize : '600px'  }}
            >
                <p className='font-zeyada text-3xl'>Oye!!!</p>
            </div>
            <div
                ref={(el) => (paperRefs.current[2] = el)}
                className="paper absolute flex items-center justify-center   h-32 w-96 border-4 border-white border-solid"
                style={{ left: '500px', top: '195px',backgroundImage : `url(${paper})`,backgroundRepeat:'no-repeat',backgroundSize : '500px' }}
            >
                <p className='font-zeyada text-3xl'>Potti pilla</p>
            </div>
        
            <div
                ref={(el) => (paperRefs.current[1] = el)}
                className="paper absolute flex items-center justify-center   h-32 w-96 border-4 border-white border-solid"
                style={{ left: '500px', top: '335px',backgroundImage : `url(${paper})`,backgroundRepeat:'no-repeat',backgroundSize : '500px' }}
            >
                <p className='font-zeyada text-3xl'>Happy Birthday</p>
            </div>

            <div
                ref={(el) => (paperRefs.current[0] = el)}
                className="paper absolute flex items-center justify-center rounded-full  h-72 w-72 border-4 border-white border-solid "
                style={{ left: '550px', top: '200px',backgroundImage : `url(${paper})`,backgroundRepeat:'no-repeat',backgroundSize : '500px' }}
            >
                <img className='rounded w-56 h-56' src={heart} alt="" />
            </div>

        </div>
    );
}

export default DragCards;
