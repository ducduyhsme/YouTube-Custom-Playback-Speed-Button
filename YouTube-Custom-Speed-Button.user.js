// ==UserScript==
// @name         YouTube Custom Speed Button (Per Video)
// @version      2.0
// @description  Adds a custom speed button to YouTube that remembers your preferred playback speed per video.
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';

    // Default playback speed
    // This constant defines the fallback speed if no custom speed is set for a video
    const DEFAULT_SPEED = 1;

    // Prevent re-entrant initialize during DOM mutations (to avoid freeze/recursion)
    // This flag prevents the initialize function from running multiple times simultaneously
    let isInitializing = false;

    // Get the current YouTube video ID from the URL
    // Supports watch, embed, and shorts URL formats
    function getVideoId() {
        const url = window.location.href;
        let id = null;
        if (url.includes('watch?v=')) {
            id = new URLSearchParams(window.location.search).get('v');
        } else if (url.includes('/embed/')) {
            id = url.split('/embed/')[1]?.split(/[?&]/)[0];
        } else if (url.includes('/shorts/')) {
            id = url.split('/shorts/')[1]?.split(/[?&]/)[0];
        }
        return id;
    }

    // Generate the storage key for this video
    // Each video gets its own key in storage for custom speed
    function getSpeedKey(videoId) {
        return `customPlaybackSpeed_${videoId}`;
    }

    // Get the custom speed for the current video ID
    // Returns the stored speed or the default if none exists
    function getCustomSpeed() {
        const videoId = getVideoId();
        if (!videoId) return DEFAULT_SPEED;
        return GM_getValue(getSpeedKey(videoId), DEFAULT_SPEED);
    }

    // Set the custom speed for the current video ID
    // Saves the chosen speed to storage for this video
    function setCustomSpeed(speed) {
        const videoId = getVideoId();
        if (!videoId) return;
        GM_setValue(getSpeedKey(videoId), speed);
    }

    // Set the playback rate for the video element
    // Applies the speed to the actual YouTube player
    function setSpeed(speed) {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = speed;
        }
    }

    // Update the button text to match the current video speed
    // Ensures the UI reflects the latest custom speed
    function updateButtonText() {
        const btn = document.querySelector('#custom-speed-button');
        if (btn) {
            btn.textContent = `${getCustomSpeed()}x`;
        }
    }

    // Create the custom speed button if it does not already exist
    // This function adds the button to YouTube's player controls
    function createSpeedButton() {
        if (document.querySelector('#custom-speed-button')) return;

        const controls = document.querySelector('.ytp-left-controls');
        if (!controls) return;

        // Inject style only once
        if (!document.querySelector('#custom-speed-style')) {
            const style = document.createElement('style');
            style.id = 'custom-speed-style';
            style.textContent = `
                .custom-speed-button {
                    display: flex;
                    color: white;
                    font-size: 14px;
                    line-height: 36px;
                    height: 36px;
                    cursor: pointer;
                    font-weight: bold;
                }
                .custom-speed-button:hover {
                    color: #ff0;
                }
            `;
            document.head.appendChild(style);
        }

        // Create button element
        const wrapper = document.createElement('div');
        wrapper.className = 'ytp-button custom-speed-button';
        wrapper.id = 'custom-speed-button';

        // Show speed for current video
        wrapper.textContent = `${getCustomSpeed()}x`;

        // Button click handler to change speed and update UI/storage
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentSpeed = getCustomSpeed();
            const newSpeed = prompt('Set custom playback speed (e.g., 1.25):', currentSpeed);
            if (newSpeed && !isNaN(parseFloat(newSpeed))) {
                setCustomSpeed(parseFloat(newSpeed)); // Save new speed for this video
                setSpeed(parseFloat(newSpeed));       // Apply new speed to video
                updateButtonText();                   // Update button to new value
            }
        });

        controls.appendChild(wrapper);
    }

    // Initialize: set the speed and make the button reflect the right value
    // This function is called whenever the video changes or the page is loaded
    function initialize() {
        if (isInitializing) return;
        isInitializing = true;

        setSpeed(getCustomSpeed());
        createSpeedButton();
        updateButtonText();

        setTimeout(() => { isInitializing = false; }, 100);
    }

    // Watch for navigation and update everything when video changes
    // Uses MutationObserver to detect YouTube's SPA navigation
    let lastVideoId = null;
    const observer = new MutationObserver(() => {
        const currentVideoId = getVideoId();
        // Only react if video changes or the button is missing
        if (
            currentVideoId &&
            (currentVideoId !== lastVideoId || !document.querySelector('#custom-speed-button'))
        ) {
            lastVideoId = currentVideoId;
            setTimeout(initialize, 200); // Wait a bit for video/controls to load
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run once initially
    setTimeout(initialize, 500);
})();
