// ==UserScript==
// @name         YouTube Custom Speed Button
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Saves setting across video whenever it is in playlist or not. Somehow version 1.2 is not working so I fixed it
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const iconUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAACVsSURBVHhe7Z0LlI3X+f+3iaqqqqqKZeksTVXUraqWqIilFiK0SFyKoiIiVhMqKiqWpT9Vy7LUUlFVVRUNFUklFUHcb3EXkohLaOqWuEuIIIkk7/98tv3O/8zMnplzzpzzXs77fNb6Zs7eMjPv+867n733s5/97DJKKScmQRAiSI75KghCBBEDIAgRRgyAIEQYMQCCEGHEAAhChBEDIAgRRgyAIEQYMQCCEGHEAAhChBEDIAgRRgyAIEQYMQCCEGHEAAhChBEDIAgRRgyAIEQYMQCCEGHEAAhChBEDIAgRRgyAIEQYyQmYxeTk5KgqVapoVa5cOU8VK1bUqlSpkvrwww/VZ599pr++//77+XT58mX9b0L2IgYghLgNu27duqpWrVqqevXq6vbbb1c1atRQVatW1eVq1app8f+WBgzB+fPntU6fPq115swZ9e677+o6vp48eVJ9+umn6osvvjDfJYQFMQABxW24NPBGjRqpevXqqe9973uqTp06WjT0oEDDxxj873//U0eOHFH79+9Xu3btUq+//rq6fv26GIYAIwYgINDg6bGbNGmi7rrrLtW0aVMt6sIKo4KDBw+qPXv2qJ07d+qvlJlWiFEIBmIAfIIGz1C9TZs2ql27dqpFixbqjjvuKPWQPejga2BkwAhh3bp16tVXX5VRgo+IAfAIGnaFChV0Q6fB0/AZ2pctW9b8H9EEg7B582a1atUqtXr1aj2NEMejd4gByCA0epx1HTp0UN26ddONHs+7YIdRwOHDh7UhwCBs27ZNffTRRzI6yCBiANIMjZ6ltrZt26qf//znqn379nrJTUgeliFffvlltXDhQj1KYKogpBcxAGmC4T09fL9+/XSjxwgI6eP48ePqueeeU4sWLdKORByMQukRA1AKmL/n5uaqPn366IbP8pyQWfAP7N27V48KXnjhBXX27FnxGZQCMQApQG/fqlUr9dBDD6mOHTvqsuA9TAleeeUVNWvWLD1FkFFB8ogBSAIcer169VKPPvqoDswRggFOwh07dqjp06erFStWaMehkBhiAErAXa8fMGCAeuSRR/SQXwgu+Admzpyp/QWE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';

    function setSpeedFromStorage() {
        const savedSpeed = localStorage.getItem('customPlaybackSpeed');
        if (savedSpeed) {
            const video = document.querySelector('video');
            if (video) {
                const fraction = savedSpeed.includes('/') ? eval(savedSpeed) : parseFloat(savedSpeed);
                if (!isNaN(fraction)) {
                    video.playbackRate = fraction;
                }
            }
        }
    }

    function createSpeedButton() {
        if (document.getElementById('custom-speed-btn')) return;

        const player = document.querySelector('.html5-video-player');
        if (!player) return;

        const btn = document.createElement('div');
        btn.id = 'custom-speed-btn';
        btn.style.position = 'absolute';
        btn.style.bottom = '60px';
        btn.style.left = '20px';
        btn.style.zIndex = '9999';
        btn.style.cursor = 'move';

        const img = document.createElement('img');
        img.src = iconUrl;
        img.style.width = '40px';
        img.style.height = '40px';
        img.style.opacity = '0.85';
        img.title = 'Set custom video speed';

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = prompt('Enter playback speed (e.g. 1.25 or 3/4):');
            if (!input) return;
            const video = document.querySelector('video');
            try {
                const fraction = input.includes('/') ? eval(input) : parseFloat(input);
                if (video && !isNaN(fraction)) {
                    video.playbackRate = fraction;
                    localStorage.setItem('customPlaybackSpeed', input);
                }
            } catch (error) {
                console.error('Invalid input for playback speed:', error);
            }
        });

        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            btn.style.display = 'none';
        });

        btn.appendChild(img);
        player.appendChild(btn);

        let isDragging = false;
        let offsetX, offsetY;

        btn.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - btn.offsetLeft;
            offsetY = e.clientY - btn.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                btn.style.left = `${e.clientX - offsetX - player.getBoundingClientRect().left}px`;
                btn.style.top = `${e.clientY - offsetY - player.getBoundingClientRect().top}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    function onVideoChange() {
        setSpeedFromStorage();
        createSpeedButton();
    }

    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('loadeddata', setSpeedFromStorage, { once: true });
        }
        createSpeedButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('yt-navigate-finish', onVideoChange);
})();
