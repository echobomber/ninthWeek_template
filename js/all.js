document.addEventListener('DOMContentLoaded', function() {
    const ele = document.querySelector('.recommendation-wall');
    ele.style.cursor = 'grab';
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };
    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
});

// 以下開始撰寫 JS 程式碼
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 2],
        ['Antony 雙人床架', 3],
        ['Anty 雙人床架', 2],
        ['Charles 雙人床架', 3],
        ],
        colors:{
            "Louvre 雙人床架":"#301E5F",
            "Antony 雙人床架":"#5434A7",
            "Anty 雙人床架": "#9D7FEA",
            "Charles 雙人床架": "#6A33F8",
        }
    },
});