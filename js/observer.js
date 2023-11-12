
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
}

const callback = (entries, observer) => {
  console.log('entries: ', entries);
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  })
}

export const observer = new IntersectionObserver(callback, options);