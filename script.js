/* ========================================
   PORTFOLIO MASTER JAVASCRIPT — Atharva Agarwal
   ======================================== */

// Global Error Handler for Debugging
window.addEventListener('error', function(e) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.background = '#ff0033';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '20px';
    errorDiv.style.zIndex = '99999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.border = '2px solid white';
    errorDiv.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    errorDiv.innerText = 'Run-time Error:\n' + e.message + '\n\nFile: ' + e.filename + '\nLine: ' + e.lineno;
    document.body.appendChild(errorDiv);
});

window.addEventListener('unhandledrejection', function(e) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.background = '#ff6600';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '20px';
    errorDiv.style.zIndex = '99999999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.border = '2px solid white';
    errorDiv.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    errorDiv.innerText = 'Promise Rejection:\n' + e.reason;
    document.body.appendChild(errorDiv);
});

// GSAP Preloader Countdown & Intro Animations
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    const logo = document.getElementById('marvel-logo-text');
    const flash = document.getElementById('marvel-flash-light');
    const flowWrapper = document.getElementById('flow-wrapper');
    const cWrapper = document.getElementById('c-wrapper');
    const cLeft = document.getElementById('c-left');
    const cRight = document.getElementById('c-right');
    const preloaderAudio = document.getElementById('preloader-audio');
    
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Audio Player setup
    const globalMuteToggleBtn = document.getElementById('global-mute-toggle');
    const globalMuteIcon = document.getElementById('global-mute-icon');
    
    let audioStarted = false;
    let isMuted = false; // Always start unmuted per user request
    if (preloaderAudio) {
        preloaderAudio.muted = isMuted;
        preloaderAudio.volume = 0.35; // Comfortable volume
        updateMuteIcon();
    }

    function updateMuteIcon() {
        if (!preloaderAudio) return;
        const iconClass = preloaderAudio.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
        const ariaText = preloaderAudio.muted ? 'Unmute music' : 'Mute music';
        
        if (globalMuteIcon && globalMuteToggleBtn) {
            globalMuteIcon.className = iconClass;
            globalMuteToggleBtn.setAttribute('aria-label', ariaText);
        }
    }

    const startAudio = () => {
        if (audioStarted || !preloaderAudio) return;
        preloaderAudio.play().then(() => {
            audioStarted = true;
            cleanupAudioListeners();
        }).catch(err => {
            console.warn("Audio autoplay blocked or failed:", err);
        });
    };

    const cleanupAudioListeners = () => {
        document.removeEventListener('click', startAudio);
        document.removeEventListener('touchstart', startAudio);
        document.removeEventListener('keydown', startAudio);
        document.removeEventListener('mousedown', startAudio);
    };

    // Try playing immediately, if browser allows
    if (preloaderAudio) {
        preloaderAudio.play().then(() => {
            audioStarted = true;
        }).catch(() => {
            // Autoplay blocked, listen for first user interaction
            document.addEventListener('click', startAudio);
            document.addEventListener('touchstart', startAudio);
            document.addEventListener('keydown', startAudio);
            document.addEventListener('mousedown', startAudio);
        });
    }

    const handleMuteToggle = (e) => {
        if (e) e.stopPropagation();
        if (!preloaderAudio) return;
        
        preloaderAudio.play().then(() => {
            audioStarted = true;
            cleanupAudioListeners();
            preloaderAudio.muted = !preloaderAudio.muted;
            localStorage.setItem('preloader-audio-muted', preloaderAudio.muted);
            updateMuteIcon();
        }).catch(err => {
            console.error("Failed to play audio:", err);
        });
    };

    if (globalMuteToggleBtn) {
        globalMuteToggleBtn.addEventListener('click', handleMuteToggle);
    }

    // Hide scrollbar during preload
    if (!prefersReducedMotion) {
        document.body.style.overflow = 'hidden';
    }
    
    // Initial state resets
    logo.style.webkitTextFillColor = 'transparent';
    logo.style.backgroundColor = 'transparent';
    logo.style.borderColor = 'transparent';
    logo.style.padding = '1.5rem 3rem';
    
    gsap.set(logo, { scale: 0.2, opacity: 0 });
    gsap.set(flowWrapper, { scale: 1, rotation: 0, opacity: 1 });
    gsap.set(flash, { opacity: 0 });
    
    // Set initial state of main page content for the zoom-in camera reveal
    gsap.set('main', { scale: 1.25, y: 80, filter: 'blur(10px)', opacity: 0 });
    
    // Set initial offscreen positions for collision text based on viewport width to guarantee complete separation
    gsap.set(cLeft, { x: -window.innerWidth * 0.65, opacity: 1 });
    gsap.set(cRight, { x: window.innerWidth * 0.65, opacity: 1 });

    // Set of aesthetic images (Jaipur monuments, Nature, Cars, Tech, and Atharva's portrait)
    const baseImages = [
        'images/jaipur_1.jpg',   // Hawa Mahal
        'images/jaipur_2.jpg',   // Amber Fort
        'images/flow1.jpg',      // Nature
        'images/atharva.jpg',    // Atharva portrait
        'images/jaipur_3.jpg',   // Jaipur Street
        'images/flow2.jpg',      // Mountain
        'images/jaipur_4.jpg',   // Jal Mahal
        'images/flow3.jpg',      // Hill
        'images/jaipur_5.jpg',   // Desert
        'images/flow4.jpg',      // Car
        'images/jaipur_6.jpg',   // Jodhpur
        'images/flow5.jpg',      // Tech
        'images/jaipur_7.jpg',   // Taj Mahal
        'images/jaipur_8.jpg',   // Jaipur Palace
        'images/flow6.jpg',      // Forest
        'images/flow7.jpg',      // Ocean
        'images/flow8.jpg',      // Retro
        'images/jaipur_13.jpg',  // Lake
        'images/jaipur_14.jpg',  // Vintage Car
        'images/jaipur_15.jpg',  // Yosemite
        'images/atharva.jpg'     // Atharva portrait
    ];

    // Preload all preloader images in browser cache to prevent blank/invisible letter masking
    baseImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Build dense collections of 50+ images per row for a massive visual flow
    let set1 = [];
    let set2 = [];
    let set3 = [];
    let set4 = [];
    let set5 = [];
    let set6 = [];
    
    // Concatenate the image array 3 times to increase image count massively (approx 63 images per row)
    for (let i = 0; i < 3; i++) {
        set1 = set1.concat(baseImages);
        set2 = set2.concat([...baseImages].reverse());
        set3 = set3.concat(baseImages.slice(5).concat(baseImages.slice(0, 5)));
        set4 = set4.concat(baseImages.slice(10).concat(baseImages.slice(0, 10)).reverse());
        set5 = set5.concat(baseImages.slice(3).concat(baseImages.slice(0, 3)));
        set6 = set6.concat([...baseImages].reverse().slice(7).concat([...baseImages].reverse().slice(0, 7)));
    }

    // Populate the 6 rows dynamically
    const row1 = document.getElementById('flow-row-1');
    const row2 = document.getElementById('flow-row-2');
    const row3 = document.getElementById('flow-row-3');
    const row4 = document.getElementById('flow-row-4');
    const row5 = document.getElementById('flow-row-5');
    const row6 = document.getElementById('flow-row-6');

    const populateRow = (row, imageSet) => {
        imageSet.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = "Aesthetic Tapestry Element";
            row.appendChild(img);
        });
    };

    populateRow(row1, set1);
    populateRow(row2, set2);
    populateRow(row3, set3);
    populateRow(row4, set4);
    populateRow(row5, set5);
    populateRow(row6, set6);

    // Clone row children for infinite scrolling loops
    const cloneChildren = (row) => {
        const children = [...row.children];
        children.forEach(child => {
            const clone = child.cloneNode(true);
            row.appendChild(clone);
        });
    };
    cloneChildren(row1);
    cloneChildren(row2);
    cloneChildren(row3);
    cloneChildren(row4);
    cloneChildren(row5);
    cloneChildren(row6);

    // 1. Horizontal Scroll Animations (GSAP)
    let flowTweens = [];
    
    // Row 1: Scrolls right to left (RTL)
    flowTweens.push(gsap.to(row1, {
        x: () => -(row1.scrollWidth / 2),
        duration: 38,
        ease: "none",
        repeat: -1
    }));

    // Row 2: Scrolls left to right (LTR)
    gsap.set(row2, { x: () => -(row2.scrollWidth / 2) });
    flowTweens.push(gsap.to(row2, {
        x: 0,
        duration: 38,
        ease: "none",
        repeat: -1
    }));

    // Row 3: Scrolls right to left (RTL)
    flowTweens.push(gsap.to(row3, {
        x: () => -(row3.scrollWidth / 2),
        duration: 44,
        ease: "none",
        repeat: -1
    }));

    // Row 4: Scrolls left to right (LTR)
    gsap.set(row4, { x: () => -(row4.scrollWidth / 2) });
    flowTweens.push(gsap.to(row4, {
        x: 0,
        duration: 44,
        ease: "none",
        repeat: -1
    }));

    // Row 5: Scrolls right to left (RTL)
    flowTweens.push(gsap.to(row5, {
        x: () => -(row5.scrollWidth / 2),
        duration: 40,
        ease: "none",
        repeat: -1
    }));

    // Row 6: Scrolls left to right (LTR)
    gsap.set(row6, { x: () => -(row6.scrollWidth / 2) });
    flowTweens.push(gsap.to(row6, {
        x: 0,
        duration: 40,
        ease: "none",
        repeat: -1
    }));

    // Curve and perpendicular tilt render tick loop (Sphere-like U and opposite U curves)
    let frameId;
    function updateRowCurve() {
        const centerX = window.innerWidth / 2;
        const outerCurveDepth = 160; // Row 1 & Row 6
        const midCurveDepth = 90;    // Row 2 & Row 5
        const innerCurveDepth = 30;  // Row 3 & Row 4

        for (let rowIdx = 1; rowIdx <= 6; rowIdx++) {
            const rowImages = document.querySelectorAll(`#flow-row-${rowIdx} img`);
            
            // Row 1, 2, 3 curve UP in the center (opposite U: dome) -> y is negative
            // Row 4, 5, 6 curve DOWN in the center (U: bowl) -> y is positive
            let rowDepth = 0;
            if (rowIdx === 1) rowDepth = -outerCurveDepth;
            else if (rowIdx === 2) rowDepth = -midCurveDepth;
            else if (rowIdx === 3) rowDepth = -innerCurveDepth;
            else if (rowIdx === 4) rowDepth = innerCurveDepth;
            else if (rowIdx === 5) rowDepth = midCurveDepth;
            else if (rowIdx === 6) rowDepth = outerCurveDepth;

            rowImages.forEach(img => {
                // If the image is imploding during collision impact, skip frame tick placement
                if (img.getAttribute('data-imploding') === 'true') return;

                const rect = img.getBoundingClientRect();
                const imgCenterX = rect.left + rect.width / 2;
                const distFromCenter = imgCenterX - centerX;
                const normalizedDist = distFromCenter / centerX;
                
                // Parabolic dome / bowl: yOffset = rowDepth * (1 - dist^2)
                const yOffset = rowDepth * (1 - Math.pow(Math.abs(normalizedDist), 2));
                
                // Calculate tangent slope: dy/dx = -2 * rowDepth * normalizedDist / centerX
                const slope = (-2 * rowDepth * normalizedDist) / centerX;
                const angle = Math.atan(slope) * (180 / Math.PI);

                img.style.transform = `translateY(${yOffset}px) rotate(${angle * 0.85}deg)`;
            });
        }

        frameId = requestAnimationFrame(updateRowCurve);
    }
    frameId = requestAnimationFrame(updateRowCurve);    let imgIndex = 0;
    let flipTimeoutId = null;
    let tl;

    function skipPreloader() {
        if (!preloader || preloader.style.display === 'none') return;
        
        cancelAnimationFrame(frameId);
        if (flipTimeoutId) clearTimeout(flipTimeoutId);
        flowTweens.forEach(t => t.kill());
        
        if (tl) tl.kill();
        

        
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        
        gsap.set('main', { scale: 1, y: 0, filter: 'blur(0px)', opacity: 1 });
        const heroHeading = document.getElementById('hero-heading');
        if (heroHeading) heroHeading.classList.add('active');
        gsap.set('.hero-subtitle, .hero-meta, .hero-card, #header', { opacity: 1, y: 0, scale: 1 });
    }



    if (prefersReducedMotion) {
        // Skip preloader instantly
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        gsap.set('main', { scale: 1, y: 0, filter: 'blur(0px)', opacity: 1 });
        const heroHeading = document.getElementById('hero-heading');
        if (heroHeading) heroHeading.classList.add('active');
        gsap.set('.hero-subtitle, .hero-meta, .hero-card, #header', { opacity: 1, y: 0, scale: 1 });
    } else {
        tl = gsap.timeline({
            onComplete: () => {
                cancelAnimationFrame(frameId);
                if (flipTimeoutId) clearTimeout(flipTimeoutId);
                flowTweens.forEach(t => t.kill());
                preloader.style.display = 'none';
                document.body.style.overflow = ''; // Restore scroll
            }
        });

        // Combined Preloader Timeline Sequence (optimized for speed and reduced black screen wait time)
        tl.to({}, { duration: 0.3 }) // Let columns flow for 0.3s first
          
          // 2. COLLISION INBOUND: DESIGN & DEVELOP slide in on top of flowing grid
          .to(cLeft, {
              x: 0, // meet near center
              duration: 0.6,
              ease: "power2.inOut"
          })
          .to(cRight, {
              x: 0,
              duration: 0.6,
              ease: "power2.inOut"
          }, "-=0.6")
          
          // 3. COLLISION IMPACT: DESIGN/DEVELOP collide, columns collapse, and ATHARVA logo emerges
          .to({}, { duration: 0.05 }) // Pause on impact
          .to([cLeft, cRight], {
              opacity: 0,
              scale: 1.3,
              duration: 0.25,
              ease: "power2.out",
              onStart: () => {
                  // Trigger high-frequency preloader shake on impact
                  gsap.fromTo('#preloader', 
                      { x: -16, y: -12, rotation: -1.5 }, 
                      { x: 0, y: 0, rotation: 0, duration: 0.4, ease: "rough({ template: none, strength: 6, points: 20, taper: 'out', randomize: true })" }
                  );

                  // Trigger Shockwave Ring expansion
                  const shockwave = document.getElementById('marvel-shockwave');
                  gsap.fromTo(shockwave, 
                      { width: 10, height: 10, opacity: 1, xPercent: -50, yPercent: -50, left: "50%", top: "50%" },
                      { width: 2200, height: 2200, opacity: 0, duration: 0.7, ease: "power3.out" }
                  );

                  // Cinematic Implosion: All images fly to the viewport center and collapse
                  const allImages = document.querySelectorAll('.flow-row img');
                  const screenCenterX = window.innerWidth / 2;
                  const screenCenterY = window.innerHeight / 2;

                  allImages.forEach(img => {
                      const rect = img.getBoundingClientRect();
                      const imgCenterX = rect.left + rect.width / 2;
                      const imgCenterY = rect.top + rect.height / 2;
                      
                      const deltaX = screenCenterX - imgCenterX;
                      const deltaY = screenCenterY - imgCenterY;
                      
                      img.setAttribute('data-imploding', 'true');
                      
                      gsap.to(img, {
                          x: `+=${deltaX}`,
                          y: `+=${deltaY}`,
                          scale: 0.02,
                          opacity: 0,
                          rotation: gsap.utils.random(-180, 180),
                          duration: 0.6,
                          ease: "power3.in"
                      });
                  });

                  // Start rapid Marvel photo flip inside logo masking with recursive deceleration
                  let flipDelay = 20; // Start at a blazing 20ms flip frequency
                  let currentFlipIndex = 0;
                  
                  function runFlipLoop() {
                      if (tl.progress() > 0.95 || preloader.style.display === 'none') return;
                      logo.style.backgroundImage = `url('${baseImages[currentFlipIndex]}')`;
                      currentFlipIndex = (currentFlipIndex + 1) % baseImages.length;
                      
                      flipTimeoutId = setTimeout(runFlipLoop, flipDelay);
                  }
                  runFlipLoop();

                  // Ramped deceleration loop (aligned with faster zoom-out pullback duration)
                  const delayObj = { val: 20 };
                  gsap.to(delayObj, {
                      val: 95, // Decelerate to 95ms
                      duration: 1.3,
                      ease: "power2.out",
                      onUpdate: () => {
                          flipDelay = delayObj.val;
                      }
                  });
              }
          })
          // Sequence the emergence of the central logo in the collision dust: Zoom-in burst
          .fromTo(logo, 
              { opacity: 0, scale: 0.1 },
              { opacity: 1, scale: 1.35, duration: 0.65, ease: "back.out(1.4)" },
              "-=0.2"
          )
          .to([flowWrapper, cWrapper], {
              onStart: () => {
                  flowWrapper.classList.add('hidden');
                  cWrapper.classList.add('hidden');
              }
          }, "-=0.65")
          
          // 4. LOGO TIME-WARP PULLBACK: Slow zoom out from 1.35 down to 0.9 (faster duration)
          .to(logo, {
              scale: 0.9,
              duration: 1.4,
              ease: "power1.inOut"
          })
          
          // 5. CLIMAX PREP PULSE: Sharp camera snap right before the color flash
          .to(logo, {
              scale: 1.05,
              duration: 0.15,
              ease: "power2.out"
          })
          
          // 6. CLIMAX FLASH: Transform into solid orange Marvel card + lens flare flash (softer opacity)
          .to(logo, {
              onStart: () => {
                  if (flipTimeoutId) clearTimeout(flipTimeoutId);
                  logo.style.backgroundImage = 'none';
                  logo.style.backgroundColor = 'var(--orange)';
                  logo.style.webkitTextFillColor = 'var(--text-cream)';
                  logo.style.borderColor = 'var(--text-cream)';
              },
              duration: 0.05
          })
          .to(flash, {
              opacity: 0.45, // Reduced intensity from 1.0 to 0.45 (softer flash)
              duration: 0.1,
              ease: "power2.out"
          })
          
          // 7. SCREEN WIPE: Logo zooms in to scale 30 to wipe screen and dissolves into page
          .to(logo, {
              scale: 30,
              opacity: 0,
              duration: 0.35,
              ease: "power3.in"
          }, "-=0.05")
          .to(flash, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.out"
          }, "-=0.1")
          // Simultaneously zoom in the main landing page content (simulating camera zoom)
          .to('main', {
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
              opacity: 1,
              duration: 1.5,
              ease: "power4.out"
          }, "-=0.6")

          // Stagger reveal hero section elements
          .to('#hero-heading', {
              onStart: () => {
                  document.getElementById('hero-heading').classList.add('active');
              }
          }, "-=1.2")
          .fromTo('.hero-subtitle', 
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
              "-=0.9"
          )
          .fromTo('.hero-meta', 
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
              "-=0.8"
          )
          .fromTo('.hero-card', 
              { y: 35, opacity: 0, scale: 0.95 },
              { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
              "-=0.7"
          )
          .fromTo('#header', 
              { y: -100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
              "-=1.0"
          );
    }

    // Set Dynamic Availability Month
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const currentMonthEl = document.getElementById('current-month');
    if (currentMonthEl) {
        const d = new Date();
        currentMonthEl.innerText = monthNames[d.getMonth()];
    }

    // Light/Dark Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Determine active theme (localStorage -> system preference -> default dark)
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const activeTheme = savedTheme ? savedTheme : (systemPrefersLight ? 'light' : 'dark');
    
    // Apply active theme
    document.documentElement.setAttribute('data-theme', activeTheme);
    updateThemeIcon(activeTheme);
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-sun';
            themeIcon.style.color = '#ff9f00'; // Gold/orange sun color
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeIcon.style.color = ''; // Default cream color
        }
    }

    // Auto-set footer copyright year
    const footerYearEl = document.getElementById('footer-year');
    if (footerYearEl) {
        footerYearEl.innerText = new Date().getFullYear();
    }

    // Scroll Progress Bar Tracker
    const scrollProgressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScroll > 0) {
            const progressPercentage = (window.scrollY / totalScroll) * 100;
            scrollProgressBar.style.width = progressPercentage + '%';
        }
    });

    // Standard Custom Cursor with Smooth Lerp Lag Follow
    const cursorDot = document.getElementById('cursor-dot');
    const cursorCircle = document.getElementById('cursor-circle');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;
    let isMouseActive = false;

    // Cursors initially hidden to avoid flash or weird placement
    cursorDot.style.opacity = '0';
    cursorCircle.style.opacity = '0';
    cursorDot.style.transition = 'opacity 0.3s ease, transform 0.1s';
    cursorCircle.style.transition = 'opacity 0.3s ease, transform 0.25s cubic-bezier(0.215, 0.61, 0.355, 1)';

    document.addEventListener('mousemove', (e) => {
        if (!isMouseActive) {
            isMouseActive = true;
            cursorDot.style.opacity = '1';
            cursorCircle.style.opacity = '1';
        }
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorCircle.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        if (isMouseActive) {
            cursorDot.style.opacity = '1';
            cursorCircle.style.opacity = '1';
        }
    });

    function updateCursor() {
        // Dot follows cursor
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        
        // Circle follows with delay
        circleX += (mouseX - circleX) * 0.14;
        circleY += (mouseY - circleY) * 0.14;
        
        cursorCircle.style.left = circleX + 'px';
        cursorCircle.style.top = circleY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Cursor Hover Event Delegation (Supports static and dynamic content elements)
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .table-row, .footer-capsule, [data-case], .nav-menu-link, .nav-resume-btn, .case-modal-close');
        if (target) {
            document.body.classList.add('hovering');
        } else {
            document.body.classList.remove('hovering');
        }
    });

    // Mobile Navigation Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    mobileToggle.addEventListener('click', () => {
        const isActive = mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scroll offset calculation for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = 85;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Slide-In Case Studies Modals
    const caseModal = document.getElementById('case-modal');
    const caseModalOverlay = document.getElementById('case-modal-overlay');
    const caseModalCloseBtn = document.getElementById('case-modal-close-btn');
    const modalCaseBody = document.getElementById('modal-case-body');

    // Portfolio Case Studies Structured Data
    const projectDetails = {
        newsmind: {
            index: "01",
            title: "NewsMind.AI",
            subtitle: "AI-Powered News Intelligence Platform",
            desc: "NewsMind.AI is a real-time news analysis, comparison, and debate scoring platform using a hybrid LLM layout. Built with Llama and Gemini models, it balances high fidelity and processing cost by routing basic tasks to Llama models and deep analysis to Google's Gemini models.",
            tech: ["Node.js", "Express.js", "PostgreSQL", "Socket.io", "Gemini API", "Llama Core", "Python"],
            repo: "https://github.com/atharva22agarwal-afk/newsmind-ai",
            live: "https://newsmind-ai.vercel.app/",
            bullets: [
                "Built a real-time AI news analysis platform using hybrid LLM architecture with Llama and Gemini models.",
                "Implemented forensic bias detection by analyzing omission, entropy, and content density across news sources.",
                "Developed a live debate engine using Socket.io with real-time scoring based on logic, evidence, and sentiment analysis.",
                "Designed scalable backend APIs and optimized data pipelines using Node.js, Express.js, and PostgreSQL."
            ]
        },
        lumina: {
            index: "02",
            title: "Lumina",
            subtitle: "AI-Powered Personal Wellness Dashboard",
            desc: "Lumina is a comprehensive wellness dashboard combining affirmations, focus timers, mood logs, dynamic vision boards, and personalized meditation script generation using Groq AI and Playfair Display glassmorphic typography.",
            tech: ["React.js", "Groq AI API", "LocalStorage", "Framer Motion", "CSS Modules"],
            repo: "https://github.com/atharva22agarwal-afk/lumina",
            live: "https://luminaa-phi.vercel.app/",
            bullets: [
                "Developed a comprehensive wellness platform combining affirmations, AI-guided meditation, journaling, focus timers, mood tracking, and vision boards.",
                "Integrated Groq AI API for personalized meditation script generation and intelligent guidance with offline fallback support.",
                "Built reusable React components with Framer Motion animations for smooth page transitions and interactive UI elements.",
                "Implemented browser localStorage for persistent user data management across affirmations, mood history, journal entries, and vision boards.",
                "Designed a calming, spiritual UI with Playfair Display typography and glassmorphism effects for a premium experience."
            ]
        },
        scriptwriting: {
            index: "03",
            title: "The Silent Echo",
            subtitle: "Psychological Drama Screenplay",
            desc: "An industry-standard short film screenplay mapping out the psychological triggers and social blocks of anxiety. Employs non-linear pacing, emotional subtext, and heavy character dialogue design to construct a visceral storytelling experience.",
            tech: ["Screenplay Formatting", "Character Arc", "Dialogue Design", "Psychological Drama", "Storytelling"],
            repo: "#",
            live: "#",
            bullets: [
                "Wrote and conceptualized a short film script inspired by psychological themes and modern mental health storytelling.",
                "Focused on narrative structure, emotional depth, pacing, and audience empathy.",
                "Integrated screenplay guidelines with creative dialogues, utilizing formatting as a tool to convey visual cues and emotional beats."
            ]
        },
        seo_blogs: {
            index: "04",
            title: "SEO Copywriting",
            subtitle: "SEO Copywriting & Content Marketing Internship",
            desc: "A series of search-optimized awareness blogs written during a remote internship at InAmigos Foundation. Leverages keyword research, semantic search optimization, and creative storytelling hooks to drive organic user engagement.",
            tech: ["SEO Strategy", "Keyword Research", "Storytelling Hooks", "InAmigos Foundation", "Copywriting"],
            repo: "#",
            live: "https://inamigosfoundation.org.in/",
            bullets: [
                "Authored SEO-optimized blogs on social impact topics, increasing outreach engagement and search ranking visibility.",
                "Collaborated with the content team to align articles with campaigns and digital marketing goals.",
                "Applied research and content optimization techniques to improve readability, search performance, and user retention."
            ]
        }
    };

    let lastActiveElement = null;

    function openCaseModal(projectId) {
        const proj = projectDetails[projectId];
        if (!proj) return;
        
        lastActiveElement = document.activeElement;
        
        let techHtml = proj.tech.map(t => `<span class="skill-pill">${t}</span>`).join('');
        let bulletsHtml = proj.bullets.map(b => `
            <div class="modal-bullet-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>${b}</span>
            </div>
        `).join('');
        
        // Render project links conditionally (only if not '#')
        let linksHtml = '';
        if (proj.repo && proj.repo !== '#') {
            linksHtml += `<a href="${proj.repo}" target="_blank" class="modal-link"><i class="fa-brands fa-github"></i> repository</a>`;
        }
        if (proj.live && proj.live !== '#') {
            linksHtml += `<a href="${proj.live}" target="_blank" class="modal-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> live demo</a>`;
        }
        
        modalCaseBody.innerHTML = `
            <div class="modal-case-index">${proj.index}</div>
            <h3 class="modal-case-title uppercase">${proj.title}</h3>
            <div class="modal-case-subtitle">${proj.subtitle}</div>
            
            ${linksHtml ? `<div class="modal-case-links">${linksHtml}</div>` : ''}
            
            <p class="modal-case-desc">${proj.desc}</p>
            
            <div class="modal-case-section-title">Key Accomplishments</div>
            <div class="modal-case-bullets">
                ${bulletsHtml}
            </div>
            
            <div class="modal-case-section-title">Technologies & Skills</div>
            <div class="modal-case-tech">
                ${techHtml}
            </div>
        `;
        
        caseModal.classList.add('active');
        caseModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        
        // Focus first element inside modal
        setTimeout(() => {
            if (caseModalCloseBtn) caseModalCloseBtn.focus();
        }, 100);
    }

    function closeCaseModal() {
        if (!caseModal.classList.contains('active')) return;
        caseModal.classList.remove('active');
        caseModalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
        
        if (lastActiveElement) {
            lastActiveElement.focus();
        }
    }

    // Attach click listeners to case buttons
    const caseBtns = document.querySelectorAll('[data-case]');
    caseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-case');
            openCaseModal(projectId);
        });
    });

    if (caseModalCloseBtn) caseModalCloseBtn.addEventListener('click', closeCaseModal);
    if (caseModalOverlay) caseModalOverlay.addEventListener('click', closeCaseModal);

    // Keyboard handlers for modal (Escape to close, Tab to trap focus)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCaseModal();
        }
        
        // Trap focus inside modal
        if (caseModal && caseModal.classList.contains('active')) {
            const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
            if (!isTabPressed) return;
            
            const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            const focusableContent = caseModal.querySelectorAll(focusableElements);
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];
            
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Intersection Observer for scroll reveal elements (.reveal-up)
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // Interactive Duality Panel Switcher
    const dualitySwitch = document.querySelector('.duality-switch');
    const dualityBtns = document.querySelectorAll('.duality-btn');
    const panes = document.querySelectorAll('.about-pane');
    const codeCard = document.getElementById('about-code-card');
    const narrativeCard = document.getElementById('about-narrative-card');
    
    if (dualitySwitch) {
        dualityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                
                // Update button active state
                dualityBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update slider glider background position
                if (mode === 'narrative') {
                    dualitySwitch.classList.add('narrative-active');
                } else {
                    dualitySwitch.classList.remove('narrative-active');
                }
                
                // Cross-fade profile panes using GSAP
                panes.forEach(pane => {
                    if (pane.classList.contains(`pane-${mode}`)) {
                        pane.style.display = 'block';
                        gsap.fromTo(pane, 
                            { opacity: 0, y: 15 },
                            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                       );
                       pane.classList.add('active');
                    } else {
                       pane.classList.remove('active');
                       pane.style.display = 'none';
                    }
                });
                
                // Cross-fade side visual cards using GSAP
                if (mode === 'code') {
                    narrativeCard.classList.remove('active');
                    codeCard.classList.add('active');
                    gsap.fromTo(codeCard,
                        { opacity: 0, y: 20, scale: 0.96 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.2)" }
                    );
                } else {
                    codeCard.classList.remove('active');
                    narrativeCard.classList.add('active');
                    gsap.fromTo(narrativeCard,
                        { opacity: 0, y: 20, scale: 0.96 },
                        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.2)" }
                    );
                }
            });
        });
    }

    // ScrollSpy Navigation Sync
    const sections = document.querySelectorAll('section[id], header[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-menu-link');
    
    function scrollSpy() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active-scroll');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active-scroll');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Initial call

    // Preloader Safety Net Fallback (3.5 seconds maximum wait)
    setTimeout(() => {
        if (preloader && preloader.style.display !== 'none') {
            console.warn('Preloader safety net fallback triggered.');
            cancelAnimationFrame(frameId);
            if (flipTimeoutId) clearTimeout(flipTimeoutId);
            flowTweens.forEach(t => t.kill());
            
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scroll
                    
                    // Ensure main elements are fully visible and transitioned
                    gsap.set('main', { scale: 1, y: 0, filter: 'blur(0px)', opacity: 1 });
                    const heroHeading = document.getElementById('hero-heading');
                    if (heroHeading) heroHeading.classList.add('active');
                    gsap.set('.hero-subtitle, .hero-meta, .hero-card, #header', { opacity: 1, y: 0, scale: 1 });
                }
            });
        }
    }, 3500);

    // Console logs
    console.log(
        '%c✦ Atharva Agarwal — Portfolio Redesign ✦\n%cBrutalist minimalist systems active. Developer portfolio initialized.',
        'color: #ff4f00; font-size: 1.3rem; font-weight: bold; padding: 5px 0;',
        'color: #f8eee4; font-size: 0.95rem;'
    );
});
