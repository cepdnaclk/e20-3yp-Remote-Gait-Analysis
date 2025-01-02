// const navLinkEls = document.querySelectorAll(".main-nav-link");
// const windowPathName = window.location.hash;
// console.log("hii");
// navLinkEls.forEach((navLinkEl) => {
//   console.log(navLinkEl);
//   if (navLinkEl.hash === windowPathName) {
//     navLinkEl.classList.add("active");
//   }
// });

///////////////////////////////////////////////////////////
// Smooth scrolling animation

const allLinks = document.querySelectorAll(".main-nav-link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const href = link.getAttribute("href");
    console.log(href);

    allLinks.forEach((link_) => {
      link_.classList.remove("active");

      if (href === link_.getAttribute("href")) {
        link_.classList.add("active");
        console.log("hi");
      }
      // console.log(link);
    });

    // Scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // Scroll to other links
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile naviagtion
    // if (link.classList.contains("main-nav-link"))
    //   headerEl.classList.toggle("nav-open");
  });
});

///////////////////////////////////////////////////////////
// Sticky navigation

const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    console.log(ent);

    if (ent.isIntersecting === false) {
      document.body.classList.add("sticky");
    }

    if (ent.isIntersecting === true) {
      document.body.classList.remove("sticky");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);
obs.observe(sectionHeroEl);
