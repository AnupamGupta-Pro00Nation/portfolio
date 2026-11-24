export class ViewportObserver {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Dispatch custom event on the element
          entry.target.dispatchEvent(new CustomEvent('visible', { bubbles: true }));
          
          // If we only want to trigger once, unobserve
          if (entry.target.dataset.once !== 'false') {
            this.observer.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
  }

  observe(element) {
    if (element) {
      this.observer.observe(element);
    }
  }

  unobserve(element) {
    if (element) {
      this.observer.unobserve(element);
    }
  }

  observeAll(selector) {
    document.querySelectorAll(selector).forEach(el => this.observe(el));
  }
}

export const useIntersection = new ViewportObserver();
