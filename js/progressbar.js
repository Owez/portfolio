// NOTE: From https://www.florin-pop.com/blog/2017/08/reading-progress-bar/
let prog = document.getElementById('progress');

let body = document.body,
    html = document.documentElement;

let height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
);

const setProgress = () => {
    let scrollFromTop = (html.scrollTop || body.scrollTop) + html.clientHeight;
    let width = (scrollFromTop / height) * 100 + '%';

    prog.style.width = width;
};

window.addEventListener('scroll', setProgress);

setProgress();
